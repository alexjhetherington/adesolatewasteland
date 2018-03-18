class cesspit extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 3, 1);
		
		this.width = 5;
		this.height = 1;
		
		//\u2500
		
		this.blueprint = [
			'\u27C5\u2248\u2248\u2248\u27C6'
		];
		
		this.description = "A pit filled with the run-off from the crushers. Souls struggle to stay afloat.";
		this.buildingMessage = "Requires 100 Bones and 3 crushers adjacent to the cesspit.";
		
		this.maxWanderingChildren = 1;
		this.wandererDescription = "The monster wanders near the cesspit. It enjoys the stink.";
	}
	
	public getCostForXBuilt(x : number){
		return 100;
	}
	
	public getMapRequirementsMet(buildings : building[]) : boolean{
		
		var allAdjacent = this.getAllAdjacentTo(buildings);
		var crushersAdjacentTo = 0;
		
		for(var i = 0; i < allAdjacent.length; i++){
			if(allAdjacent[i] instanceof crusher){
				crushersAdjacentTo++;
			}
		}
		
		if(crushersAdjacentTo >= 3){
			return true;
		}
		
		return false;
	}
}