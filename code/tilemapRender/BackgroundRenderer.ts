class BackgroundRenderer{
	
	private canvasContext: CanvasRenderingContext2D = null;
	
	private tileWidth;
	private fontSize;
	
	/**
	
			To render tiles of different colours a new tile renderer must be constructed.
			
			This is to encourage designers to batch tiles by colour, which will increase performances.
			
			Be careful not to use an old tileRenderer if a new one has been constructed.
	
	*/
	
	constructor(canvasContext : CanvasRenderingContext2D, tileWidth : number, fontSize : number, colour : string){
		this.canvasContext = canvasContext;
		
		this.tileWidth = tileWidth;
		this.fontSize = fontSize;
		
		this.canvasContext.fillStyle = colour;
	}
	
	public renderBackground(x : number, y : number){
		this.canvasContext.fillRect(x * this.tileWidth, y * this.fontSize, this.tileWidth, this.fontSize);
	}
}