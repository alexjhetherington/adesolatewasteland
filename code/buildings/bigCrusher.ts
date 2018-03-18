class bigCrusher extends consumer{
			
	private lastUpdate : number;
	
	//Not strictly necessary in a game design sense, but I don't want to make a soul request every frame if there are no current souls
	private requestCoolDown : number = 2;
	private secondsSinceLastRequest : number = 0;
	
	private crushingTime : number = 5;
	private crushingTimeElapsed : number = 0;
	
	private busSize : number;
	
	constructor(map : map, resources : resources){
		super(map, resources, 10);
		this.busSize = this.maxOccupants; //Same thing but in my tired state busSize is easier to comprehend. TODO maybe factor this out
		
		this.width = 7;
		this.height = 4;
		
		/*this.blueprint = [
			'MCRUSHM',
			'!CRUSH!',
			'!CRUSH!',
			'!CRUSH!'
		];*/
		
		this.blueprint = [
			'\u2588\u2588\u2588\u2588\u2588\u2501\u25CF',
			'\u2588\u2B1A\u2B1A\u2B1A\u2588  ',
			'\u2588\u2B1A\u2B1A\u2B1A\u2588\u263F ',
			'\u2588\u220F\u2588\u2588\u2588\u2501\u25EA'
		];
		
		this.blueprint = [
			'\u2591\u2591\u2591\u2591\u2591\u2591\u2591',
			'\u2591\u2592\u2359\u2359\u2359\u2592\u2591',
			'\u2591\u2592\u2359\u2359\u2359\u2592\u2591',
			'\u2591\u2591\u2591\u2591\u2591\u2591\u2591'
		];
		
		this.resources = resources;
		
		this.description = "Rusting buses stop by with a monotonous rhythm. They drop off groups of people who enter the machine together, terrified and meek.";
		this.buildingMessage = "Big Crushers use fuel to transport multiple souls at a time.";
	}
	
	private getCrushingTime(){
		return this.crushingTime * (1 /  (1 + this.adjacentWarpers));
	}
	
	public getCostForXBuilt(x : number){
		x = x - 1;
		return Math.floor(400 + (100 * x) + (2 * (x ** 2)) + (0.2 * (x ** 3)));
	}
	
	public update(timestamp : number){
		if(this.lastUpdate != null){
			
			this.secondsSinceLastRequest += ((timestamp - this.lastUpdate) / 1000);
			
			
			if(this.currentOccupants.length == this.busSize){
				this.crushingTimeElapsed += ((timestamp - this.lastUpdate) / 1000);
				if(this.crushingTimeElapsed > this.getCrushingTime()){
					this.crushingTimeElapsed = 0;
					this.resources.turnSoulsToBones(this.busSize);
					this.currentOccupants.length = 0;
				}				
			}
			else if(this.expectedOccupants.length == 0 && this.secondsSinceLastRequest > this.requestCoolDown && this.resources.canSpendPower(10)){
				var soulIds = this.map.requestActorMultiple(this, this.busSize);
				if(soulIds != null){
					
					this.resources.spendPower(10);
					
					for(var i = 0; i < soulIds.length; i++){
						this.addExpectedOccupant(soulIds[i]);
					}
				}
				this.secondsSinceLastRequest = 0;
			}
			
		}			
		this.lastUpdate = timestamp;
	}
}