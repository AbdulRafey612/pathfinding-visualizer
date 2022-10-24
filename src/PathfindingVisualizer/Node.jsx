import './Node.css';
import classNames from 'classnames';
export default function Node(props) {
	const {
		col,
		row,
		isStart,
		isEnd,
		isWall,
		isAnimated,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp
	} = props;
	const classes = {
						'node-start':props.isStart,
					  	'node-end': props.isEnd,
					  	// 'animated': props.isAnimated,
					  	'wall':props.isWall
					}
	return(
		<div className={classNames([`node`],classes)}
			 id = {classNames([`${row}-${col}`])}
			 onMouseDown={()=> handleMouseDown(col,row)}
			 onMouseEnter={()=> handleMouseEnter(col,row)}
			 onMouseUp={()=> handleMouseUp()}
		>
		</div>
	);
}
