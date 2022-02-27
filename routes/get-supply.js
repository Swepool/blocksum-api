const express = require('express')
const router = require('express').Router();
const fetch = require("cross-fetch");
const cors = require("cors");

const corsOptions = {
    origin: '*',
    method: ['GET']
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let getSupply = []

async function getLatest() {
    console.log("🚨 Getting supply")
    const response = await fetch('https://blocksum.org/api/json_rpc', {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "getlastblockheader",
            params: {
            }
        })
    });
    const data = await response.json()
    getByBlockHash(data.result.block_header.hash)
}

async function getByBlockHash(hash) {
    getSupply = []
    const response = await fetch('https://blocksum.org/api/json_rpc', {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_block_json",
            params: {
                hash: hash
            }
        })
    });
    const data = await response.json();
    supplyJSON(numberWithCommas((data.result.block.alreadyGeneratedCoins).slice(0, -5)))
}


//Create list of nodes
function supplyJSON(current) {
    getSupply.push({
        current,
        "max": "1,000,000,000"
    })
}

setInterval(getLatest, 60000)
getLatest()


//Listen for /nodes
router.get('/', cors(corsOptions), (req, res) => {
    res.status(200).send({supply: getSupply})
})

module.exports = router