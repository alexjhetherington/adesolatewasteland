/// <reference path="./building.ts"/>
/// <reference path="./buildings/ghetto.ts"/>
/// <reference path="./buildings/ziggurat.ts"/>
/// <reference path="./buildings/crusher.ts"/>
/// <reference path="./buildings/bigCrusher.ts"/>
/// <reference path="./buildings/warper.ts"/>
/// <reference path="./buildings/powerPlant.ts"/>
/// <reference path="./resources.ts"/>
/// <reference path="./buildingView.ts"/>
/// <reference path="./painBuildingProgress.ts"/>
/// <reference path="./soulView.ts"/>
/// <reference path="./actor.ts"/>
/// <reference path="./soulActor.ts"/>
/// <reference path="./wanderingActor.ts"/>
/// <reference path="./concentrateView.ts"/>
/// <reference path="./global.d.ts"/>

class mapView{
  private tempBuild : building = null;
  private deleting : boolean = false;
  private roading : boolean = false;
  private mouseX : number;
  private mouseY : number;
  private mouseOnCanvas : boolean = false;
  private mouseDown : boolean = false;

  private resources : resources;

  private buildingMenu : HTMLDivElement = null;
	
	private debugPathfindingNodes : boolean = false;
	private debugPathfindingDestination : boolean = false;
	private settingPathfindingDest : boolean = false;
	
	private drawnWarperButton : boolean = false;
	
	private tilemapRenderer : TilemapRenderer = null;	
	private transientRenderer : TransientRenderer = null;
	
	private canvasDiv = null;
	
	private parent : HTMLElement;
	private map : map;
	
	private tileWidth : number;
	private fontSize : number;

  constructor(parent : HTMLElement, font : string, fontSize: number, tileWidthAdjust : number, tileWidthOverride : number, map : map, resources : resources){
		this.parent = parent;
		this.map = map;
		
		this.tileWidth = tileWidthOverride;
		this.fontSize = fontSize;
	
		this.tilemapRenderer = new TilemapRenderer(map.getWidth(), map.getHeight(), font, fontSize, tileWidthOverride);
		this.transientRenderer = new TransientRenderer(map.getWidth(), map.getHeight(), font, fontSize, tileWidthOverride);
		this.resources = resources;
  }
	
	//TODO Check this
	//TODO Stop rendering to off screen canvas' (of which there will be 4 after this)
	public destroyView(){
		this.parent.removeChild(this.canvasDiv);
		this.canvasDiv = null;
    this.parent.removeChild(this.buildingMenu);
    this.buildingMenu = null;
  }
	
