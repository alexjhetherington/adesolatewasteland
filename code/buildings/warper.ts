/// <reference path="../building.ts"/>

class warper extends building{
	
	private warpRadius = 2;
	
	constructor(map : map){
		super(map);
		
		this.width = 4;
		this.height = 4;
		
		//\u2500
		
		this.blueprint = [
			'\u06F3\u0623\u0E96\u06F3',
			'\u0E96\u212B\u10DA\u0623',
			'\u0623\u10DA\u212B\u0E96',
			'\u06F3\u0E96\u0623\u06F3'
		];
		
		this.description = "A collection of strange monuments to the sky. The area glows with an eerie blue energy. Things nearby move with a strange halting motion, jumping from one place to the next. The Eddy is screaming louder than before.";
	}
	
	
	public isBuildingInRange(other : building){
		//If other max x is below this min x
		if(other.getX() + other.getWidth() - 1 < this.getX() - this.warpRadius)
			return false;
	
		//If other min x is above this max x
		if(other.getX() > this.getX() + this.getWidth() - 1 + this.warpRadius)
			return false;
		
		//If other max Y is below this min Y
		if(other.getY() + other.getHeight() - 1 < this.getY() - this.warpRadius)
			return false;
			
		//If other min Y is above this max Y
		if(other.getY() > this.getY() + this.getHeight() - 1 + this.warpRadius)
			return false;
		
		return true;
		
	}
	
	public getCostForXBuilt(x : number){
		x=x-1;
		return Math.floor(50 + (100 * x) + (2 * (x ** 2)) + (1 * (x ** 3)) + (0.5 * (x ** 4)));
	}
	
	public addAdjacentToBuildingsInRange(allBuildings : building[]){
		var buildingsInRange = this.getBuildingsInRange(allBuildings);
		
		for(var i = 0; i < buildingsInRange.length; i++){
			buildingsInRange[i].addAdjacentWarper();
		}
	}
	
	public removeAdjacentToBuildingsInRange(allBuildings : building[]){
		var buildingsInRange = this.getBuildingsInRange(allBuildings);
		
		for(var i = 0; i < buildingsInRange.length; i++){
			buildingsInRange[i].removeAdjacentWarper();
		}
	}
	
	private getBuildingsInRange(allBuildings : building[]){
		var buildingsInRange = [];
		for(var i = 0 ; i < allBuildings.length; i++){
			if(this.isBuildingInRange(allBuildings[i])){
				buildingsInRange.push(allBuildings[i]);
			}
		}
		return buildingsInRange;
	}
}