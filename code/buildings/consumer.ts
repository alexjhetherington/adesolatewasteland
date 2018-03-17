class consumer extends building{
	
	protected resources : resources;
	
	protected maxOccupants : number;
	protected currentOccupants : number[] = [];
	protected expectedOccupants : number [] = [];
	
	constructor(map : map, resources : resources, maxOccupants : number){
		super(map);
		this.maxOccupants = maxOccupants;
		this.resources = resources;
	}
	
	public arrive(soulId : number){
		if(!this.expectedOccupants.includes(soulId)){
			alert("Soul arrived at building which wasn't expected. Oh no! Arrived: " + soulId);
		}
				
		this.removeValueFrom(soulId, this.expectedOccupants);
		this.currentOccupants.push(soulId);
		
		if(this.currentOccupants.length > this.maxOccupants){
			alert('Building Exceeded max occupants');
		}
	}
	
	public doNotArrive(soulId : number){
		if(!this.expectedOccupants.includes(soulId)){
			alert("Soul did not arrive at building which wasn't expected. Oh no! Did not arrive: " + soulId);
		}
		
		this.removeValueFrom(soulId, this.expectedOccupants);
	}
	
	private removeValueFrom(soulId : number, arrayToRemoveFrom : number[]){		
		for (var i = 0; i < arrayToRemoveFrom.length; i++){
			if(arrayToRemoveFrom[i] == soulId){
					arrayToRemoveFrom.splice(i,1);
					break;
			}
		}
	}
	
	protected addExpectedOccupant(soulId : number){
		if(soulId != null){
			this.expectedOccupants.push(soulId);
		}
	}
		
	public getDeleteSouls(){
		return this.getMostRecentBones() + this.currentOccupants.length;
	}
	
	public getCurrentOccupants(){
		return this.currentOccupants;
	}
}