import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getNodeUrl = () => {
 
  return "https://astar.blastapi.io/fd3c7419-5ece-4868-b356-5c73234de3c8"
}

export default getNodeUrl
