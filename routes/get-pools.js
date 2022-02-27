const express = require('express')
const router = require('express').Router();
const fetch = require("cross-fetch");
const cors = require("cors");


let poolList = [
    {"name": "Swepool", "href": "https://swepool.org", "url": "https://swepool.org/api/stats"},
    {"name": "Norpool", "href": "https://norpool.org", "url": "https://norpool.org/api/stats"},
    {"name": "Pool-pay", "href": "https://xkr.pool-pay.com", "url": "https://xkr.pool-pay.com:5383/stats"},
    {"name": "Gamersnest USA", "href": "https://usapool.gamersnest.org", "url": "https://usapool.gamersnest.org/api/stats"},
    {"name": "Privacymine", "href": "https://privacymine.net", "url": "https://privacymine.net:8117/stats"},
    {"name": "Gamersnest", "href": "https://pool.gamersnest.org", "url": "https://pool.gamersnest.org/api/stats"},
    {"name": "Drakpool", "href": "https://drakpool.org", "url": "https://drakpool.com/api/stats"},
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
        url: pool.href,
        data
    })
}

setInterval(getPoolData, 90000)
getPoolData()


router.get('/', (req, res) => {
    res.status(200).send({pools})
})

module.exports = router