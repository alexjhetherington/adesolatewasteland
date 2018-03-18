class story{

  private resources : resources;

	protected parent : HTMLElement;
	
  private div : HTMLDivElement;
  private intro : HTMLParagraphElement;
  private flavour : HTMLParagraphElement;

  private mapView : mapView;

  private introState : number = 0;
  private introTexts = [
  "Wake up...",
  "What is this place?",
  "A desolate wasteland. Vast crags on the horizon. The sky is torn asunder by cracks of silent lightning. Everything is grey."
  ];

  private flavourState : number = 0;
  private intro2Texts = [
  "A strange sensation...",
  "Something is rushing past...",
  "Screaming, weeping, choking, retching, convulsing, throbbing.",
  "Concentrate...",
  "Someone appears before you."
  ];

  constructor(parent : HTMLElement, resources : resources, mapView : mapView){
		this.parent = parent;
		
    this.resources = resources;
    this.mapView = mapView;

    this.div = document.createElement('div');
    this.div.className = "bar";

    this.intro = document.createElement('p');
    this.intro.className = "hoverable";
    this.nextIntro();
    this.intro.onclick = () => {
      this.nextIntro();
    }

    this.flavour = document.createElement('p');
    this.flavour.className = "hoverable";
    this.flavour.id = "flavour";
    this.flavour.onclick = () => {
      this.nextFlavour();
    }

    parent.appendChild(this.div);
    this.div.appendChild(this.intro);
    this.div.appendChild(document.createElement("hr"));
    this.div.appendChild(this.flavour);
		
		if(satanMode){
			this.skipIntro();
		}
  }
	
	public skipIntro(){
		this.resources.startGame();
		this.resources.turnSoulToBones();
		
		this.intro.className = "";
		this.flavour.className = "";
				
		this.introState = this.introTexts.length - 1;
		this.flavourState = 6;
		
		this.intro.innerHTML = this.introTexts[this.introState++];
		this.flavour.innerHTML = "Skipped Intro.";
		
		this.div.appendChild(document.createElement("hr"));
		
		this.mapView.createView();
	}

  public nextIntro(){
    if(this.introState < this.introTexts.length){
      this.intro.innerHTML = this.introTexts[this.introState++];
    }
    else if(this.flavourState === 0){
      this.intro.className = "";
      this.nextFlavour();
      this.div.appendChild(document.createElement("hr"));
    }
  }

  public nextFlavour(){
    if(this.flavourState < this.intro2Texts.length){
      this.flavour.innerHTML = this.intro2Texts[this.flavourState++];
    }
    else if(this.flavourState === 5){
      this.flavourState = 6;
      this.flavour.className = "";
      this.resources.startGame();
      new soulView(this.div.parentElement, new soul(this.resources.getNextSoulId()), this.resources, null, this.mapView);
    }
  }

  public setFlavour(input : string){
    this.flavour.innerHTML = input;
  }
	
	public destroyView(){
		this.parent.removeChild(this.div);
		this.div = null;
	}
}
