const router = require('express').Router();
const axios = require('axios')

let nodes = []
let timestamp
let nodesChecked = 0;

function fetchNodes() {
    axios
      .get(
        "https://raw.githubusercontent.com/kryptokrona/kryptokrona-public-nodes/main/nodes.json"
      )
      .then(function (res) {
        let _nodes = res.data.nodes;
        if (!_nodes) return;
  
        nodesChecked = _nodes.length;
  
        for (let i = 0; i < _nodes.length; i++) {
          fetchNode(_nodes[i]);
        }
    })
    .catch(function (error) {
        console.log(`Failed fetching nodes - ${error}`);
    });
}
  
function fetchNode(node) {
    axios
      .get(`http://${node.url}:${node.port}/getinfo`, { timeout: 1000 * 30 })
      .then(function (res) {
        createNodeList(node, res.data);
    })
    .catch(function (error) {
        createNodeList(node, false);
    });
}
  
function checkNodeStatus() {
    timestamp = Date.now();
    nodes = [];
  
    fetchNodes();
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
            nodesChecked: nodesChecked,
            nodesOnline: nodes.length,
            nodes: nodes
        })
})

module.exports = router