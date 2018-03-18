/// <reference path="./soul.ts"/>
/// <reference path="./global.d.ts"/>

class resources{
  private lastUpdate : number;

  private soulsPerSecond : number = 1.8; //Apparantly the average number of deaths per second is 1.8
  
	private soulsToAdd : number = 0;
	
  private totalSouls : number = 0;
  private soulWind : number = 0;
  private bonesCount : number = 0;
	private power : number = 0;
	private powerBeenAboveZero : boolean = false;
	private pain : number = 0;
	private painBeenAboveZero : boolean = false;
	
	private nextSoulId : number = 0;
	
  //private map : map = null
	private startedGame : boolean = false;
	
	private warpers : number = 0;

  constructor(){
  }

  public getTotalSouls(){
		return this.totalSouls;
  }
	
	public getSoulWind(){
		return this.soulWind;
  }

  public getBonesCount(){
    return this.bonesCount;
  }
	
	private getSoulsPerSecond(){
		return this.soulsPerSecond * (1 + (this.warpers * 2.5));
	}

  public update(timeStamp){
		if(this.startedGame){
			if(this.lastUpdate != null){
				this.soulsToAdd += ((timeStamp - this.lastUpdate) / 1000) * this.getSoulsPerSecond();
			}
			
			if(this.soulsToAdd > 1){
				this.soulsToAdd -= 1;
				this.totalSouls += 1;
				this.soulWind += 1;
			}
			
			
			if(this.bonesCount == 3){
				if(!showGhettoButton){
					showGhettoButton = true;
				}
			}
			
			if(this.bonesCount == 4 && !disabledConcentrateAlready){
				disableConcentrate = true;
				disabledConcentrateAlready = true;
			}
			
			if(this.bonesCount == 6){
				showCrusherButton = true;
				showWarperButton = true;
			}
			
			this.lastUpdate = timeStamp;
		}
  }
	
	public removeSoulWind(){
		this.soulWind -= 1;
	}
	
	public soulWindToBody(amount : number) : number{
		if(this.soulWind >= amount){
			this.soulWind -= amount;
			return amount;
		}
		else{
			return 0;
		}
	}

  public turnSoulToBones(){
    this.bonesCount++;
  }
	
	public turnSoulsToBones(num : number){
		this.bonesCount += num;
	}

  public spendResources(building : building){
		if(satanMode){
			return true;
		}
		
    var bones = building.getNextBones();
    if(bones > this.bonesCount){
      return false;
    }
    else{
      this.bonesCount -= bones;
      return true;
    }
  }
	
	 public canSpendResources(building : building){
		if(satanMode){
			return true;
		}
		
    var bones = building.getNextBones();
    if(bones > this.bonesCount){
      return false;
    }
    else{
      return true;
    }
  }
	
	public returnBuildingResources(building : building){
		var buildingTotal = building.getDeleteSouls();
		var spentBones = building.getMostRecentBones();
		var occupants = buildingTotal - spentBones;
		
		var percentAsBones = 0.2;
		
		var asEddy = Math.ceil(spentBones * (1 - percentAsBones));
		var asBones = Math.floor(spentBones * percentAsBones);
		
		this.soulWind += occupants;
		this.soulWind += asEddy;
		
		this.bonesCount += asBones;
	}
	
	public returnActorResources(actor : actor){
		this.soulWind += actor.getDeleteSouls();
	}
	
	public returnSoul(){
		this.soulWind += 1;
	}
	
	public startGame(){
		this.totalSouls += 1;
		this.startedGame = true;
		
		if(satanMode){
			this.totalSouls += 10;
			this.bonesCount += 10;
		}
	}
	
	public getNextSoulId(){
		var id = this.nextSoulId;
		this.nextSoulId += 1;
		return id;
	}
	
	public addWarper(){
		this.warpers += 1;
	}
	
	public removeWarper(){
		this.warpers -= 1;
	}
	
	public getWarpers(){
		return this.warpers;
	}
	
	public getPower(){
		return this.power;
	}
	
	public addPower(input : number){
		this.powerBeenAboveZero = true;
		this.power += input;
	}
	
	public hasPowerBeenAboveZero(){
		return this.powerBeenAboveZero;
	}
	
	public spendPain(requested : number) : boolean{
		if(this.pain >= requested){
			this.pain -= requested;
			return true;
		}
		
		return false;
	}
	
	public getPain(){
		return this.pain;
	}
	
	public addPain(input : number){
		this.painBeenAboveZero = true;
		this.pain += input;
	}
	
	public canSpendPower(requested : number) : boolean{
		if(this.power >= requested){
			return true;
		}
		else{
			return false;
		}
	}
	
	public spendPower(requested : number) : boolean{
		if(this.power >= requested){
			this.power -= requested;
			return true;
		}
		
		return false;
	}
	
	public hasPainBeenAboveZero(){
		return this.painBeenAboveZero;
	}
}
