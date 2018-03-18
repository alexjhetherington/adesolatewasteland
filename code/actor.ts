class actor{
	protected pathFollower : pathFollower = new pathFollower();
	
	protected nodeGraph : hellPathGraph;
	
	protected destination;
	
	protected map : map;
	
	private pf : pathfinder = new pathfinder();
	
	protected x : number = null;
	protected y : number = null;
	
	private journeyDistance : number = 0;
	
	private colour : string = null;
	
	constructor(map : map, nodeGraph : hellPathGraph, colour : string = "red"){
		this.map = map;
		this.nodeGraph = nodeGraph;
		this.colour = colour;
	}
	
	public getX(){
		return this.x;
	}
	public getY(){
		return this.y;
	}
	
	public putAtOrigin(){
		this.x = 0;
		this.y = 0;
	}
	
	public getJourneyDistance(){
		return this.journeyDistance;
	}
	
	public getColour(){
		return this.colour;
	}
	
	public spawnWithPathFromBuildingToBuilding(start : building, end : building){
		var path = this.pf.findPathBetweenBuildings(start, end, this.nodeGraph);
		this.destination = end;
		this.pathFollower.setPath(path);
		this.journeyDistance = path.getLength();
	}
	
	public setPathToDestination(x, y){
		if(!this.pathFollower.isTravelling()){
			//TODO What to do if coords aren't exact
			//1 After a previous run
			//2 Halfway through a run
			var path = this.pf.findPathFromCoords(this.x, this.y, x, y, this.nodeGraph);
			
			//Path not found
			if(path != null){
				this.pathFollower.setPath(path);
			}
			else{
				this.handleImpossibleDestination();
			}
		}
	}
	
	public arrive() { alert('arrive not set'); }
	
	public doNotArrive(){ alert('do not arrive not set'); }
	
	private handleImpossibleDestination(){}
	
	public getDeleteSouls() {
		alert('Delete souls for actor not set');
		return 0;		
	}
	
	public getDestination(){
		return this.destination;
	}
	
	public update(timestamp : number){
		if(this.pathFollower != null){
			this.pathFollower.update(timestamp);
			
			if(this.pathFollower.isFinished()){
				this.arrive();
				return;
			}
			
			var nextWaypoint = this.pathFollower.getNextWayPoint();
			if(nextWaypoint == null){
				alert("Waypoint is null but path isn't finished. How did you get here?");
			}
			if(!this.map.getRoad(nextWaypoint.x, nextWaypoint.y)){
				//Road has been deleted
				this.doNotArrive();
				return;
			}
			
			var x = this.pathFollower.getX();
			var y = this.pathFollower.getY();
			
			if(x != null && y != null){
				this.x = x;
				this.y = y;
			}
		}
	}
}