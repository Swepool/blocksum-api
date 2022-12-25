const router = require('express').Router();
const axios = require('axios')
const nodeList = require('../lib/nodes')

let nodes = []
let timestamp

function checkNodeStatus() {
    timestamp = Date.now()
    nodeList.forEach(function (node) {
        const startTime = Date.now();
        axios.get(`http://${node.url}:${node.port}/getinfo`, {timeout: 1000 * 30})
            .then(function (res) {
                createNodeList(node, res.data)
                console.log(`NODE CHECK - ${node.url} seems to be online 🥳`)
            })
            .catch(function (error) {
                createNodeList(node, false)
                console.log(`NODE CHECK - ${node.url} seems to be offline 🥶`)
            });
    });
}

function createNodeList(node, data) {
    if (data) {
        nodes.push({
            nodeName: node.name,
            nodeUrl: node.url,
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
    } else if(!data) {
        nodes.push({
            nodeName: node.name,
            nodeUrl: node.url,
            nodePort: node.port,
            nodeFee: node.fee,
            nodeSsl: node.ssl,
            nodeHeight: 0,
            connectionsIn: 0,
            connectionsOut: 0,
            nodeSynced: 'OFFLINE',
            nodeStatus: 'OFFLINE',
            nodeVersion: 'OFFLINE'
        })
    }
}

setInterval(checkNodeStatus, 1000 * 60)
checkNodeStatus()

router.get('/', (req, res) => {
    res.status(200).send(
        {
            lastCheck: timestamp,
            nodesChecked: nodeList.length,
            nodesOnline: nodes.length,
            nodes: nodes
        })
})

module.exports = router