class crusher extends consumer{
			
	private lastUpdate : number;
	
	//Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
	private requestCoolDown : number = 1;
	private secondsSinceLastRequest : number = 0;
	
	private crushingTime : number = 4;
	private crushingTimeElapsed : number = 0;
	
	constructor(map : map, resources : resources){
		super(map, resources, 1);
		
		this.width = 5;
		this.height = 3;
		//\u2500
		this.blueprint = [
			'\u2588\u2588\u2588\u2501\u25CF',
			'\u2588\u2B1A\u2588\u263F ',
			'\u2588\u220F\u2588\u2501\u25EA'
		];
		
		this.blueprint = [
			'\u2591\u2591\u2591\u2591\u2591',
			'\u2591\u2592\u2359\u2592\u2591',
			'\u2591\u2591\u2591\u2591\u2591'
		];
		
		/*this.blueprint = [
			'\u2E22   \u2E23',
			' -\u0416- ',
			'\u2E24 \u25CF \u2E25'
		];*/
		
		/*this.blueprint = [
			'CRUSH',
			'CRUSH',
			'CRUSH'
		];*/
		
		this.resources = resources;
		//this.map = map;
		
		this.description = "A burnt humanoid thing operates a rudimentary machine which smashes rhythmically. People go in, bones comes out. A mountain of bones. A sluice pipe carries thick red giblets away.";
	}
	
	private getCrushingTime(){
		return this.crushingTime * (1 /  (1 + this.adjacentWarpers));
	}
	
	public getCostForXBuilt(x : number){
		x = x - 1;
		return Math.floor(10 + (5 * x) + (1.1 * (x ** 2) + (0.1 * (x ** 3))));
	}
	
	public update(timestamp : number){
		if(this.lastUpdate != null){
			
			this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
			
			
			if(this.currentOccupants.length == 1){
				this.crushingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
				if(this.crushingTimeElapsed > this.getCrushingTime()){
					this.crushingTimeElapsed = 0;
					this.resources.turnSoulToBones();
					this.currentOccupants.splice(0, 1);
				}				
			}
			else if(this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown){
				this.addExpectedOccupant( this.map.requestActor(this) );
				this.secondsSinceLastRequest = 0;
			}
			
		}			
		this.lastUpdate = timestamp;
	}
}