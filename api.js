const app = require('express')();
const cors = require("cors");
const PORT = 8080

const corsOptions = {
    origin: '*',
    method: ['GET']
}

const nodesRoute = require('./routes/get-nodes')
app.use('/nodes', cors(corsOptions), nodesRoute)

const poolsRoute = require('./routes/get-pools')
app.use('/pools', cors(corsOptions), poolsRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
