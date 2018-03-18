class hangman extends painBuildingKill{
	
	constructor(map : map, resources : resources){
		super(map, resources, 10, 50);
		
		this.width = 2;
		this.height = 2;
		
		//\u2500
		
		this.blueprint = [
			'\uA712\uA712',
			'\uA712\uA712'
		];
		
		this.description = "A cluster of gallows atop a dumpy hillock.";
		this.buildingMessage = "Requires 50 Bones.";
		
		this.maxWanderingChildren = 1;
		this.wandererDescription = "The monster wanders near the gallows, relishing in the pain of the annihilated.";
	}
	
	public getCostForXBuilt(x : number){
		return 50;
	}
	
}