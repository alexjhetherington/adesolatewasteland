class map{
  private height : number = 28;
  private width : number = 50;

  private tiles : string[][] = [];

  private buildings : building[] = [];

	private actors : actor[] = [];
	
  private roads : boolean[][] = [];
	
	private pathFindingGraph : hellPathGraph = new hellPathGraph(this);
	
	private resources : resources;
	
	private labyrinths : number = 0;
	
	private firstCrushersPlaced : number = 0;

  constructor(resources : resources){
		this.resources = resources;
		
    for(var x = 0; x < this.height; x++){
      this.roads.push([]);
      for(var y = 0; y < this.width; y++){
        this.roads[x].push(false);
      }
	  
	  this.tiles.push([]);
	  for(var y = 0; y < this.width; y++){
        this.tiles[x].push(" ");
      }
    }
		
		//TODO remove debug variables
		//var debugActor = new actor(this, this.pathFindingGraph);
		//debugActor.putAtOrigin();
		//this.actors.push(debugActor);
  }

  public getTile(x, y){
    return this.tiles[y][x];
  }

  public getHeight(){
    return this.height;
  }

  public getWidth(){
    return this.width;
  }
	
	public getLabyrinths(){
		return this.labyrinths;
	}

  public addBuilding(building : building){	
		if (this.firstCrushersPlaced < 3 && building instanceof crusher){
			this.firstCrushersPlaced++;
			if(this.firstCrushersPlaced == 3){
				showPainBuildingButton = true;
			}
		}
	
		if(building instanceof warper){
			showPowerPlantButton = true;
		}
		
		if(building instanceof powerPlant){
			showBigCrusherButton = true;
		}
		
		if(building instanceof bigCrusher){
			showZigguratButton = true;
		}
		
		if(building instanceof warper){
			var addingWarper = building as warper;
			addingWarper.addAdjacentToBuildingsInRange(this.buildings);
			this.resources.addWarper();
		}
		else{
			for(var i = 0; i < this.buildings.length; i++){
				if(this.buildings[i] instanceof warper){
					var tempWarper = this.buildings[i] as warper;
					if(tempWarper.isBuildingInRange(building)){
						building.addAdjacentWarper();
					}
				}
			}
		}
		
		if(building instanceof labyrinth1 ||
			building instanceof labyrinth2 ||
			building instanceof labyrinth3 ||
			building instanceof labyrinth4 ||
			building instanceof labyrinth5){
				this.labyrinths += 1;
		}
		
		if(building instanceof ziggurat){
			this.buildings.push(building);
		}
		else{
			this.buildings.unshift(building);
		}
  }
	
	public getBuildingsCount(referenceBuilding : building){
		var count = 0;
		for(var i = 0; i < this.buildings.length; i++){
			if(this.buildings[i].constructor == referenceBuilding.constructor){
				count++;
			}
		}
		
		return count;
	}

  public getBuildings(){
    return this.buildings;
  }
	
	public addActor(actor : actor){
		this.actors.push(actor);
	}
	
	public getActors(){
		return this.actors;
	}
	
	public removeActor(actor : actor){
		var index = -1;
		
		for(var i = 0; i < this.actors.length; i++){
			if(this.actors[i] == actor){
				index = i;
				break;
			}
		}
		
		if(index > -1){
			this.actors.splice(index, 1);
		}
	}
	
	public killActor(toKill : actor){
		this.resources.returnActorResources(toKill);
		this.removeActor(toKill);
	}

  public getBuildingOccupyingGridIndex(x, y) : number{
    for(var i = 0; i < this.buildings.length; i++){
      if(this.buildings[i].getX() <= x && this.buildings[i].getX() + this.buildings[i].getWidth() > x &&
      this.buildings[i].getY() <= y && this.buildings[i].getY() + this.buildings[i].getHeight() > y){
        return i;
      }
    }

    return null;
  }
	
	public getActorOccupyingGridIndex(x, y) : actor{
		for(var i = 0; i < this.actors.length; i++){
			if(this.actors[i].getX() <= x + 0.5 && this.actors[i].getX() >= x - 0.5 &&
			this.actors[i].getY() <= y + 0.5 && this.actors[i].getY() >= y - 0.5){
				return this.actors[i];
			}
		}
		
		return null;
	}

  public setTile(x : number, y : number, character : string){
    this.tiles[y][x] = character;
  }

  public deleteBuilding(index){
    if(index != null){
			var building = this.buildings[index];
			var linkedBuildings = this.getLinkedDeleteBuildings(index);
			
			for(var i = this.actors.length - 1; i >= 0 ; i--){
				if(this.actors[i].getDestination() == this.buildings[index]){
					this.killActor(this.actors[i]);
				}
				
				else if(this.actors[i] instanceof wanderingActor){
					var asWander = this.actors[i] as wanderingActor;
					if(asWander.getHome() == this.buildings[index]){
						this.killActor(this.actors[i]);
					}
				}
			}
			
			this.resources.returnBuildingResources(this.buildings[index]);
      this.buildings.splice(index, 1);
			
			if(building instanceof warper){
				var deletingWarper = building as warper;
				deletingWarper.removeAdjacentToBuildingsInRange(this.buildings);
				this.resources.removeWarper();
			}
			
			if(building instanceof labyrinth1 ||
				building instanceof labyrinth2 ||
				building instanceof labyrinth3 ||
				building instanceof labyrinth4 ||
				building instanceof labyrinth5){
					this.labyrinths -= 1;
			}
			
			for(var y = 0; y < linkedBuildings.length; y++){
				var linkedIndex = this.buildings.indexOf(linkedBuildings[y]);
				if(linkedIndex >= 0){ //If index is -1 building has already been deleted
					this.deleteBuilding(linkedIndex);
				}
			}
			
      document.getElementById("flavour").innerHTML = "Tear it down. Tear it all down.";
			
			return building;
    }
  }
	
	public getLinkedDeleteBuildings(index) : building[]{
		var output = [];
		var tempBuildings = this.buildings.slice();
		tempBuildings.splice(index, 1);
		
		for(var i = 0; i < tempBuildings.length; i++){
			if(!tempBuildings[i].getMapRequirementsMet(tempBuildings, this.roads)){
				output.push(tempBuildings[i]);
			}
		}
		
		return output;
	}
	
	public getPathfindingGraph(){
		return this.pathFindingGraph;
	}

  public setRoad(x : number, y : number, road : boolean){
    this.roads[y][x] = road;
		
		if(road){
			this.pathFindingGraph.addNode(x, y);
		}
		else{
			this.pathFindingGraph.removeNode(x, y);
			//TODO Recalculate pathfinding???
		}
  }

  public getRoad(x : number, y : number){
    if(x >= 0 && y >= 0 && x < this.width && y < this.height){
      return this.roads[y][x];
    }
    else{
      return false;
    }
  }
	
	public getRoads(){
		return this.roads;
	}
	
	public update(timestamp : number){
		for (var i = 0; i < this.actors.length; i++){
			this.actors[i].update(timestamp);
		}
		
		for (var i = 0; i < this.buildings.length; i++){
			this.buildings[i].update(timestamp);
		}
		
		//TODO Get rid of this debug statement
		//debugAllSouls();
	}
	
	public debugAllSouls(){
		var toDeleteSouls = 0;
		for(var i = 0; i < this.actors.length; i++){
			toDeleteSouls += this.actors[i].getDeleteSouls();
		}
		for (var i = 0; i < this.buildings.length; i++){
			toDeleteSouls += this.buildings[i].getDeleteSouls();
		}
		var allSouls = this.resources.getTotalSouls();
		var calculatedAllSouls = this.resources.getSoulWind() + toDeleteSouls + this.resources.getBonesCount();
		if(allSouls != calculatedAllSouls && allSouls != calculatedAllSouls + 1){
			alert('Souls not equal');
		}
		console.log('souls equal');
	}
	
	public spawnWanderer(home : building) : boolean{
		var adjacentRoads = this.getRoadAdjacentToBuildingCoordinates(home);
		if(adjacentRoads.length > 0){
			var randSpawn = adjacentRoads[Math.floor(Math.random() * adjacentRoads.length)];
			
			var newActor = new wanderingActor(this, this.pathFindingGraph, home, randSpawn[0], randSpawn[1], home.getWandererDescription());
			this.addActor(newActor);
						
			return true;
		}
		
		return false;
	}
	
	public requestActor(destination : building) : number{
		var closestProducer = this.findClosestProducerNotEmpty(destination) as ghetto;
		
		if(closestProducer == null){
			return null;
		}
		
		var soulId = closestProducer.getSoul();
		
		if(soulId == null){
			return null;
		}
		
		var newActor;
		if(destination instanceof oasis){
			newActor = new soulActor(this, this.pathFindingGraph, soulId, "green");
		}
		else{
			newActor = new soulActor(this, this.pathFindingGraph, soulId);
		}
		
		this.addActor(newActor);
		newActor.spawnWithPathFromBuildingToBuilding(closestProducer, destination);
		
		if(destination instanceof oasis){
			var asOasis = destination as oasis;
			asOasis.setPainPerKillOasis(newActor.getJourneyDistance());
		}
		
		return soulId;
	}
	
	public requestActorMultiple(destination : building, numSouls : number) : number[]{
		var closestProducer = this.findClosestProducerNotEmpty(destination) as ghetto;
		
		if(closestProducer == null){
			return null;
		}
		
		if(closestProducer.getOccupants().length >= numSouls){
			var soulIds = [];
			for(var i = 0; i < numSouls; i++){
				soulIds.push(closestProducer.getSoul());
			}
		
			var newActor = new multipleSoulActor(this, this.pathFindingGraph, soulIds);
			this.addActor(newActor);
			newActor.spawnWithPathFromBuildingToBuilding(closestProducer, destination);
			
			return soulIds;
		}
		else{
			return null;
		}
	}
	
	public findClosestProducerNotEmpty(closestTo : building) : building{
		var pf = new pathfinder();
		var result = null;
		var pathLength;
		
		for(var i = 0; i < this.buildings.length; i++){
			//if producer, calculate path,
			if(this.buildings[i] instanceof ghetto){
				var producer = this.buildings[i] as ghetto;
				if(producer.getOccupantsCount() > 0){
					var path = pf.findPathBetweenBuildings(producer, closestTo, this.pathFindingGraph);
					if(path != null && (pathLength == null || path.getLength() < pathLength)){
						result = this.buildings[i]
						pathLength = path.getLength();
					}
				}
			}			
		}
		return result;
	}
	
	public getNeighbourCoordinates(x : number, y : number){
		let allCoordinates = [];
		var currentBuilding = null;
		
		var currentBuildingIndex = this.getBuildingOccupyingGridIndex(x, y);
		if(currentBuildingIndex != null){
			currentBuilding = this.buildings[currentBuildingIndex];
		}
		
		if(currentBuilding == null){ //Adding nodes for road
			//Road check for road connections
			allCoordinates = allCoordinates.concat(this.getRoadAdjacentCoordinates(x,y));
			
			//Road checking for building connections
			//allCoordinates = allCoordinates.concat(this.getBuildingAdjacentCoordinates(x,y)); 
		}
		else{ //Adding nodes for building
			//Building checking for road connections
			//var buildingEdgeCoordinates = currentBuilding.getEdgeCoordinates();
			//for(var i = 0 ; i < buildingEdgeCoordinates.length; i++){
			//	allCoordinates = allCoordinates.concat(this.getRoadAdjacentCoordinates(buildingEdgeCoordinates[i][0],buildingEdgeCoordinates[i][1]));
			//}			
			allCoordinates = allCoordinates.concat(this.getRoadAdjacentToBuildingCoordinates(currentBuilding));
		}
		
		return allCoordinates;
	}
	
	private getRoadAdjacentToBuildingCoordinates(input : building){
		var buildingEdgeCoordinates = input.getEdgeCoordinates();
		var output = [];
		for(var i = 0 ; i < buildingEdgeCoordinates.length; i++){
			output = output.concat(this.getRoadAdjacentCoordinates(buildingEdgeCoordinates[i][0],buildingEdgeCoordinates[i][1]));
		}	
		return output;
	}
	
	private getRoadAdjacentCoordinates(x : number, y : number){
		let coordinates = [];
		
		if(x-1 >= 0 && this.roads[y][x-1]){ coordinates.push([x-1,y]); }
		if(x+1 < this.width && this.roads[y][x+1]){ coordinates.push([x+1,y]); }
		if(y-1 >= 0 && this.roads[y-1][x]){ coordinates.push([x,y-1]); }
		if(y+1 < this.height && this.roads[y+1][x]){ coordinates.push([x,y+1]); }
		
		return coordinates;
	}
	
	/*private getBuildingEdgeCoordinates(building : building){
		let coordinates = [];
		
		for(var x = 0; x < building.getWidth(); x++){
			for(var y = 0; y < building.getHeight(); y++){
				if(x == 0 || y == 0 || x == building.getWidth() - 1 || y == building.getHeight() - 1){
					coordinates.push([building.getX() + x, building.getY() + y]);
				}
			}			
		}
		return coordinates;
	}*/
	
	/*public getBuildingsAdjacentTo(adjacentTo : building) : building[]{
		var output = [];
		
		for(var i = 0; i < this.buildings.length; i++){
			if(this.buildings[i].isAdjacentTo(adjacentTo)){
				output.push(this.buildings[i]);
			}
		}
		
		return output;
	}*/
	
	private getBuildingAdjacentCoordinates(x : number, y : number){
		let coordinates = [];
		var buildIndex;
		
		//TODO clean up this shite
		buildIndex = this.getBuildingOccupyingGridIndex(x-1,y);
		if(buildIndex != null){ coordinates.push([this.buildings[buildIndex].getX(),this.buildings[buildIndex].getY()]); }
		
		buildIndex = this.getBuildingOccupyingGridIndex(x+1,y);
		if(buildIndex != null){ coordinates.push([this.buildings[buildIndex].getX(),this.buildings[buildIndex].getY()]); }
		
		buildIndex = this.getBuildingOccupyingGridIndex(x,y-1);
		if(buildIndex != null){ coordinates.push([this.buildings[buildIndex].getX(),this.buildings[buildIndex].getY()]); }
		
		buildIndex = this.getBuildingOccupyingGridIndex(x,y+1);
		if(buildIndex != null){ coordinates.push([this.buildings[buildIndex].getX(),this.buildings[buildIndex].getY()]); }
				
		return coordinates;
	}
}
