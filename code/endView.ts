class endView{
	private resources : resources;
  private div : HTMLElement;
	
	private timePlayed : number;
	private end : HTMLParagraphElement;
	
	private endState : number = 0;
	
	  private endTexts = [
		"...",
		"Where is everything?",
		"Everything is white.",
		"What happened?",
		"You almost finished the ritual. No... That's not right. You did finish the ritual. And the precise moment you did...",
		"Where are you?",
		"Slowly, sounds come.",
		"A siren, and people chatting, concerned.",
		"You become aware of a weight on your back, and pain all over.",
		"No, not a weight. It's the floor, you're lying on the ground.",
		"You open your eyes.",
		"...",
		"A bustling street. People and buildings all around you. The perfect sky is crisscrossed with fluffy contrails. Everything is good."
		];

  constructor(parent : HTMLElement, resources : resources, timePlayed : number){
    this.resources = resources;
		this.timePlayed = timePlayed;

    this.div = document.createElement('div');
    this.div.className = "bar";
		
		var dots = document.createElement('div');
		dots.innerHTML = "...";
		
    this.end = document.createElement('p');
    this.end.className = "hoverable";
    this.nextEnd();
    this.end.onclick = () => {
      this.nextEnd();
    }

    parent.appendChild(this.div);
		this.div.appendChild(dots);
		this.div.appendChild(this.end);
		this.div.appendChild(document.createElement("hr"));
  }
	
	public nextEnd(){
    if(this.endState < this.endTexts.length - 1){
      this.end.innerHTML = this.endTexts[this.endState++];
    }
		else{
			this.end.innerHTML = this.endTexts[this.endState++];
			this.end.className = "";
			this.end.onclick = null;
			
			this.div.removeChild(this.div.lastChild);
			
			
			this.timePlayed = this.timePlayed / 1000;
			var hours = Math.floor( this.timePlayed / (60*60) );
			this.timePlayed -= hours * (60 * 60);
			var minutes = Math.floor( this.timePlayed / 60);
			this.timePlayed -= minutes * 60;
			var seconds = Math.floor ( this.timePlayed);
			
			var score = document.createElement('p');
			score.innerHTML = "Thank you for playing! You completed the game in " + hours + " hours, " +  minutes + " minutes and " + seconds + " seconds, and your remaining Anguish was " + this.resources.getPain() + " (higher is better!).";
			
			this.div.appendChild(score);
			
			this.div.appendChild(document.createElement("hr"));
			var advertising1 = document.createElement('p');
			advertising1.innerHTML = "My website is www.footnotesforthefuture.com";
			
			var advertising2 = document.createElement('p');
			advertising2.innerHTML = "You can email me at footnotesforthefuture@gmail.com";
			
			this.div.appendChild(advertising1);
			this.div.appendChild(advertising2);
		}
  }
}