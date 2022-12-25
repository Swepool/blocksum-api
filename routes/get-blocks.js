const express = require('express')
const router = require('express').Router();
const fetch = require("cross-fetch");
const cors = require("cors");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let blocks = []
let lastblock

async function getLatest() {
    const response = await fetch('https://blocksum.org/api/json_rpc', {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "Blocksum",
            method: "getlastblockheader",
            params: {
            }
        })
    });
    const data = await response.json()

    console.log('running 1')
    if(lastblock) {
        console.log("old: " + lastblock.result.block_header.height + " new: " + data.result.block_header.height)
        if(lastblock.result.block_header.height < data.result.block_header.height) {
            console.log('running 2')
            createBlockList(data.result.block_header)
        }
    }

    lastblock = data

}

function createBlockList(block) {
    console.log('running 3')
    blocks.unshift({
        height: block.height,
        hash: block.hash,
        diff: block.difficulty,
        transactions: block.num_txes,
        reward: block.reward,
        time: block.timestamp
    })
}
//setInterval(getLatest, 45000)
//getLatest()



//Listen for /nodes
router.get('/', (req, res) => {
    res.status(200).send({blocks})
})

module.exports = router