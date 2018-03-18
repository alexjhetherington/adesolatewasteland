class multipleSoulActor extends actor{
	
	private soulIds : number[];
	
	constructor(map : map, nodeGraph : hellPathGraph, soulIds : number[]){
		super(map, nodeGraph);
		this.soulIds = soulIds;
	}
	
	public getIds(){
		return this.soulIds;
	}
	
	public arrive() {
		if(this.destination instanceof consumer){
			var dest = this.destination as consumer;
			for(var i = 0; i < this.soulIds.length; i++){
				dest.arrive(this.soulIds[i]);
			}
		}
		
		this.map.removeActor(this);
	}
	
	public doNotArrive(){
		if(this.destination instanceof consumer){
			var dest = this.destination as consumer;
			for(var i = 0; i < this.soulIds.length; i++){
				dest.doNotArrive(this.soulIds[i]);
			}
		}
		
		this.map.killActor(this);
	}
	
	public getDeleteSouls(){
		return this.soulIds.length;
	}
}