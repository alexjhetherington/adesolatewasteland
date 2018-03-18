class powerPlant extends consumer{
		
	private lastUpdate : number;
	
	private requestSoulCoolDown : number = 1;
	private requestCooledFor : number = 0;
	
	private bakingTime : number = 20;
	private bakedFor : number = 0;
	
	private timeToBoilPerSoul : number = 50 / 60;
	private boiledFor : number = 0;
	private bakingBoiling : boolean = false;
	
	private powerPerSoul : number = 15;
	
	constructor(map : map, resources : resources){
		super(map, resources, 50);
		this.resources = resources;
		
		
		this.width = 16;
		this.height = 7;
		
		this.blueprint = [
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
			'                ',
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237',
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2617\u2617',
			'\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2237\u2617\u2617'
		];
		
		this.description = "A sea of bodies pummeled into the ground, crushed by their own weight and turned into something like diamonds or coal. Soul coal... Then it's used to stoke the fire, turning giant turbines.";
	}
	
	private getTimeToBoilPerSoul(){
		return this.timeToBoilPerSoul; //TODO warper affects this
	}
	
	private getBakingTime(){
		return this.bakingTime; //TODO warper affects this
	}
	
	public update(timestamp : number){
		if(this.lastUpdate != null){
			
			var elapsed = ((timestamp - this.lastUpdate) / 1000);			
			
			if(this.currentOccupants.length + this.expectedOccupants.length < this.maxOccupants && !this.bakingBoiling){
				if(this.requestCooledFor >= this.requestSoulCoolDown){
					//Call for new soul
					this.addExpectedOccupant( this.map.requestActor(this) );
					this.requestCooledFor -= this.requestSoulCoolDown;
				}
				else{
					//Bump cooldown
					this.requestCooledFor += elapsed;
				}
			}
			
			else if(this.currentOccupants.length < this.maxOccupants && !this.bakingBoiling){
				//do nothing pretty much
			}
			
			else if(!this.bakingBoiling){
				this.bakingBoiling = true;
			}
			
			else if(this.bakedFor < this.getBakingTime()){
				this.bakedFor += elapsed;
			}
						
			else if (this.currentOccupants.length > 0){
				if(this.boiledFor > this.getTimeToBoilPerSoul()){
					this.boiledFor -= this.getTimeToBoilPerSoul();
					
					//Add Power
					this.resources.addPower(this.powerPerSoul);
					//Return Soul
					this.currentOccupants.splice(0,1);
					this.resources.returnSoul();
				}
				else{
					this.boiledFor += elapsed;
				}
			}
			
			else{
				//Refresh everything
				this.requestCooledFor = 0;
				this.bakedFor = 0;
				this.boiledFor = 0;
				this.bakingBoiling = false;
				
				this.currentOccupants.length = 0;
			}
		}			
		this.lastUpdate = timestamp;
	}
	
	public getCostForXBuilt(x : number){
		x=x-1;
		var cost = Math.floor(500 + (600 * x));
		return cost;
	}
}