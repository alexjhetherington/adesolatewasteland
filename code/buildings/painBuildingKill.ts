class painBuildingKill extends consumer{
		
	//Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
	private requestCoolDown : number = 2;
	private secondsSinceLastRequest : number = 0;
	
	private killingTime : number = 0;
	private killingTimeElapsed : number = 0;
	private painPerKill : number = 0;
	
	private lastUpdate : number;
	
	private nextWanderGenerate : number = 10;
	private timeSinceLastWanderGenerate : number = 0;
	
	constructor(map : map, resources : resources, killingTime : number, painPerKill : number){
		super(map, resources, 1);
		this.painPerKill = painPerKill;
		this.killingTime = killingTime;
	}
	
	public getKillingTime(){
		return this.killingTime * (1 /  (1 + this.adjacentWarpers));
	}
	
	public getPainPerKill(){
		return this.painPerKill;
	}
	
	public update(timestamp : number){
		if(this.lastUpdate != null){
			
			this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
			
			
			if(this.currentOccupants.length == 1){
				this.killingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
				if(this.killingTimeElapsed > this.getKillingTime()){
					this.killingTimeElapsed = 0;
					this.currentOccupants.splice(0, 1);
					this.resources.turnSoulToBones();
					this.resources.addPain(this.getPainPerKill());
				}				
			}
			else if(this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown){
				this.addExpectedOccupant( this.map.requestActor(this) );
				this.secondsSinceLastRequest = 0;
			}
			
			
			if(this.wanderingChildrenCount < this.maxWanderingChildren){
				this.timeSinceLastWanderGenerate += ((timestamp - this.lastUpdate) / 1000);
				if(this.timeSinceLastWanderGenerate > this.nextWanderGenerate){
					this.spawnWanderer();
					this.timeSinceLastWanderGenerate = 0;
					this.nextWanderGenerate = 5 + Math.random() * 30;
				}
			}
			
		}			
		this.lastUpdate = timestamp;
	}
}