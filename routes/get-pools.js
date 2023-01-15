const router = require('express').Router();
const axios = require("axios");

let poolList = [
    {name: "Swepool", href: "https://swepool.org", url: "https://swepool.org/api/stats"},
    {name: "Norpool", href: "https://norpool.org", url: "https://norpool.org/api/stats"},
    {name: "Pool-pay", href: "https://xkr.pool-pay.com", url: "https://xkr.pool-pay.com:5383/stats"},
    {name: "Privacymine", href: "https://privacymine.net", url: "https://privacymine.net:8117/stats"},
    {name: 'Newpool', href: 'https://newpool.pw/xkr/', url: 'https://minenice.newpool.pw:8247/stats'},
    {name: 'Pool Kryptokrona', href: 'https://pool.kryptokrona.se', url: 'https://pool.kryptokrona.se/api/stats'}
]

let pools = []
let timestamp
let miners
let workers

function checkPools() {
    timestamp = Date.now()
    miners = 0
    workers = 0
    pools = []
    poolList.forEach(function (pool) {
        const startTime = Date.now();
        axios.get(pool.url, {timeout: 1000 * 30, headers: {'Accept-Encoding': 'zlib'}})
            .then(function (res) {
                createPoolList(pool, res.data)
                miners += res.data.pool.miners !== undefined ? res.data.pool.miners : 0
                miners += res.data.pool.minersSolo !== undefined ? res.data.pool.minersSolo : 0
                workers += res.data.pool.workers !== undefined ? res.data.pool.workers : 0
                workers += res.data.pool.workersSolo !== undefined ? res.data.pool.workersSolo : 0
                console.log(`POOL CHECK - ${pool.name} seems to be online 🥳`)
            })
            .catch(function (error) {
                console.log(`POOL CHECK - ${pool.name} seems to be offline 🥶`)
            });
    });
}

//Create list of nodes
function createPoolList(pool, data) {
    pools.push({
        name: pool.name,
        url: pool.href,
        data
    })
}

setInterval(checkPools, 1000 * 60)
checkPools()

router.get('/', (req, res) => {
    res.status(200).send(({
            lastCheck: timestamp,
            totalMiners: miners,
            totalWorkers: workers,
            poolsOnline: pools.length,
            poolsChecked: poolList,
            pools: pools
        }
    ))
})

router.get("/:name", (req, res) => {
  let pool;
  let name = req.params.name;
  for (let i = 0; i < pools.length; i++) {
    if (pools[i].name == name) {
      pool = pools[i];
      break;
    }
  }

  if (!pool) {
    res.status(404).send({ message: name + " not found" });
  }

  res.status(200).send(pool);
})

module.exports = router