  public createView(){		
		//Create Canvas		
		this.canvasDiv = document.createElement("div");
		this.canvasDiv.className = "canvasDiv";
		this.parent.appendChild(this.canvasDiv);
		
		var backgroundCanvas = this.tilemapRenderer.createCanvas();
		this.canvasDiv.appendChild(backgroundCanvas);
		
		var overlayCanvas = this.transientRenderer.createCanvas();
		overlayCanvas.className = "overlayCanvas";
		this.canvasDiv.appendChild(overlayCanvas);
		
		this.buildingMenu = document.createElement("div");
		this.buildingMenu.className = "buildingMenu";
		this.parent.appendChild(this.buildingMenu); //I prefer to append after it's created, but this helps keep this code (a bit) cleaner
		//this.parent.insertBefore(this.buildingMenu, this.parent.firstChild);
		
    var buttonList = document.createElement("ul");
		buttonList.className = "buildingMenuList";
		this.buildingMenu.appendChild(buttonList);
		
		this.createListHeader(buttonList, "Take Action");
		
		if(disableConcentrate){
			this.createFakeListButton(buttonList, "Concentrate...", "concentrateCost");
		}
		else{
			this.createListButton(buttonList, "Concentrate...", "", () => this.coalesceSoul());
		}		
		
		if(showGhettoButton){
			this.createListHeader(buttonList, "Utility");
			this.createListButton(buttonList, "Cancel", null, () => this.cancel());
			
			if(!showCrusherButton){
				this.createFakeListButton(buttonList, "Delete", "deleteCost");
			}
			else{
				this.createListButton(buttonList, "Delete", null, () => this.setDeleting());
			}		
			
			this.createListHeader(buttonList, "Roads");
			this.createListButton(buttonList, "Build Roads", null, () => this.setRoading());
			
			this.createListHeader(buttonList, "Buildings");
			this.createListButton(buttonList, "Ghetto", "ghettoCost", () => this.setTempBuilding(new ghetto(this.map, this.resources)));		
			this.setCostLabel(new ghetto(this.map, this.resources));
		}
			
		if(showCrusherButton){
			this.createListButton(buttonList, "Crusher", "crusherCost", () => this.setTempBuilding(new crusher(this.map, this.resources)));
			this.setCostLabel(new crusher(this.map, this.resources));
		}
		
		if(showBigCrusherButton){
			this.createListButton(buttonList, "Big Crusher", "bigCrusherCost", () => this.setTempBuilding(new bigCrusher(this.map, this.resources)));
			this.setCostLabel(new bigCrusher(this.map, this.resources));
		}
		
		if(showWarperButton){
			this.createListButton(buttonList, "Warper", "warperCost", () => this.setTempBuilding(new warper(this.map)));
			this.setCostLabel(new warper(this.map));
			this.drawnWarperButton = true;
		}
		
		if(showPowerPlantButton){
			this.createListButton(buttonList, "Power Plant", "powerPlantCost", () => this.setTempBuilding(new powerPlant(this.map, this.resources)));
			this.setCostLabel(new powerPlant(this.map, this.resources));
		}
		
		var enableZigguratButton = false;
		
		//This will cause some great glitches unless it is refreshed whenever it is clicked
		if(showPainBuildingButton){
			var progress = new painBuildingProgress();
			var info = progress.getNextPainBuilding(this.map, this.resources);
			
			this.createListHeader(buttonList, "SPECIAL: Punishment");
			
			if(info != null){
				this.createListButton(buttonList, info[0], "painBuildingCost", () => this.setTempBuilding(info[1]));
				document.getElementById("painBuildingCost").innerHTML = "SPECIAL";
				document.getElementById("painBuildingCost").innerHTML = info[1].getNextBones() + " bones";
			}
			else{
				this.createFakeListButton(buttonList, "Inactive", "painBuildingCost");
				document.getElementById("painBuildingCost").innerHTML = "FINISHED";
				enableZigguratButton = true;
			}
		}
		
		if(showZigguratButton){
			this.createListHeader(buttonList, "SPECIAL: Ritual");
			
			var temp = new ziggurat(this.map, this.resources);
			if(this.map.getBuildingsCount(temp) == 0 && (enableZigguratButton || satanMode)){
				this.createListButton(buttonList, "Ziggurat", "zigguratBuildingCost", () => this.setTempBuilding(new ziggurat(this.map, this.resources)));
				this.setCostLabel(temp);
			}
			else{
				this.createFakeListButton(buttonList, "Ziggurat", "zigguratBuildingCost");
				
				if(enableZigguratButton || satanMode){
					document.getElementById("zigguratBuildingCost").innerHTML = "BUILT";
				}
				else{
					this.setCostLabel(temp);
				}
			}
		}
		
		if(this.debugPathfindingDestination){
			this.createListButton(buttonList, "Set Pathfinding Destination", null, () => this.setPathfindingDestination());
		}

    this.mouseOnCanvas = false;
    this.transientRenderer.getCanvas().onmousemove = (event) => this.mouseMoved(event);
    this.transientRenderer.getCanvas().onmouseenter = (event) => {this.mouseOnCanvas = true;}
    this.transientRenderer.getCanvas().onmouseleave = (event) => {this.mouseOnCanvas = false; this.mouseDown = false;}
    this.transientRenderer.getCanvas().onmousedown = (event) => {this.mouseDown = true;}
    this.transientRenderer.getCanvas().onmouseup = (event) => {this.mouseDown = false;}
    this.transientRenderer.getCanvas().onclick = () => this.canvasClick();
  }
	
