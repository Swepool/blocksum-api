const router = require('express').Router();
const fetch = require("cross-fetch");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let timestamp
let SUPPLY
const MAX = 100000000000000
const COIN_UNITS = 100000
const DECIMALS = 5

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
    timestamp = Date.now()
    SUPPLY = data.result.block.alreadyGeneratedCoins
}

setInterval(getLatest, 60000)
getLatest()

router.get('/', (req, res) => {
    res.status(200).send({
        lastCheck: timestamp,
        circulatingUnits: parseInt(SUPPLY),
        maxUnits: MAX,
        coinUnits: COIN_UNITS,
        decimals: DECIMALS,
        calculatedSupply: SUPPLY / COIN_UNITS,
        calculatedMaxSupply: MAX / COIN_UNITS,
    })
})

module.exports = router