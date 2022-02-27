const app = require('express')();
const cors = require("cors");
const PORT = 8081

const corsOptions = {
    origin: '*',
    method: ['GET']
}

const nodeRoute = require('./routes/get-nodes')
app.use('/nodes', cors(corsOptions), nodeRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
