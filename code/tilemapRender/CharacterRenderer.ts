class CharacterRenderer{
	
	private canvasContext: CanvasRenderingContext2D = null;
		
	private tileWidth : number;
	private fontSize : number;
	private font : string = null;
	private colour : string = null;
	private shadow : string = null;
	
	private characterImageDictionary = {};
	
	/**

			To render tiles of different colours a new tile renderer must be constructed.
			
			This is to encourage designers to batch tiles by colour, which will increase performances.
			
			Be careful not to use an old tileRenderer if a new one has been constructed.

	*/
	
	constructor(canvasContext : CanvasRenderingContext2D, tileWidth : number, fontSize : number, font : string, colour : string, shadow : string){
		this.canvasContext = canvasContext;
		
		this.tileWidth = tileWidth;
		this.fontSize = fontSize;
		this.font = fontSize.toString() + "px " + font;
		this.colour = colour;
		this.shadow = shadow;
	}
	
	public renderCharacter(character : string, x : number, y : number){
		
		var characterCanvas;
		
		if(this.characterImageDictionary[character] == null){
			characterCanvas = document.createElement("canvas");
			this.characterImageDictionary[character] = characterCanvas;
			
			characterCanvas.height = this.fontSize;
			characterCanvas.width = this.tileWidth;
			
			var characterContext = characterCanvas.getContext("2d");
			characterContext.textBaseline = "middle";
			characterContext.textAlign = "center"; 	
			characterContext.font = this.font;
			characterContext.fillStyle = this.colour;
			
			if(this.shadow != null){
				characterContext.shadowColor = this.shadow;
				characterContext.shadowBlur = 5;
			}
			else{
				characterContext.shadowColor = "rgba(0,0,0,0)";
				characterContext.shadowBlur = 0;
			}
			
			characterContext.fillText(character, 0.5 * this.tileWidth, 0.5 * this.fontSize);
		}
		else{
			characterCanvas = this.characterImageDictionary[character];
		}
		
		this.canvasContext.drawImage(characterCanvas, x * this.tileWidth, y * this.fontSize);
	}
}