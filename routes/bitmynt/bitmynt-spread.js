const router = require('express').Router();
const fetch = require("cross-fetch");

let obj = []
let currentSpread

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
            let ask = data.nok.sell
            let bid = data.nok.buy
            currentSpread = (((ask - bid) / ask) * 100).toFixed(2)
            console.log(currentSpread)
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
    console.log('Writing ✏️')
}

//Listen for /nodes
router.get('/', (req, res) => {
    res.status(200).send({spread: obj})
})

module.exports = router