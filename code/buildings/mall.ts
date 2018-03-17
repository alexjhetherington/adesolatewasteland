/// <reference path="./painBuildingTorture.ts"/>

class mall extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 100, 10);
		
		this.width = 7;
		this.height = 4;
		
		//\u2500
		
		this.blueprint = [
			'\u256D\u2500\u2500\u2500\u2617\u2617\u2617',
			'\u2502   \u2617\u2617\u2617',
			'\u2502   \u2617\u2617\u2617',
			'\u2691 \u2691\u2500\u2617\u2617\u2617'
		];
		
		this.description = "An abandoned mall. Is there a more hellish place?";
		this.buildingMessage = "Requires 1400 Bones and road connected to the mall's south side.";
		
		this.maxWanderingChildren = 3;
		this.wandererDescription = "The monster wanders near the abandoned mall, wary. The monster has never seen the mall before; it doesn't know what to make of it.";
	}
	
	public getMapRequirementsMet(buildings : building[], roads : boolean[][]) : boolean{
		var roadY = this.getY() + this.getHeight();
		
		for(var roadX = this.getX(); roadX < this.getX() + this.width; roadX++){
			if (roadX >= 0 && roadX < this.map.getWidth() && roadY >= 0 && roadY < this.map.getHeight() && roads[roadY][roadX]){
				return true;
			}
		}
		
		return false;
	}
	
	public getCostForXBuilt(x : number){
		return 1400;
	}
}