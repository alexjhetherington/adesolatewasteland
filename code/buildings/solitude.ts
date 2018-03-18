class solitude extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 1, 35);
		
		this.width = 7;
		this.height = 7;
		
		//\u2500
		
		this.blueprint = [
			'       ',
			'       ',
			'       ',
			'   \u265B   ',
			'       ',
			'       ',
			'       '
		];
		
		this.description = "A lonely throne. Civilization might not be far away, but a fog lingers, and through it nothing can be seen. The throne could be the only thing in the universe. Whoever sits here had to leave the road miles behind";
		this.buildingMessage = "Requires 300 Bones.";
		
		this.maxWanderingChildren = 2;
		this.wandererDescription = "The monster tries to find the Lonely Throne. It never will.";
	}
	
	public getCostForXBuilt(x : number){
		return 300;
	}
}