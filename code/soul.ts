class soul{
  private id : number;

  //Flavour Stuff
  private gender : string;
  private age : number;
  private firstName : string;
  private lastName : string;
  private fears : string;
  private secrets : string;
  private desires : string;

  private thoughts : string;
	
	private randCount = 0;
	
	private _seed : number;
	
	private description : string = "";
	
	private walking : boolean = false;

  constructor(id : number, alternativeDescription1 : string = null, alternativeDescription2 : string = null){
    this.id = id;
		this.initialiseSeed();
    this.generate();
		
		this.description = "Here stands the soul of " + this.name() + ".";
		if(alternativeDescription1 != null && alternativeDescription2 != null){
			this.description = alternativeDescription1 + this.name() + alternativeDescription2;
			this.walking = true;
		}
  }
	
	public getWalking(){
		return this.walking;
	}

  public name(){
    return this.firstName + " " + this.lastName;
  }

  //Probably shouldn't be done here but whatevs
  public formattedDescription(){
    return  "<p>" + this.description +"</p>" +
            "<p>" + this.fears + "</p>" +
            "<p><i>" + this.newThought() +  "<br>" + this.newThought() + "</i></p>";
  }

  public generate(){
		//console.log("Generating new character");
		for(var i = 0; i < 20; i++){
			this.seededRandom(); //Generate a bunch of randoms first to get away from the similar first values for similar seeds
		}
		
    this.gender = this.selectSeededRandomFrom(["Male", "Female"]);
    if(this.gender === "Male"){
      this.firstName = this.selectSeededRandomFrom(charGenData.maleFirstNames);
    }
    else{
      this.firstName = this.selectSeededRandomFrom(charGenData.femaleFirstNames);
    }

    if(this.seededRandom() < 0.07){
      this.lastName = this.selectSeededRandomFrom(charGenData.lastNames) + "-" + this.selectSeededRandomFrom(charGenData.lastNames);
    }
    else{
      this.lastName = this.selectSeededRandomFrom(charGenData.lastNames);
    }

    this.fears = this.generateSentence(charGenData.fearPhrases, charGenData.fears) + " " + this.generateSentence(charGenData.fearPhrases, charGenData.fears);

  }

  private generateSentence(structures : string[], contents : string[]){
    var structure : string = this.selectSeededRandomFrom(structures);
    var content : string = this.selectSeededRandomFrom(contents);
    structure = structure.replace("&ins", content);
    if(this.gender === "Male"){
      structure = structure.replace("&pp", "His");
      structure = structure.replace("&np", "He");
      structure = structure.replace("&mp", "him");
      structure = structure.replace("&ncpp", "his");
    }
    else{
      structure = structure.replace("&pp", "Her");
      structure = structure.replace("&np", "She");
      structure = structure.replace("&mp", "her");
      structure = structure.replace("&ncpp", "her");
    }
    return structure;
  }

  public selectTrueRandomFrom(input: string[]){
    return input[Math.floor(Math.random()*input.length)];
  }
	
	public selectSeededRandomFrom(input: string[]){
    return input[Math.floor(this.seededRandom()*input.length)];
  }

  public getId(){
    return this.id;
  }

  public newThought(){
    return this.selectTrueRandomFrom(charGenData.generalThoughts);
  }
	
	public initialiseSeed(){
		var seed = this.id;
		this._seed = seed % 2147483647;
		if (this._seed <= 0) this._seed += 2147483646;
	}
	
	public seededRandom(){
		this._seed = this._seed * 16807 % 2147483647;
		var out = (this._seed - 1) / 2147483646;
		//console.log(out);
		return out;
	}	
}
