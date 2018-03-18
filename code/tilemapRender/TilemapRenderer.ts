class TilemapRenderer{
	
	private tileMap : Tile[][] = [];
	private tileMapNext : Tile[][] = [];
	private tileChanged : boolean[][] = [];
	
	private height : number;
  private width : number;
	
	private font : string;
	private fontSize : number;
	private tileWidth : number;
	
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
		
		for(var x = 0; x < this.width; x++){
			var yArray = [];
			yArray.length = this.height;
			this.tileMap.push(yArray);
			
			var yArray2 = [];
			yArray2.length = this.height;
			this.tileMapNext.push(yArray2);
			
			var yArray3 = [];
			yArray3.length = this.height;
			this.tileChanged.push(yArray3);
		}
	}
	
	public setAllNextTilesBlank(){
		this.tileMapNext = [];
		for(var x = 0; x < this.width; x++){
			var yArray = [];
			for(var y = 0; y < this.height; y++){
				var newBlankTile = new Tile();
				newBlankTile.colour = 'black';
				newBlankTile.background = 'white';
				newBlankTile.character = ' ';
				yArray.push(newBlankTile);
			}
			this.tileMapNext.push(yArray);
		}
	}
	
	private fillNullTiles(){
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				if(this.tileMap[x][y] == null){
					var newBlankTile = new Tile();
					newBlankTile.colour = 'black';
					newBlankTile.background = 'white';
					newBlankTile.character = ' ';
					this.tileMap[x][y] = newBlankTile;
				}
			}
		}
	}
	
	private setAllTilesChanged(){
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				this.tileChanged[x][y] = true;
			}
		}
	}
	
	private copyCurrentMapToNext(){
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				this.tileMapNext[x][y] = this.tileMap[x][y];
			}
		}
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
    
		this.forceRenderAll();
		
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
		
		this.tileMapNext[x][y] = tile;
	}
	
	private forceRenderAll(){
		this.fillNullTiles();
		this.copyCurrentMapToNext();
		this.setAllTilesChanged();
		this.renderChangedTiles();
		this.copyToScreenCanvas();
	}
	
	public finishRendering(){
		this.calculateTilesChanged();
		this.renderChangedTiles();
		this.copyToScreenCanvas();
	}
	
	private calculateTilesChanged(){
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				var tile = this.tileMap[x][y];
				var tileNext = this.tileMapNext[x][y];
				
				if(tile == null && tileNext == null){
					this.tileChanged[x][y] = false;
				}
				else if((tile != null && tileNext == null) || (tile == null && tileNext != null)){
					this.tileChanged[x][y] = true;
				}
				else{
					this.tileChanged[x][y] = tile.changed(tileNext);
				}
			}
		}
	}
	
	private renderChangedTiles(){
		var backgroundDictionary = {};
		var characterDictionary = {};
		
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				if(this.tileChanged[x][y]){
					var tile = this.tileMapNext[x][y];
					this.tileMap[x][y] = tile;
					
					if(backgroundDictionary[tile.background] == null){
						backgroundDictionary[tile.background] = [];
					}
					
					backgroundDictionary[tile.background].push( [x, y] );
					
					var characterIndex = tile.colour + "," + tile.shadow;
					if(characterDictionary[characterIndex] == null){
						characterDictionary[characterIndex] = [];
					}
					
					characterDictionary[characterIndex].push( [x, y] );
				}
			}
		}
		
		var backgroundKeys = Object.keys(backgroundDictionary);
		for(var i = 0; i < backgroundKeys.length; i++){
			var backgroundRenderer = new BackgroundRenderer(this.offContext, this.tileWidth, this.fontSize, backgroundKeys[i]);
			for(var j = 0; j < backgroundDictionary[backgroundKeys[i]].length; j++){
				var tileX = backgroundDictionary[backgroundKeys[i]][j][0];
				var tileY = backgroundDictionary[backgroundKeys[i]][j][1];
				backgroundRenderer.renderBackground(tileX, tileY);
			}
		}
		
		var characterKeys = Object.keys(characterDictionary);
		for(var i = 0; i < characterKeys.length; i++){
			var colourShadow = characterKeys[i].split(",");
			var colour = colourShadow[0];
			var shadow = null;
						
			if(colourShadow[1] != "null" && colourShadow[1] != "undefined"){
				shadow = colourShadow[1];
			}
			
			var characterRenderer = new CharacterRenderer(this.offContext, this.tileWidth, this.fontSize, this.font, colour, shadow)
			for(var j = 0; j < characterDictionary[characterKeys[i]].length; j++){
				var tileX = characterDictionary[characterKeys[i]][j][0];
				var tileY = characterDictionary[characterKeys[i]][j][1];
				characterRenderer.renderCharacter(this.tileMapNext[tileX][tileY].character, tileX, tileY);
			}
		}
	}
	
	
	private copyToScreenCanvas(){
		this.context.drawImage(this.offCanvas, 0, 0);
	}
}