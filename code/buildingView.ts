class buildingView{

  private div : HTMLElement = null;

  private li : HTMLUListElement = null;

  private building : building = null;
  private mapView : mapView = null;
  private parent : HTMLElement = null;

  constructor(parent : HTMLElement, building : building, mapView : mapView){
    this.parent = parent;
    this.building = building;
    this.mapView = mapView;

    this.createView;
  }
	
	public getBuilding(){
		return this.building;
	}

  public createView(){
    this.div = document.createElement("div");

    var list = document.createElement("ul");
    list.className = "horzMenu";
    this.div.appendChild(list);

    this.createListButton(list, "Return", () => {this.destroyView(); this.mapView.createView()});

    this.createInnerView();
				
		//Should be in a subclass
		if(this.building instanceof ghetto){
			var asGhetto = this.building as ghetto;
			this.li = document.createElement("ul");
			this.populateOccupants(asGhetto.getOccupants());
			this.div.appendChild(this.li);
		}
		
		//Should be in a subclass
		if(this.building instanceof painBuildingTorture){
			var asTorture = this.building as painBuildingTorture;
			this.li = document.createElement("ul");
			this.populateOccupants(asTorture.getCurrentOccupants());
			this.div.appendChild(this.li);
		}
    
		if(this.building instanceof ziggurat){
			var asZiggurat = this.building as ziggurat;
			
			var soulsPar = document.createElement("p");
			soulsPar.innerHTML = asZiggurat.getSoulsConsumed() + "/" + asZiggurat.getSoulsRequired() + " souls consumed from The Eddy.";
			
			
			var button : HTMLButtonElement = document.createElement("button");
			button.innerHTML = "Perform Ritual";
			
			if(asZiggurat.getSoulsConsumed() >= asZiggurat.getSoulsRequired() || satanMode){
				button.onclick = () => {
					asZiggurat.end();
				}
			}
			else{
				button.className = "listFakeButton";
			}
			
			var ritualLabel = document.createElement("span");
			ritualLabel.innerHTML = asZiggurat.getAnguishRequired() + " Anguish";
			
			this.div.appendChild(soulsPar);
			this.div.appendChild(button);
			this.div.appendChild(ritualLabel);
		}
		
    this.parent.appendChild(this.div);
  }
	
	createInnerView(){
		var description = document.createElement("p");
    description.innerHTML = this.building.getDescription();
    this.div.appendChild(description);
	}

  public destroyView(){
    this.parent.removeChild(this.div);
    this.div = null;
    this.li = null;
  }

  public createListButton(list : HTMLUListElement, label : string, effect){
    var li = document.createElement('li');
    var button : HTMLButtonElement = document.createElement("button");
    button.innerHTML = label;
    button.onclick = effect;

    li.appendChild(button);
    list.appendChild(li);
  }

  public populateOccupants(soulIds : number[]){

    var self = this;
    var clickSoul = function(arg){
        return function(){
          self.destroyView();
					
					var resources = null;
					if(self.building instanceof ghetto){
						var asGhetto = self.building as ghetto;
						resources = asGhetto.getResources();
					}
					
          var newSoulView = new soulView(self.parent, arg, resources, self, self.mapView);
        }
    };
				
    //document.getElementById("flavour").innerHTML = occupants[0].name();
    for(var i = 0; i < soulIds.length; i++){
			var listSoul = new soul(soulIds[i]);
      var list = document.createElement('li');
      //var listSoul = occupants[i];
      list.innerHTML = listSoul.name();
      list.className = "hoverable";
      //list.onclick = clickSoul(listSoul);
      list.onclick = clickSoul(listSoul)
      this.li.appendChild(list);
      //document.getElementById("flavour").innerHTML = i.toString();
    }
  }
}
