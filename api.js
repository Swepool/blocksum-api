const app = require('express')();
const fetch = require('cross-fetch')
const cors = require('cors');
const PORT = 8080

//Start message
app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT} 🥳`)
)

app.use(cors({
    methods: ['GET']
}));

let nodes = []

//Fetch list from github and iterate over all nodes
function getNodeData() {
    console.log("🚨 Getting nodes")
    nodes = []
    fetch(`https://raw.githubusercontent.com/kryptokrona/kryptokrona-nodes-list/master/nodes.json`)
        .then(res => res.json())
        .then(data => {
            for (const node of data.nodes){
                fetch('http://' + node.url + ':11898/getinfo')
                    .then(res => res.json())
                    .then(data => {
                        createNodeList(node, data)
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
}

//Create list of nodes
function createNodeList(node, data) {
    nodes.push({
        nodeName: node.name,
        nodeUrl:node.url,
        nodePort: node.port,
        nodeFee: node.fee,
        nodeSsl: node.ssl,
        nodeHeight: data.height,
        connectionsIn: data.incoming_connections_count,
        connectionsOut: data.outgoing_connections_count,
        nodeSynced: data.synced,
        nodeStatus: data.status,
        nodeVersion: data.version
    })
}

setInterval(getNodeData, 90000)


//Listen for /nodes
app.get('/nodes', (req, res) => {
    res.status(200).send({nodes})
})