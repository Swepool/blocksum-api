const app = require('express')();
const cors = require("cors");
const PORT = 8081

app.use(cors({
    methods: ['GET']
}))

const nodeRoute = require('./routes/get-nodes')
app.use('/nodes', cors({methods: ['GET']}), nodeRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
