const express = require('express')
const router = require('express').Router();
const fetch = require("cross-fetch");
const cors = require("cors");


let poolList = [
    {"name": "swepool", "url": "https://swepool.org/api/stats"},
    {"name": "norpool", "url": "https://norpool.org/api/stats"}
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
        poolName: pool.name,
        data
    })
}

setInterval(getPoolData, 90000)
getPoolData()


router.get('/', (req, res) => {
    res.status(200).send({pools})
})

module.exports = router