class ghetto extends building{
	
	private resources : resources;
	
	private secondsSinceLastSoul : number = 0;
	protected soulsToBodiesPerSecond : number = 2;
	protected maxOccupants : number = 10;
	private currentOccupants : number[] = [];
	
	private lastUpdate : number;
	
	constructor(map : map, resources : resources){
		super(map);
		
		this.width = 3;
		this.height = 3;
		//\u2302
		this.blueprint = [
			'\u2302\u2302\u2302',
			'\u2302\u2302\u2302',
			'\u2302\u2302\u2302'
		];
		
		this.resources = resources;
		
		this.description = "A transient place for those without a home of their own. Tattered tents encircled by a ring of bones.";
	}
	
	public getResources(){
		return this.resources;
	}
	
	private getSoulsPerSecond(){
		return this.soulsToBodiesPerSecond * (1 + (this.adjacentWarpers / 2)) * (1 + (1 * this.resources.getWarpers()));
	}
	
	public getOccupantsCount(){
		return this.currentOccupants.length;
	}
	
	public getOccupants(){
		return this.currentOccupants;
	}
	
	public getSoul() : number{
		if(this.currentOccupants.length != 0){
			var soulId = this.currentOccupants[0];
			this.currentOccupants.splice(0, 1);
			return soulId;
		}
		
		return null;
	}
	
	public getSoulById(id : number){
		for(var i = 0 ; i < this.currentOccupants.length; i++){
			if(this.currentOccupants[i] == id){
				this.currentOccupants.splice(i, 1);
				return id;
			}
		}
		
		return null;
	}
	
	public getCostForXBuilt(x : number){
		x = x-1;
		return Math.floor(5 + (300 * x) + (5 * (x ** 2)) + (1 * (x ** 4)));
	}
	
	public update(timestamp : number){
			if(this.lastUpdate != null){
				if(this.currentOccupants.length < this.maxOccupants){
					this.secondsSinceLastSoul += ((timestamp - this.lastUpdate) / 1000);
				}
			}
			
			if(this.secondsSinceLastSoul > (1 / this.getSoulsPerSecond())){
				var soulsTransformed = this.resources.soulWindToBody(1);
				if(soulsTransformed > 0){
					this.secondsSinceLastSoul = 0;
					this.currentOccupants.push(this.resources.getNextSoulId());
					//console.log(this.currentOccupants);
				}
			}
			
			this.lastUpdate = timestamp;
	}
	
	public getDeleteSouls(){
		return this.getMostRecentBones() + this.currentOccupants.length;
	}
}