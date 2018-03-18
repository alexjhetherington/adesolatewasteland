class pathfinder{
	public findPath(start : node, end : node) : path{
		if(start == end){
			return null;
		}
		
		var closed = [];
		var open = [];
		var prevs = [];
		
		open.push(start);
		
		while(open.length > 0){
			//Current node we are checking is first node in open
			var current = open[0];
			open.splice(0,1);
			
			if(current == end){//Found finish
				return this.buildPath(end, prevs);
			}
			
			var neighbours = current.getNeighbours();
			for (var i = 0 ; i < neighbours.length ; i++){
				let neighbour = neighbours[i];
				//New neighbour not in closed or open set
				//Works because breadth first search, and assumes cost between nodes is equal
				if(closed.indexOf(neighbour) == -1 && open.indexOf(neighbour) == -1){
					open.push(neighbour);
					prevs[neighbour.toString()] = current;
				}
			}
			
			//We have finished checking current node
			closed.push(current);
			
			//console.log("Open: " + open);
			//console.log("Closed: " + closed);
		}
		
		return null;
	}
	
	private buildPath (end : node, prevs : node[]) : path{
		var nodesPath = [];
		
		var currentNode = end;
		nodesPath.unshift(end);
		
		while(prevs[currentNode.toString()] != null){
			nodesPath.unshift(prevs[currentNode.toString()]);
			currentNode = prevs[currentNode.toString()];
		}
		
		return new path(nodesPath);
	}
	
	public findPathBetweenBuildings(start : building, end : building, hellPathGraph : hellPathGraph) : path {
		var startX = start.getX();
		var startY = start.getY();
		
		var endX = end.getX();
		var endY = end.getY();
		
		//Temporarily add buildings to node graph
		hellPathGraph.addNode(startX, startY);
		hellPathGraph.addNode(endX, endY);
		
		var path = this.findPathFromCoords(startX, startY, endX, endY, hellPathGraph);
		
		if(path != null){
			path.reachNextWayPoint();
			path.trimEnd();
			
			path.duplicateStart();
			path.duplicateEnd();
		}
		//Remove temporary buildings
		hellPathGraph.removeNode(startX, startY);
		hellPathGraph.removeNode(endX, endY);
		
		return path;
	}
	
	public findPathFromCoords(startX : number, startY : number, endX : number, endY : number, hellPathGraph : hellPathGraph) : path{
		var startNode = hellPathGraph.getNode(startX, startY);
		var endNode = hellPathGraph.getNode(endX, endY);
		
		if(startNode == null || endNode == null){
			return null;
		}
		
		else{
			return this.findPath(startNode, endNode);
		}		
	}
		
}