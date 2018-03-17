/// <reference path="./painBuildingTorture.ts"/>

class cessSwamp extends painBuildingTorture{
	
	constructor(map : map, resources : resources){
		super(map, resources, 12, 35);
		
		this.width = 7;
		this.height = 2;
		
		//\u2500
		
		this.blueprint = [
			'\u219F   \u219F \u219F',
			'\u27C5\u2248\u2248\u27C6\u27C5\u2248\u27C6'
		];
		
		this.description = "The run-off from the bigger crushers lands in a large depression. Over time life has emerged, and now the area is a stinking acidic swamp.";
		this.buildingMessage = "Requires 1200 Bones and 3 Big Crushers adjacent to the Cess Swamp.";
		
		this.maxWanderingChildren = 3;
		this.wandererDescription = "The monster wanders near the cess swamp. It longs to swim there, though it knows it is forbidden from doing so.";
	}
	
	public getMapRequirementsMet(buildings : building[]) : boolean{
		
		var allAdjacent = this.getAllAdjacentTo(buildings);
		var crushersAdjacentTo = 0;
		
		for(var i = 0; i < allAdjacent.length; i++){
			if(allAdjacent[i] instanceof bigCrusher){
				crushersAdjacentTo++;
			}
		}
		
		if(crushersAdjacentTo >= 3){
			return true;
		}
		
		return false;
	}
	
	public getCostForXBuilt(x : number){
		return 1200;
	}
}