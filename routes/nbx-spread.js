const router = require('express').Router();
const fetch = require("cross-fetch");


let obj = []
let currentSpread
let price

setInterval(async function start() {
    const timeNow = new Date();
    const time = timeNow.toLocaleString(('no', { hour: 'numeric', hour12: true,  }))

    await fetch('https://api.nbx.com/markets/btc-nok/orders')
        .then(res => {
            if (!res.ok) {
                throw Error('Status not ok')
            }
            return res.json()
        })
        .then(data => {
            if (data[1].price > data[0].price) {
                currentSpread = (data[1].price - data[0].price)
            }
        }).catch(err => console.log(err))

    await fetch('https://api.nbx.com/markets/btc-nok/trades')
        .then(res => {
            if (!res.ok) {
                throw Error('Status not ok')
            }
            return res.json()
        })
        .then(data => {
            price = data[0].price
        }).catch(err => console.log(err))

    const spread = ((currentSpread / price) * 100).toFixed(2)

   await createList(time, spread)

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