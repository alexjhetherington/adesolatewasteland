class cage extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 20, 10);
		
		this.width = 4;
		this.height = 2;
		
		//\u25A5
		
		this.blueprint = [
			' \u25A5\u25A5 ',
			'\u2571\u25A5\u25A5\u2572'
		];
		
		this.description = "A giant prison made of bones.";
		this.buildingMessage = "Requires 900 Bones. ";
		
		this.maxWanderingChildren = 2;
		this.wandererDescription = "The monster wanders near the Cage, mocking those who reside inside.";
	}
	
	public getCostForXBuilt(x : number){
		return 900;
	}
}