class concentrateView{
	
	private parent : HTMLElement = null;
	private div : HTMLElement = null;
	
	private resources : resources;
	private mapView : mapView;
	
	private timeOut : number = 5;
	
	constructor(parent : HTMLElement, resources : resources, mapView : mapView){
		this.parent = parent;
		
		this.resources = resources;
		this.mapView = mapView;
		
		if(fastMode){
			this.timeOut = 0.5;
		}
		
		this.createView();
	}
	
	public createView(){
		this.div = document.createElement("div");
		var paragraph = document.createElement("p");
		paragraph.innerHTML = "Concentrating..."
		this.div.appendChild(paragraph);
		this.parent.appendChild(this.div);
		
		var thisConcentrate = this;
		
		//Stupid wrapping to save the scope because I'm using "this"
		window.setTimeout((function(){
			thisConcentrate.parent.removeChild(thisConcentrate.div);
			thisConcentrate.div = null;
		
			var newSoul = new soul(thisConcentrate.resources.getNextSoulId());
		
			new soulView(thisConcentrate.parent, newSoul, thisConcentrate.resources, null, thisConcentrate.mapView);
		}), this.timeOut * 1000);
	}
}