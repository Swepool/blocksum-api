const app = require('express')();
const cors = require("cors");
const PORT = 8081

//Set CORS
app.use(cors({
    methods: ['GET']
}));

//Get routes
const nodeRoute = require('./routes/get-nodes')
app.use('/nodes', nodeRoute)

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)
