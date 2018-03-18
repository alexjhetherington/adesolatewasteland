class soulActor extends actor{
	
	private soulId : number;
	
	constructor(map : map, nodeGraph : hellPathGraph, soulId : number, colour : string = "red"){
		super(map, nodeGraph, colour);
		this.soulId = soulId;
	}
	
	public getId(){
		return this.soulId;
	}
	
	public arrive() {
		if(this.destination instanceof consumer){
			var dest = this.destination as consumer;
			dest.arrive(this.soulId);
		}
		
		this.map.removeActor(this);
	}
	
	public doNotArrive(){
		if(this.destination instanceof consumer){
			var dest = this.destination as consumer;
			dest.doNotArrive(this.soulId);
		}
		
		this.map.killActor(this);
	}
	
	public getDeleteSouls(){
		return 1;
	}
}