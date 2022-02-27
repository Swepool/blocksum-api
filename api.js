const app = require('express')();
const cors = require("cors");
const PORT = 8081

const nodeRoute = require('./routes/get-nodes')
app.use('/nodes', nodeRoute)

//Set CORS
app.use(cors({
    methods: ['GET']
}));

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
