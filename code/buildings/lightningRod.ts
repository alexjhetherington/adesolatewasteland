class lightningRod extends painBuildingKill{
	
	constructor(map : map, resources : resources){
		super(map, resources, 10, 700);
		
		this.width = 3;
		this.height = 3;
		
		//\u2500
		
		this.blueprint = [
			'\u2593\u2593\u2593',
			'\u2593I\u2593',
			'\u2593\u2593\u2593'
		];
		
		this.description = "When you can taste the static in the air, all you need to do is stick a metal pole in the ground and strap something on that you want to cook.";
		this.buildingMessage = "Requires 1600 Bones and 2 Power Plants. ";
		
		this.maxWanderingChildren = 3;
		this.wandererDescription = "The monster wanders near the lightning rod. The smell of burnt flesh makes it hungry.";
	}
	
	public getMapRequirementsMet(buildings : building[]) : boolean{
		
		var warpersExist = 0;
		
		for(var i = 0; i < buildings.length; i++){
			if(buildings[i] instanceof powerPlant){
				warpersExist += 1;
			}
		}
		
		if(warpersExist >= 2){
			return true;
		}
		
		return false;
	}
	
	public getCostForXBuilt(x : number){
		return 1600;
	}
}