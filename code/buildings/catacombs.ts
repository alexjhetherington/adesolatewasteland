class catacombs extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 12, 8);
		
		this.width = 4;
		this.height = 4;
		
		//\u2500
		
		this.blueprint = [
			'\u2592\u2592\u2592\u2592',
			'\u2592\u2592\u2592\u2592',
			'\u2592\u2592\u2592\u2592',
			'\u2592\u2592\u2592\u2592'
		];
		
		this.description = "The scrub on the surface of the ground here belies the mass of tunnels entwined snake like that run deep into the ground. There's no map for this place.";
		this.buildingMessage = "Requires 1000 bones.";
	}
	
	public getCostForXBuilt(x : number){
		return 1000;
	}
}