	private setCostLabel(building : building){
		var labelId = null
		
		if(building instanceof ghetto){
			labelId = "ghettoCost";
		}
		else if (building instanceof crusher){
			labelId = "crusherCost";
		}
		else if (building instanceof warper){
			labelId = "warperCost";
		}
		
		else if (building instanceof powerPlant){
			labelId = "powerPlantCost";
		}
		
		else if (building instanceof bigCrusher){
			labelId = "bigCrusherCost";
		}
		
		else if (building instanceof ziggurat){
			labelId = "zigguratBuildingCost";
		}
		
		if(labelId != null){
			document.getElementById(labelId).innerHTML = building.getNextBones() + " bones";
		}
	}
	
	public createFakeListButton(buttonList : HTMLUListElement, label : string, descId : string){
    var buttonLi = document.createElement('li');
    var button : HTMLButtonElement = document.createElement("button");
    button.innerHTML = label;
		button.className = "listFakeButton";

		//var requiresLi = document.createElement('li');
    var description = document.createElement('span');
    description.innerHTML = "-";
		description.id = descId;
		description.className = "listDescription";

    buttonLi.appendChild(button);
    buttonLi.appendChild(description);
    buttonList.appendChild(buttonLi);
	}

  public createListButton(buttonList : HTMLUListElement, label : string, descId : string, effect){
    var buttonLi = document.createElement('li');
    var button : HTMLButtonElement = document.createElement("button");
    button.innerHTML = label;
    button.onclick = effect;
		button.className = "listButton";

		//var requiresLi = document.createElement('li');
    var description = document.createElement('span');
    description.innerHTML = "-";
		description.id = descId;
		description.className = "listDescription";

    buttonLi.appendChild(button);
    buttonLi.appendChild(description);
    buttonList.appendChild(buttonLi);
		//requiresList.appendChild(requiresLi);
  }
	
	public createListHeader(buttonList : HTMLUListElement, headerString : string){
		var buttonLi = document.createElement('li');
		buttonLi.className = "buildingMenuHeader";
		
		var header = document.createElement('span');
    header.innerHTML = headerString;
		
		buttonLi.appendChild(header);
		buttonList.appendChild(buttonLi);
	}

