class hellPathGraph{
	private nodeDictionary : node[] = [];
	
	private map : map;
	
	public constructor(map : map){
		this.map = map;
	}
	
	public addNode(x : number, y : number){
		if(this.nodeDictionary[this.getKey(x,y)] == null){
			var newNode = new node(x, y);
			
			//Add Node to dictionary
			this.nodeDictionary[this.getKey(x,y)] = newNode;
			
			//Set up links with neighbours
			var newNeighbours = this.getNewNeighbours(x, y);
			for(var i = 0; i < newNeighbours.length; i++){
				newNeighbours[i].addNeighbour(newNode);
				newNode.addNeighbour(newNeighbours[i]);
			}
		}
	}
	
	//TODO Threw this together more haphazardly than the rest. The whole node graph approach needs refactoring big time stylee
	private getNewNeighbours(x : number, y : number) : node[]{
		var newNeighbours = [];
		
		let allCoordinates = this.map.getNeighbourCoordinates(x, y);
		for(var i = 0; i < allCoordinates.length; i++){
			var coords = allCoordinates[i];
			
			let candidate = this.nodeDictionary[this.getKey(coords[0], coords[1])];
			if(candidate != null){
				newNeighbours.push(candidate);
			}
			else{
				alert("Found neighbour that doesn't have corresponding pathfinding node");
			}
		}
		
		return newNeighbours;
	}
	
	public removeNode(x : number, y : number){
		if(this.nodeDictionary[this.getKey(x,y)] != null){
			var node = this.nodeDictionary[this.getKey(x,y)];
			
			//remove Node from dictionary
			delete this.nodeDictionary[this.getKey(x,y)];
			
			//Remove links with neighbours
			//Inwards
			var neighbours = node.getNeighbours();
			for(var i = 0; i < neighbours.length; i++){
				neighbours[i].removeNeighbour(node);
			}
			
			//Outwards
			node.clearNeighbours();
		}
	}
	
	//TODO
	//Used to get start and end node for path finding
	public getNode(x : number, y : number){
		return this.nodeDictionary[this.getKey(x,y)];
	}
	
	public getAllNodes(){
		var keys = Object.keys(this.nodeDictionary);
		var nodes = [];
		for(var i = 0; i < keys.length; i++){
			nodes.push(this.nodeDictionary[keys[i]]);
		}
		return nodes;
	}
	
	private getKey(x : number, y : number) : string{
		return x + "," + y;
	}
}