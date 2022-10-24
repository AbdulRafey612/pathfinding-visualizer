import {TOTAL_ROWS,TOTAL_COLUMNS}
from "../PathfindingVisualizer/PathfindingVisualizer";
export default function dijkstra(grid, startNode, endNode)
{
	if(!startNode || !endNode || startNode === endNode)
	{
		return false;
	}

	const visitedNodesInOrder = [];
	startNode.distance = 0;
	const unvisitedNodes = getAllNodes(grid);
	while(!!unvisitedNodes.length)
	{
		sortNodesByDistance(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if(closestNode.isWall) continue; 
		if(closestNode.distance == Infinity) return visitedNodesInOrder;
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);
		if(closestNode == endNode)
			return visitedNodesInOrder;
		updateUnvisitedNeighbours(closestNode,grid);
	}
	return visitedNodesInOrder;
}

const updateUnvisitedNeighbours = (node,grid)=>{
	const unvisitedNeighbours = getUnvisitedNeighbours(node,grid);
	unvisitedNeighbours.map((n)=>{
		n.distance = node.distance+1;
		n.previousNode = node;
		return n;
	});
}

const getUnvisitedNeighbours = (node,grid) =>{
	const neighbours = [];
	if(node.row>0)
		neighbours.push(grid[node.row-1][node.col]);
	if(node.col>0)
		neighbours.push(grid[node.row][node.col-1]);
	if(node.row<TOTAL_ROWS-1)
		neighbours.push(grid[node.row+1][node.col]);
	if(node.col<TOTAL_COLUMNS-1)
		neighbours.push(grid[node.row][node.col+1]);
	return neighbours.filter(n=> !n.isVisited);

}

const sortNodesByDistance=(Nodes)=>{
		Nodes.sort((a,b)=>{
							return a.distance-b.distance
						});
}

const getAllNodes=(grid)=>{
	let newGrid = [].concat(...grid);
	return newGrid;
}

export const getShortestPath=(finishNode)=>{
	let currentNode = finishNode;
	let nodes = [];
	while(currentNode != Infinity)
	{
		nodes.push(currentNode);
		currentNode = currentNode.previousNode;
	}
	console.log(nodes[nodes.length]);
	return nodes;
}