const router = require('express').Router();
const fetch = require("cross-fetch");

let obj = []
let currentSpread

setInterval(async function start() {
    const timeNow = new Date();
    const time = timeNow.toLocaleTimeString(('no-NN', {timeStyle: 'short', hour12: false}))

    await fetch('https://www.kaupangkrypto.no/api/price/?coin=btc')
        .then(res => {
            if (!res.ok) {
                throw Error('Status not ok')
            }
            return res.json()
        })
        .then(data => {
            currentSpread = (((data[0].buy - data[0].sell) / data[0].ask) * 100).toFixed(2)
        }).catch(err => console.log(err))

   await createList(time, currentSpread)

},60000)

async function createList(time, data) {
    obj.push({
        "time": time,
        "spread": data
    })
    if(obj.length > 1440) {
        obj.shift()
    }
    console.log('🚨 Writing Kaupang Spread')
}

//Listen for /nodes
router.get('/', (req, res) => {
    res.status(200).send({spread: obj})
})

module.exports = router