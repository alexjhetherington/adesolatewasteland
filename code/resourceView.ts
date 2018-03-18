class resourceView{
	protected parent : HTMLElement;
	
  private resources : resources;
  private div : HTMLElement;
  private soulsCount : HTMLElement;

  constructor(parent : HTMLElement, resources : resources){
		this.parent = parent;
		
    this.resources = resources;

    this.div = document.createElement('div');
    this.div.className = "bar";

    this.soulsCount = document.createElement('div');

    parent.appendChild(this.div);
    this.div.appendChild(this.soulsCount);
  }

  public update(){
		if(this.resources.getTotalSouls() > 0){
			
			var displayString = "Assemblage: " + this.resources.getTotalSouls()
			+ "   |   The Eddy: " + this.resources.getSoulWind()
			+ "   |   <b>Bones: " + this.resources.getBonesCount() +"</b>";
			
			if(this.resources.hasPowerBeenAboveZero()){
				displayString +=
				"   |   Fuel: " + this.resources.getPower();
			}
			
			if(this.resources.hasPainBeenAboveZero()){
				displayString +=
				"   |   Anguish: " + this.resources.getPain();
			}
			
			
			this.soulsCount.innerHTML = displayString;
		}
		else{
			this.soulsCount.innerHTML = "...";
		}
  }
	
	public destroyView(){
		this.parent.removeChild(this.div);
		this.div = null;
	}
}
