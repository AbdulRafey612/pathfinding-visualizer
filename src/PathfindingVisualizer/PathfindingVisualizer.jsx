import React, {Component} from 'react';
import Node from './Node';
import './PathfindingVisualizer.css';
import dijkstra, {getShortestPath} from '../Algorithms/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 40;

export const TOTAL_ROWS = 20;
export const TOTAL_COLUMNS = 46;

const createGrid = () =>{
	const grid = [];
	for(var k=0;k<TOTAL_ROWS;k++)
	{			
		grid.push(createRow(k));
	}
	return grid;
};

const createRow = (row_num)=>{
	const row = [];
	var isStart;
	var isEnd;
	for(var col=0;col<TOTAL_COLUMNS;col++)
	{
		row.push(createNode(row_num,col));
	}
	return row;
};

const createNode = (row,col)=>{
	return {
		col,
		row,
		isStart: row === START_NODE_ROW && col === START_NODE_COL,
		isEnd: row == END_NODE_ROW && col === END_NODE_COL,
		distance: Infinity,
		isVisited: false,
		isWall: false,
		previousNode: null
	};
};



export default class PathfindingVisualizer extends Component{
	constructor(props){
		super(props);
		this.state = {
			grid : [],
			mouseIsPressed: false
		}
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.animateDijsktra = this.animateDijsktra.bind(this);
	}
	

	componentDidMount() {
		const grid = createGrid();
		// for(let row = 0; row<15; row++)
		// {
		// 	const currentRow = [];
		// 	for(let col = 0; col < 50; col++)
		// 	{
		// 		const currentNode = {
		// 			col,
		// 			row,
		// 			isStart: row === 7 && col == 5,
		// 			isEnd: row === 7 && col == 45
		// 		}
		// 		currentRow.push(currentNode);
		// 	}
		// 	grid.push(currentRow);
		// }
		this.setState({grid});
	}

	handleMouseDown(row, col)
	{
		console.log("Mouse is Down",row,col);
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState((pervState)=>{return {grid: newGrid, mouseIsPressed: true}})
	}

	handleMouseUp(){
		console.log("Mouse is Pressed");
		this.setState((pervState)=>{return {mouseIsPressed: false}});
	}

	handleMouseEnter(row,col)
	{
		console.log("Mouse is Entered");
		if(!this.state.mouseIsPressed) return;
		const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
		this.setState((pervState)=>{return {grid: newGrid, mouseIsPressed: true}});	
	}

	async animateDijsktra(visitedNodesInOrder,shortest_path)
	{
		for(let i=0;i<=visitedNodesInOrder.length;i++)
		{
			if(visitedNodesInOrder.length === i)
			{
				setTimeout(()=>{
					this.animateShortestPath(shortest_path);
				},15*i);
				return;
			}
			setTimeout(()=>{
				const node = visitedNodesInOrder[i];
				const newGrid = this.state.grid.slice();
				let isAnimated = true;
				const element = document.getElementById(`${node.row}-${node.col}`);
				if(!(node.isStart || node.isEnd))
				{
					element.className += ' animated';
				}
				
				// const newNode = {
				// 	...node,
				// 	isAnimated: isAnimated
				// };
				// newGrid[node.row][node.col] = newNode;
				// this.setState({grid: newGrid});
			},15 * i);
		}
			
	}
	animateShortestPath(shortest_path){
		console.log("Invoked ",shortest_path.length);
		for(let i=0;i<shortest_path.length;i++)
		{
			setTimeout(()=>{
				const node = shortest_path[i];
				const element = document.getElementById(`${node.row}-${node.col}`);
				element.className += ' shortest_path';
			},20 * i);
		}
	}

	visualizeDijsktra(){
		const grid = JSON.parse(JSON.stringify(this.state.grid),(key,value)=> value == null? Infinity: value);
		const startNode = grid[START_NODE_ROW][START_NODE_COL];
		const endNode = grid[END_NODE_ROW][END_NODE_COL];
		const dijkstra_results = dijkstra(grid,startNode,endNode);
		const shortest_path = getShortestPath(endNode);
		console.log(shortest_path);
		this.animateDijsktra(dijkstra_results,shortest_path);
	}

	render(){
	const {grid,mouseIsPressed} = this.state;

		return(
			<div>
				Foo
			{/*this.createGrid()*/}
			<button onClick={()=>this.visualizeDijsktra()}>
			Visualize dijkstra
			</button>
			<div className="grid">
			{grid.map((row,rowIndx)=>{
				return <div key={rowIndx} className="row">
						{row.map((node,nodeIndx)=>{
							const {isStart,isEnd,isAnimated,isWall,row,col} = node;
							return(
								<Node 
									key={nodeIndx} 
									isStart={isStart} 
									isEnd={isEnd} 
									isAnimated={isAnimated} 
									isWall={isWall} 
									col={nodeIndx} 
									row={rowIndx}
									handleMouseDown ={(row,col)=>{this.handleMouseDown(col,row)}}
									handleMouseEnter = {(row,col)=>{this.handleMouseEnter(col,row)}}
									handleMouseUp = {()=>{this.handleMouseUp()}}
								>
								</Node>
								);
						})}
				</div>
			})}
			</div>
			</div>
			);
		}
}

const getNewGridWithWallToggled = (grid, row, col)=>
{
	const newGrid = grid.slice();
	const node =  newGrid[row][col];
	const newNode = {
		...node,
		isWall: !node.isWall
	}
	newGrid[row][col] = newNode;
	return newGrid;
}