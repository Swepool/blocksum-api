const express = require('express')
const router = require('express').Router();
const fetch = require("cross-fetch");
const cors = require("cors");


let poolList = [
    {"name": "Swepool", "url": "https://swepool.org/api/stats"},
    {"name": "Norpool", "url": "https://norpool.org/api/stats"},
    {"name": "Pool-pay", "url": "https://xkr.pool-pay.com:5383/stats"},
    {"name": "Gamersnest USA", "url": "https://usapool.gamersnest.org/api/stats"},
    {"name": "Privacymine", "url": "https://privacymine.net:8117/stats"},
    {"name": "Gamersnest", "url": "https://pool.gamersnest.org/api/stats"},
    {"name": "Drakpool", "url": "https://drakpool.com/api/stats"},
]

let pools = []

//Fetch list from github and iterate over all nodes
function getPoolData() {
    console.log("🚨 Getting pools")
    pools = []
    for (const pool of poolList) {
        fetch(pool.url)
            .then(res => res.json())
            .then(data => {
                createPoolList(pool, data)
            })
            .catch(err => console.log(err))
    }
}

//Create list of nodes
function createPoolList(pool, data) {

    pools.push({
        name: pool.name,
        fee: data.config.fee,
        hashrate: data.pool.hashrate,
        hashrateSolo: data.pool.hashrateSolo,
        miners: data.pool.miners,
        minersSolo: data.pool.minersSolo,
        minPayOut: data.config.minPaymentThreshold,
        payments: data.pool.totalPayments,
        minersPaid: data.pool.totalMinersPaid,
    })
}

setInterval(getPoolData, 90000)
getPoolData()


router.get('/', (req, res) => {
    res.status(200).send({pools})
})

module.exports = router