  public mouseMoved(evt){
      var rect = this.tilemapRenderer.getCanvas().getBoundingClientRect();
      this.mouseX = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*this.tilemapRenderer.getCanvas().width);
      this.mouseY = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*this.tilemapRenderer.getCanvas().height);

      var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
      var gridSquareY = Math.floor(this.mouseY / this.fontSize);

      if(this.mouseDown){
        if(this.roading){
          this.buildRoad(gridSquareX, gridSquareY);
        }
        if(this.deleting){
          this.map.setRoad(gridSquareX, gridSquareY, false);
        }
      }
  }
	
	private checkRedraw(){
		if(showWarperButton && !this.drawnWarperButton && this.buildingMenu != null){ //stupid hack to see if you're on the map screen or not
			return true;
		}
		else{
			return false;
		}
	}
	
	//TODO redraw such that there is no gap between removing the old view and making the new one
	//Remember, this function is so the buttons can be refreshed. Could also just factor out an "update buttons" function
	private redraw(){ 
		this.destroyView();
		this.createView();
	}
	
	public update(){
		if(this.checkRedraw()){
			this.redraw();
		}
		this.renderAll();
	}

  public renderAll(){
    if(this.canvasDiv != null){
			this.tilemapRenderer.setAllNextTilesBlank();
			
      this.renderAllBuildings();
      this.renderAllRoads();
			this.renderAllActors();
      this.renderTempBuild();
      this.renderMouseSquare();
			//this.renderDebug();			
			
			this.tilemapRenderer.finishRendering();
			this.transientRenderer.finishRendering();
    }
  }
	
	public renderAllActors(){
		var actors = this.map.getActors();
		
		for(var i = 0; i < actors.length; i++){
			this.renderActor(actors[i]);
		}
	}
	
	public renderActor(actor : actor){
		if(actor.getX() != null && actor.getY() != null){
			if(actor instanceof multipleSoulActor){
				this.transientRenderer.renderTile(actor.getX(), actor.getY(), "\u25A0", actor.getColour(), null, null);
			}
			else{
				this.transientRenderer.renderTile(actor.getX(), actor.getY(), "\u2666", actor.getColour(), null, null); //Very enjoyable that the diamond character ends in 666 in hex
			}
		}
	}
	
	/*public renderDebug(){
		if(this.debugPathfindingNodes){		
			for(var x = 0; x < this.map.getWidth(); x++){
				for(var y = 0; y < this.map.getHeight(); y++){
					var node = this.map.getPathfindingGraph().getNode(x, y);
					if(node != null){
						var neighbours = node.getNeighbours();
						for(var i = 0; i < neighbours.length; i++){
							super.renderPath(x,y,neighbours[i].getX(),neighbours[i].getY());
						}
						super.renderCircle(x,y);
					}
				}
			}
		}
	}*/

  public renderTempBuild(){
    if(this.tempBuild != null && this.mouseOnCanvas){

      var gridSquareX = Math.floor((this.mouseX - (((this.tempBuild.getWidth() / 2) - 0.5) * this.tileWidth )) / this.tileWidth);
      var gridSquareY = Math.floor((this.mouseY - (((this.tempBuild.getHeight() / 2) - 0.5) * this.fontSize )) / this.fontSize);
      this.tempBuild.setX(gridSquareX);
      this.tempBuild.setY(gridSquareY);

      if(!this.resources.canSpendResources(this.tempBuild) || this.tempBuild.collidesAny(this.map.getBuildings()) || this.roadsInBuildingFootPrint(this.tempBuild) || 
					this.buildingOutOfBounds(this.tempBuild) || !this.tempBuild.getMapRequirementsMet(this.map.getBuildings(), this.map.getRoads())){
        this.renderBuilding(this.tempBuild, 'black', 'red', true);
      }
      else{
        this.renderBuilding(this.tempBuild, 'white', 'black', true);
      }
    }
  }

  public renderAllBuildings(){
    var builds = this.map.getBuildings();
    for(var i = 0; i < builds.length; i++){
      this.renderBuilding(builds[i], 'black', 'white');
    }
		
		if(this.deleting){
			var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
      var gridSquareY = Math.floor(this.mouseY / this.fontSize);
			var hoverOverBuilding = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
			if(hoverOverBuilding != null){
				this.renderBuilding(this.map.getBuildings()[hoverOverBuilding], 'black', 'red', true);
				var linkedBuildings = this.map.getLinkedDeleteBuildings(hoverOverBuilding);
				for(var y = 0; y < linkedBuildings.length; y++){
					this.renderBuilding(linkedBuildings[y], 'black', 'red', true);
				}
			}
		}
  }

  public renderMouseSquare(){
    if(this.mouseOnCanvas){
      var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
      var gridSquareY = Math.floor(this.mouseY / this.fontSize);

			var hoverBuilding = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
			
      if(this.deleting){
				if(hoverBuilding != null){
					return;
				}
				this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, ' ', 'white', 'red', null);
      }
      else if (this.roading){
				if(hoverBuilding == null){
					this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'R', 'white', 'black', null);
				}
				else{
					this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'R', 'white', 'red', null);
				}
      }
			else if (this.settingPathfindingDest){
				this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, 'd', 'white', 'blue', null);
			}
			else if (hoverBuilding != null){
				this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, '?', 'white', 'black', null);
			}
      else if (this.tempBuild == null){
				var selectedActor = this.map.getActorOccupyingGridIndex(gridSquareX, gridSquareY);
				
				if(selectedActor != null){
					this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, '?', 'white', 'black', null);
				}	
				else{
					this.tilemapRenderer.renderTile(gridSquareX, gridSquareY, ' ', 'white', 'black', null);
				}
      }
    }
  }

  public renderBuilding(building : building, colour : string, background : string, temp : boolean = false){
		var warped = false;
		
		if(!temp && (building.getAdjacentWarpers() > 0 || building instanceof warper)){
			warped = true;
		}
		
    for(var x = 0; x < building.getWidth(); x++){
      for(var y = 0; y < building.getHeight(); y++){
				if(!warped){
					this.tilemapRenderer.renderTile(building.getX() + x, building.getY() + y, building.getTile(x, y), colour, background, null);
				}
				else{
					this.tilemapRenderer.renderTile(building.getX() + x, building.getY() + y, building.getTile(x, y), colour, background, 'RoyalBlue');
				}					
      }
    }
  }

  public renderRoad(x : number, y : number){
    if(this.map.getRoad(x, y)){
      var north = this.map.getRoad(x, y - 1);
      var east = this.map.getRoad(x + 1, y);
      var south = this.map.getRoad(x, y + 1);
      var west = this.map.getRoad(x - 1, y);

      var tile;
      if(north && east && south && west){
        tile = '\u256c';
      }
      else if(east && south && west){
        tile = '\u2566';
      }
      else if(north && east && south){
        tile = '\u2560';
      }
      else if(south && west && north){
        tile = '\u2563';
      }
      else if(west && north && east){
        tile = '\u2569';
      }
      else if(north && east){
        tile = '\u255a';
      }
      else if(east && south){
        tile = '\u2554';
      }
      else if(south && west){
        tile = '\u2557';
      }
      else if(west && north){
        tile = '\u255d';
      }
      else if(north && south){
        tile = '\u2551';
      }
      else if(east && west){
        tile = '\u2550';
      }
      else if(north){
        tile = '\u2568';
      }
      else if(east){
        tile = '\u255e';
      }
      else if(south){
        tile = '\u2565';
      }
      else if(west){
        tile = '\u2561';
      }
      else{
        //tile = '\u25A1';
        //tile = '\u25af';
				tile = '\u256c';
      }

			this.tilemapRenderer.renderTile(x, y, tile, 'black', 'white', null);
    }
  }

  public renderAllRoads(){
    for(var x = 0; x < this.map.getWidth(); x++){
      for(var y = 0; y < this.map.getHeight(); y++){
        this.renderRoad(x, y);
      }
    }
  }

  public cancel(){
    this.tempBuild = null;
    this.deleting = false;
    this.roading = false;
		this.settingPathfindingDest = false;
  }
	
	public buildingOutOfBounds(build : building){
		if(build.getX() < 0 ||
		build.getY() < 0 ||
		build.getX() + build.getWidth() > this.map.getWidth() ||
		build.getY() + build.getHeight() > this.map.getHeight()){
			return true;
		}
		
		return false;
	}

  public roadsInBuildingFootPrint(build : building){
    for(var x = 0; x < build.getWidth(); x++){
      for(var y = 0; y < build.getHeight(); y++){
        if(this.map.getRoad(build.getX() + x, build.getY() + y)){
          return true;
        }
      }
    }

    return false;
  }

  public canvasClick(){
    if(this.tempBuild != null && !this.tempBuild.collidesAny(this.map.getBuildings()) && !this.roadsInBuildingFootPrint(this.tempBuild) && 
			!this.buildingOutOfBounds(this.tempBuild) && this.tempBuild.getMapRequirementsMet(this.map.getBuildings(), this.map.getRoads())){
      if(this.resources.canSpendResources(this.tempBuild)){
				this.resources.spendResources(this.tempBuild);
        this.map.addBuilding(this.tempBuild);
				
				this.setCostLabel(this.tempBuild);
				
        this.tempBuild = null;
        document.getElementById("flavour").innerHTML = "By your hand alone, creation.";
				this.redraw();
      }
      else{
        document.getElementById("flavour").innerHTML = "You don't have enough resources to erect such a construction.";
      }
    }
    else if (this.tempBuild == null){
      var gridSquareX = Math.floor(this.mouseX / this.tileWidth);
      var gridSquareY = Math.floor(this.mouseY / this.fontSize);

      if(this.deleting){
        var index = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
				if(index >= 0){
					var deleted = this.map.deleteBuilding(index);
					
					this.setCostLabel(deleted);
					this.redraw();
				}
        
        this.map.setRoad(gridSquareX, gridSquareY, false);
      }
      else if(this.roading){
        this.buildRoad(gridSquareX, gridSquareY);
        document.getElementById("flavour").innerHTML = "Carve the barren ground. You sweat as you toil. Use roads to connect buildings";
      }
			else if(this.settingPathfindingDest){
				var allActors = this.map.getActors();
				for(var i = 0; i < allActors.length; i++){
					allActors[i].setPathToDestination(gridSquareX, gridSquareY);
				}				
				this.settingPathfindingDest = false;
			}
      else if (this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY) != null){
        var index = this.map.getBuildingOccupyingGridIndex(gridSquareX, gridSquareY);
				var newBuildingView = new buildingView(this.parent, this.map.getBuildings()[index], this);
				this.destroyView();
				newBuildingView.createView();
      }
			else{
				//TODO put this in a proper place
				var selectedActor = this.map.getActorOccupyingGridIndex(gridSquareX, gridSquareY);
				if(selectedActor != null && selectedActor instanceof soulActor){
					var selectedSoulActor = selectedActor as soulActor;
					this.destroyView();
					var newSoul;
					
					if(selectedActor.getDestination() instanceof oasis){
						newSoul = new soul(selectedSoulActor.getId(),
							"Here walks the soul of ",
							", following nothing but the dreams of a clean oasis.");
					}
					else{
						newSoul = new soul(selectedSoulActor.getId(),
							"Here walks the soul of ",
							", chained and dragged along by a twisted, sinewy thing.");
					}
					
					var newSoulView = new soulView(this.parent, newSoul, null, null, this);
				}
				if(selectedActor != null && selectedActor instanceof multipleSoulActor){
					this.destroyView();
					new simpleMessageView(this.parent, "A rusty bus struggles through the dust. Peering out the darkened windows are timid souls, lost and alone despite their company.", this);
				}
				
				if(selectedActor != null && selectedActor instanceof wanderingActor){
					this.destroyView();
					var asWanderer = selectedActor as wanderingActor;
					new simpleMessageView(this.parent, asWanderer.getDescription(), this);
				}
			}
    }
  }
	
	private coalesceSoul(){
		if(!(this.resources.getSoulWind() > 0)){
			document.getElementById("flavour").innerHTML = "You concentrate, but nothing happens.";
		}
		else{
			this.resources.removeSoulWind();
			this.destroyView();
			new concentrateView(this.parent, this.resources, this);
		}
	}

  public buildRoad(x, y){
    if(this.map.getBuildingOccupyingGridIndex(x, y) == null){
      this.map.setRoad(x, y, true);
    }
  }

  public setTempBuilding(building : building){
    this.cancel();
    this.tempBuild = building;
		if(building.getBuildingMessage() != null){
			document.getElementById("flavour").innerHTML = "<b>" + building.getBuildingMessage() + "</b>";
		}
  }

  public setDeleting(){
    this.cancel();
    this.deleting = true;
  }

  public setRoading(){
    this.cancel();
    this.roading = true;
  }
	
	public setPathfindingDestination(){
		this.cancel();
		this.settingPathfindingDest = true;
	}
}
