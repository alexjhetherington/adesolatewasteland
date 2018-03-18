class sisyphus extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 1, 50);
		
		this.width = 5;
		this.height = 2;
		
		//\u2500
		
		this.blueprint = [
			'  \u2571\u2572 ',
			'\u25CE\u2571  \u2572'
		];
		
		this.description = "Salvation from the wastelands awaits the soul who can push a boulder to the top of this hill. A momentary lapse of concentration, and somehow they are right back at the bottom.";
		this.buildingMessage = "Requires 1800 Bones and 4 Warpers. ";
		
		this.maxWanderingChildren = 4;
		this.wandererDescription = "The monster wanders near the eternal hill. The punishment is old, and is what passes for famous down here.";
	}
	
	public getMapRequirementsMet(buildings : building[]) : boolean{
		
		var warpersExist = 0;
		
		for(var i = 0; i < buildings.length; i++){
			if(buildings[i] instanceof warper){
				warpersExist += 1;
			}
		}
		
		if(warpersExist >= 4){
			return true;
		}
		
		return false;
	}
	
	public getCostForXBuilt(x : number){
		return 1800;
	}
}