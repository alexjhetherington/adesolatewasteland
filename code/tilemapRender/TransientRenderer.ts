/// <reference path="./CharacterRenderer.ts"/>

class TransientRenderer{
	private tiles = [];
	
	private font : string;
	private fontSize : number;
	private tileWidth : number;
	
	private height : number;
	private width : number;
	
	private canvas : HTMLCanvasElement = null;
  private context : CanvasRenderingContext2D = null;

  private offCanvas : HTMLCanvasElement = null;
  private offContext: CanvasRenderingContext2D = null;
	
	constructor(width : number, height : number, font : string, fontSize : number, tileWidth : number){
		this.width = width;
		this.height = height;
		
		this.font = font;
		this.fontSize = fontSize;
		this.tileWidth = tileWidth;
	}
	
	public getCanvas() : HTMLCanvasElement{
		return this.canvas;
	}
	
	public createCanvas() : HTMLCanvasElement{
		//Create Offscreen canvas
    this.offCanvas = document.createElement("canvas");
    this.offContext = this.offCanvas.getContext("2d");

    this.offCanvas.height = this.height * this.fontSize;
    this.offCanvas.width = this.width * this.tileWidth;
		
    // Create the canvas
    this.canvas = document.createElement("canvas");
    if (!this.canvas.getContext) throw("Canvas not supported");
    this.context = this.canvas.getContext("2d");
		
		this.canvas.height = this.offCanvas.height;
    this.canvas.width = this.offCanvas.width;
    		
    return this.canvas;
	}
	
	public renderTile(x : number, y : number, character : string, colour : string, background : string, shadow : string){
		if(x >= this.width || y >= this.height || x < 0 || y < 0){
			return;
		}
		
		var tile = new Tile();
		tile.character = character;
		tile.colour = colour;
		tile.background = background;
		tile.shadow = shadow;
		
		this.tiles.push([x, y, tile]);
	}
	
	public finishRendering(){
		var characterDictionary = {};
		
		for(var i = 0; i < this.tiles.length; i++){
			var tile = this.tiles[i][2];
			var characterIndex = tile.colour + "," + tile.shadow;
			if(characterDictionary[characterIndex] == null){
				characterDictionary[characterIndex] = [];
			}
			
			characterDictionary[characterIndex].push( [this.tiles[i][0], this.tiles[i][1], i]);
		}
		
		var characterKeys = Object.keys(characterDictionary);
		for(var i = 0; i < characterKeys.length; i++){
			var colourShadow = characterKeys[i].split(",");
			var colour = colourShadow[0];
			var shadow = null;
			var characterRenderer = new CharacterRenderer(this.offContext, this.tileWidth, this.fontSize, this.font, colour, shadow)
			for(var j = 0; j < characterDictionary[characterKeys[i]].length; j++){
				var tileX = characterDictionary[characterKeys[i]][j][0];
				var tileY = characterDictionary[characterKeys[i]][j][1];
				var tileIndex = characterDictionary[characterKeys[i]][j][2];
				characterRenderer.renderCharacter(this.tiles[tileIndex][2].character, tileX, tileY);
			}
		}
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.drawImage(this.offCanvas, 0, 0);
		
		this.offContext.clearRect(0, 0, this.offCanvas.width, this.offCanvas.height);
		this.tiles = [];
	}	
}