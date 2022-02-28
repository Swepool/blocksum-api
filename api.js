const app = require('express')();
const cors = require("cors");
const PORT = 8080

const corsOptions = {
    origin: '*',
    method: ['GET']
}

//XKR

const nodesRoute = require('./routes/get-nodes')
app.use('/nodes', cors(corsOptions), nodesRoute)

const poolsRoute = require('./routes/get-pools')
app.use('/pools', cors(corsOptions), poolsRoute)

const supplyRoute = require('./routes/get-supply')
app.use('/supply', cors(corsOptions), supplyRoute)

//NBX
const spreadNbxRoute = require('./routes/nbx/nbx-spread')
app.use('/nbx/spread', cors(corsOptions), spreadNbxRoute)

const priceNbxRoute = require('./routes/nbx/nbx-price')
app.use('/nbx/price', cors(corsOptions), priceNbxRoute)


//Firi
const spreadFiriRoute = require('./routes/firi/firi-spread')
app.use('/firi/spread', cors(corsOptions), spreadFiriRoute)

const priceFiriRoute = require('./routes/firi/firi-price')
app.use('/firi/price', cors(corsOptions), priceFiriRoute)

//Kaupang
const spreadKaupangRoute = require('./routes/kaupang/kaupang-spread')
app.use('/kaupang/spread', cors(corsOptions), spreadKaupangRoute)

const priceKaupangRoute = require('./routes/kaupang/kaupang-price')
app.use('/kaupang/price', cors(corsOptions), priceKaupangRoute)

//Handlekrypto
const spreadHandlekryptoRoute = require('./routes/handlekrypto/handlekrypto-spread')
app.use('/handlekrypto/spread', cors(corsOptions), spreadHandlekryptoRoute)

const priceHandlekryptoRoute = require('./routes/handlekrypto/handlekrypto-price')
app.use('/handlekrypto/price', cors(corsOptions), priceHandlekryptoRoute)

// ------- Bitmynt ------
const spreadBitmyntRoute = require('./routes/bitmynt/bitmynt-spread')
app.use('/bitmynt/spread', cors(corsOptions), spreadBitmyntRoute)

const priceBitmyntRoute = require('./routes/bitmynt/bitmynt-price')
app.use('/bitmynt/price', cors(corsOptions), priceBitmyntRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
