class Game{

  private mapRenderer : mapView = null;
  private map : map;

  private resources : resources = null;
  private resourceView : resourceView = null;
  private statusView : story = null;

  private lastUpdate : number;
	private firstUpdate : number = null;
	
	private finished : boolean = false;
	
	private loadingPopup = null;

  constructor(){
		showGhettoButton = false;
		showCrusherButton = false;	
		showWarperButton = false;
		showPowerPlantButton = false;
		showBigCrusherButton= false;
		showPainBuildingButton = false;
		showZigguratButton = false;
		
		disableConcentrate = false;
		disabledConcentrateAlready = false;
		
		satanMode = false;
		fastMode = false;
		if(satanMode){
			alert('Satan Mode Activated!');
			
			showGhettoButton = true;
			showCrusherButton = true;	
			showWarperButton = true;
			showPowerPlantButton = true;
			showBigCrusherButton = true;
			showPainBuildingButton = true;
			showZigguratButton = true;
		}
		
    this.resources = new resources();
		this.map = new map(this.resources);
		
    this.resourceView = new resourceView(document.body, this.resources);
    this.mapRenderer = new mapView(document.body, "DejaVuSansMono", 18, -4, 11, this.map, this.resources);

    this.statusView = new story(document.body, this.resources, this.mapRenderer);
		
		endFunction = this.finishGame;
  }
	
	public finishGame = () => {
		this.finished = true;
		
		var children = document.body.childNodes;
		for(var i = children.length - 1; i >= 0; i--){
			if(children[i] instanceof HTMLDivElement){
				document.body.removeChild(children[i]);
			}
		}
		
		var end = new endView(document.body, this.resources, this.lastUpdate - this.firstUpdate)
	}

  public update(timestamp : number){
		if(this.finished){
			return;
		}
		
		if(this.firstUpdate != null && fastMode){
			var diff = timestamp - this.firstUpdate;
			var newDiff = timestamp * 4;
			timestamp = this.firstUpdate + newDiff;
		}
		
		
		if(timestamp - this.lastUpdate > 1000){
			if(this.loadingPopup == null){
				this.loadingPopup = new loadingView(document.body);
				return;
			}
			
			
			//alert("Catchup to 1 second");
			var tempLastUpdate = this.lastUpdate;
			while(timestamp - tempLastUpdate > 1000){
				this.updateState(tempLastUpdate);
				tempLastUpdate += 50;
			}
			
			this.loadingPopup.destroyView();
			this.loadingPopup = null;
		}
	
		this.updateState(timestamp);
    this.updateViews();
    

    this.lastUpdate = timestamp;
		if(this.firstUpdate == null){
			this.firstUpdate = timestamp;
		}
  }
	
	private updateState(timestamp : number){
		this.resources.update(timestamp);
		this.map.update(timestamp);
	}
	
	private updateViews(){
		this.resourceView.update();
    this.mapRenderer.update();
	}
}
