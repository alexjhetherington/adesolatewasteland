class pathFollower{
	private lastUpdate : number;
	
	private path : path;
	private progressToNextWayPoint : number = 0;	
	//Currently this is "percent per second to next waypoint"
	//Will need to refactor for waypoints of different distances
	private speed : number = 1.3;
	
	private finished : boolean = false;
	
	public setPath(path){
		this.path = path;
		//console.log(this.path.toString());
	}
	
	public isTravelling(){
		if(this.path != null){
			return true;
		}
		else{
			return false;
		}
	}
	
	public getNextWayPoint(){
		return this.path.getNextWayPoint();
	}
	
	public getX(){
		if(this.path == null){
			return null;
		}
		
		var currentWayPoint = this.path.getCurrentWayPoint();
		var nextWayPoint = this.path.getNextWayPoint();
		
		if(nextWayPoint == null){
			return currentWayPoint.x;
		}
		
		return ((nextWayPoint.x - currentWayPoint.x) * this.progressToNextWayPoint) + currentWayPoint.x;
	}

	public getY(){
		if(this.path == null){
			return null;
		}
		
		var currentWayPoint = this.path.getCurrentWayPoint();
		var nextWayPoint = this.path.getNextWayPoint();
		
		if(nextWayPoint == null){
			return currentWayPoint.y;
		}
		
		return ((nextWayPoint.y - currentWayPoint.y) * this.progressToNextWayPoint) + currentWayPoint.y;
	}	
	
	public isFinished() : boolean {
		return this.finished;
	}
	
	public update(timestamp : number){

		
		
		if(this.lastUpdate != null){
			
			if(this.path != null){
				var progress = ((timestamp - this.lastUpdate) / 1000) * this.speed;
				this.progressToNextWayPoint += progress;
				
				if(this.progressToNextWayPoint >= 1){
					this.progressToNextWayPoint -= 1;
					this.path.reachNextWayPoint();
				}
			}
			
			if(this.path.getNextWayPoint() == null){
				//Reached destination
				this.finished = true;
				this.path = null;
				this.progressToNextWayPoint = 0;
			}
			
		}
		this.lastUpdate = timestamp;
	}
}