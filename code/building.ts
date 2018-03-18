class building{
  private x : number;
  private y : number;

  protected description : string;
	
	protected buildingMessage : string = null;

  protected width = 2;
  protected height = 2;
	
	protected adjacentWarpers : number = 0;

  protected blueprint : string[] = [
  '##',
  '##'
  ];
	
	protected map : map;
	
	protected maxWanderingChildren : number = 0;
	protected wanderingChildrenCount : number = 0;
	
	protected wandererDescription = "One of the burnt things wanders aimlessly.";

  //constructor(x : number, y : number){
  //  this.x = x;
  //  this.y = y;
  //}

  constructor(map : map){
		this.map = map;
  }

	public addWanderer(){
		this.wanderingChildrenCount += 1;
	}
	
	public removeWanderer(){
		this.wanderingChildrenCount -= 1;
		if(this.wanderingChildrenCount < 0){
			alert("Wanderer removed from building that had no wanderers");
		}
	}
	
	protected spawnWanderer(){
		if(this.map.spawnWanderer(this)){
			this.wanderingChildrenCount++;
			
			if(this.wanderingChildrenCount > this.maxWanderingChildren){
				alert("Spawned more than wanderer capacity.");
			}	
			
			return true;
		}
		
		return false;
	}
	
	public getWandererDescription(){
		return this.wandererDescription;
	}
	
	public getBuildingMessage(){
		return this.buildingMessage;
	}
	
  public getWidth(){
    return this.width;
  }

  public getHeight(){
    return this.height;
  }

  public setX(x){
    this.x = x;
  }

  public getX(){
    return this.x;
  }

  public setY(y){
    this.y = y;
  }

  public getY(){
    return this.y;
  }

  public getTile(x, y){
    return this.blueprint[y][x];
  }
	
	public getAdjacentWarpers(){
		return this.adjacentWarpers;
	}
	
	public addAdjacentWarper(){
		this.adjacentWarpers += 1;
	}
	
	public removeAdjacentWarper(){
		this.adjacentWarpers -= 1;
	}

  public collides(building : building) : boolean{
    if(this.x + this.width <= building.getX() || building.getX() + building.getWidth() <= this.x ||
     this.y + this.height <= building.getY() || building.getY() + building.getHeight() <= this.y){
      return false;
    }
    else{
      return true;
    }
  }

  public collidesAny(buildings : building[]) : boolean{
    for(var i = 0; i < buildings.length; i++){
      if(this.collides(buildings[i])){
        return true;
      }
    }
    return false;
  }
	
	public getMapRequirementsMet(buildings : building[], roads : boolean[][]) : boolean{
		return true;
	}
	
	public getNextBones(){
		return this.getCostForXBuilt(this.map.getBuildingsCount(this) + 1);
	}
	
	public getMostRecentBones(){
		return this.getCostForXBuilt(this.map.getBuildingsCount(this));
	}
	
	public getCostForXBuilt(x : number){
		alert("Building does not have bone formulae set set");
		return 0;
	}

  public getDescription(){
    return this.description;
  }
	
	public update(timestamp : number){
	}
	
	public getDeleteSouls(){
		return this.getMostRecentBones();
	}
	
	public isAdjacentTo(adjacentTo : building) : boolean {
		if(this.x == adjacentTo.getX() && this.y == adjacentTo.getY()){ //same building!
			return false;
		}
			
		if(
		(!(this.y > adjacentTo.getY() + adjacentTo.getHeight() - 1 || this.y + this.getHeight() - 1 < adjacentTo.getY()) &&
		(this.x + this.getWidth() == adjacentTo.getX() || this.x == adjacentTo.getX() + adjacentTo.getWidth()))
		||
		(!(this.x > adjacentTo.getX() + adjacentTo.getWidth() - 1 || this.x + this.getWidth() - 1 < adjacentTo.getX()) &&
		(this.y + this.getHeight() == adjacentTo.getY() || this.y == adjacentTo.getY() + adjacentTo.getHeight()))
		){
			return true;
		}
		
		return false;
	}
	
	public getAllAdjacentTo(buildings : building[]){
		var output = [];
		
		for(var i = 0; i < buildings.length; i++){
			if(this.isAdjacentTo(buildings[i])){
				output.push(buildings[i]);
			}
		}
		
		return output;
	}
	
	public getEdgeCoordinates(){
		let coordinates = [];
		
		for(var x = 0; x < this.getWidth(); x++){
			for(var y = 0; y < this.getHeight(); y++){
				if(x == 0 || y == 0 || x == this.getWidth() - 1 || y == this.getHeight() - 1){
					coordinates.push([this.getX() + x, this.getY() + y]);
				}
			}			
		}
		return coordinates;
	}
}
