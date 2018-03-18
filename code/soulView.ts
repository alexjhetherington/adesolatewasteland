/// <reference path="soul.ts"/>
/// <reference path="./resources.ts"/>
/// <reference path="./buildingView.ts"/>
/// <reference path="./simpleMessageView.ts"/>

class soulView{

  private div : HTMLElement = null;
  private soul : soul = null;
  private resources : resources;
  private parent : HTMLElement = null;
  private buildingView : buildingView = null;
  private mapView : mapView = null;

  constructor(parent : HTMLElement, soul : soul, resources : resources, buildingView : buildingView, mapView : mapView){
    this.soul = soul;
    this.parent = parent;
    this.buildingView = buildingView;
    this.resources = resources;
    this.mapView = mapView;

    this.createView();
  }

  public createView(){
		document.getElementById("flavour").innerHTML = "Someone appears before you.";
		
    this.div = document.createElement("div");

    this.div.innerHTML = this.soul.formattedDescription();

    var soulOptions : HTMLUListElement = document.createElement("ul");
    soulOptions.className = "horzMenu";

    //Harvest
    if(this.resources != null && (this.buildingView == null || this.buildingView.getBuilding() instanceof ghetto)){
      var button1 : HTMLButtonElement = document.createElement("button");
      button1.innerHTML = "Dismember";
      button1.onclick = () => {
				
				if(this.buildingView != null && this.buildingView.getBuilding() instanceof ghetto){
					var asGhetto = this.buildingView.getBuilding() as ghetto;
					var idRemoved = asGhetto.getSoulById(this.soul.getId());
					
					if(idRemoved == null){
						//alert('Did not remove soul you dismembered. What?');
						this.destroyView();
						var simpleMessage = new simpleMessageView(this.parent, "This soul has already moved on.", this.mapView);
						return;
					}
				}
				
				if(disableConcentrate && this.buildingView != null){
					disableConcentrate = false;
				}
				
        this.resources.turnSoulToBones();
        this.destroyView();
				//if(this.buildingView != null){
				//	this.buildingView.createView();
				//}
				//else{
					this.mapView.createView();
				//}
        document.getElementById("flavour").innerHTML = "You rip through flesh as if it were jelly.";
      }
      soulOptions.appendChild(button1);
    }

    if(this.buildingView != null || (this.mapView != null && this.soul.getWalking())){
      var button2 : HTMLButtonElement = document.createElement("button");
      button2.innerHTML = "Return";
      button2.onclick = () => {
        this.destroyView();
				if(this.buildingView == null){
					this.mapView.createView();
				}
				else{
					this.buildingView.createView();
				}
      }
      soulOptions.appendChild(button2);
    }


    this.div.insertBefore(soulOptions, this.div.firstChild);

    this.parent.appendChild(this.div);
  }

  public destroyView(){
    this.parent.removeChild(this.div);
    this.div = null;
  }
}
