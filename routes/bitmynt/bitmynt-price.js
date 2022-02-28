const router = require('express').Router();
const fetch = require("cross-fetch");

let obj = []
let currentAsk
let currentBid

setInterval(async function start() {
    const timeNow = new Date();
    const time = timeNow.toLocaleTimeString(('no-NN', {timeStyle: 'short', hour12: false}))

    await fetch('https://bitmynt.no/ticker-nok.pl')
        .then(res => {
            if (!res.ok) {
                throw Error('Status not ok')
            }
            return res.json()
        })
        .then(data => {
            currentAsk = Math.round(data.nok.sell)
            currentBid = Math.round(data.nok.buy)
        }).catch(err => console.log(err))

   await createList(time, currentAsk, currentBid)

},60000)

async function createList(time, ask, bid) {
    obj.push({
        "time": time,
        "ask": ask,
        "bid": bid,
    })
    if(obj.length > 1440) {
        obj.shift()
    }
    console.log('🚨 Writing Bitmynt Price')
}

//Listen for /nodes
router.get('/', (req, res) => {
    res.status(200).send({prices: obj})
})

module.exports = router