class oasis extends painBuildingKill{
	
	private oasisPain : number = 0;
	
	constructor(map : map, resources : resources){
		super(map, resources, 10, 0);
		
		this.width = 4;
		this.height = 4;
		
		//\u2500
		
		this.blueprint = [
			'\u2591\u219F\u2591\u2591',
			'\u2591\u2248\u2248\u2591',
			'\u219F\u2248\u2248\u219F',
			'\u2591\u2591\u2591\u219F'
		];
		
		this.description = "Something new on this blasted plain. Green, and blue, and hope. But look closer. It was just an illusion.";
		this.buildingMessage = "Requires 400 Bones. Anguish generated increases with distance hopeful soul walks.";
		
		this.maxWanderingChildren = 2;
		this.wandererDescription = "The monster hides near the path to the oasis. It delights in seeing the hopeful souls as they pass, happy in the knowledge that soon their hopes will be crushed...";
	}
	
	public getPainPerKill(){
		return this.oasisPain;
	}
	
	public setPainPerKillOasis(distance : number){
		this.oasisPain = distance * 10;
	}
	
	public getCostForXBuilt(x : number){
		return 400;
	}
}