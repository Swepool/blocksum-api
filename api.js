const app = require('express')();
const fetch = require('cross-fetch')
const PORT = 8080

//Start message
app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)

//List of nodes
let nodeList = [
    {"name": "Blocksum","url": 'http://blocksum.org:11898'},
    {"name": "Gota","url": 'http://gota.kryptokrona.se:11898'},
    {"name": "Gota","url": 'http://gota.kryptokrona.se:11898'},
]

let nodes = []

function getNodeData() {
    console.log("Running")
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

nodes = []
setInterval(getNodeData, 10000)
//Listen for /nodes
app.get('/nodes', (req, res) => {
    res.status(200).send({nodes})
})