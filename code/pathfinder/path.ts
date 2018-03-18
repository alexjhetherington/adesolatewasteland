class path{
	private waypoints : waypoint[];
	
	constructor(nodes : node[]){
		this.waypoints = [];
		for(var i = 0; i < nodes.length; i++){
			let wp = new waypoint();
			wp.x = nodes[i].getX();
			wp.y = nodes[i].getY();
			this.waypoints.push(wp);
		}
	}
	
	public getLength(){
		return this.waypoints.length;
	}
	
	public trimEnd(){
		this.waypoints.splice(-1, 1);
	}
	
	public duplicateStart(){
		this.waypoints.splice(0,0, this.duplicateWayPoint(this.waypoints[0]));
	}
	
	public duplicateEnd(){
		this.waypoints.splice(this.waypoints.length, 0, this.duplicateWayPoint(this.waypoints[this.waypoints.length - 1]));
	}
	
	private duplicateWayPoint(input : waypoint){
		var output = new waypoint();
		output.x = input.x;
		output.y = input.y;
		
		return output;
	}
	
	public reachNextWayPoint(){
		this.waypoints.splice(0, 1);
	}
	
	public getCurrentWayPoint(){
		return this.waypoints[0];
	}
	
	public getNextWayPoint(){
		if(this.waypoints.length < 2){
			return null;
		}
		return this.waypoints[1];
	}
	
	public toString(){
		var output = "Path -  ";
		for(var i = 0; i < this.waypoints.length; i++){
			output = output + this.waypoints[i].x + "," +  this.waypoints[i].y + " ";
		}
		
		return output;
	}
}