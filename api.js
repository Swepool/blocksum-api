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
const spreadRoute = require('./routes/nbx/nbx-spread')
app.use('/nbx/spread', cors(corsOptions), spreadRoute)


//Firi
const spreadFiriRoute = require('./routes/firi/firi-spread')
app.use('/firi/spread', cors(corsOptions), spreadFiriRoute)

//Kaupang
const spreadKaupangRoute = require('./routes/kaupang/kaupang-spread')
app.use('/kaupang/spread', cors(corsOptions), spreadKaupangRoute)

//Handlekrypto
const spreadHandlekryptoRoute = require('./routes/handlekrypto/handlekrypto-spread')
app.use('/handlekrypto/spread', cors(corsOptions), spreadHandlekryptoRoute)

//Bitmynt
const spreadBitmyntRoute = require('./routes/bitmynt/bitmynt-spread')
app.use('/bitmynt/spread', cors(corsOptions), spreadBitmyntRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
