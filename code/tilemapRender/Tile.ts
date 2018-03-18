class Tile{
	public character : string;
	public colour : string;
	public background : string;
	public shadow : string;
	
	public changed(other : Tile) : boolean{
		if(this.character != other.character ||
			this.colour != other.colour ||
			this.background != other.background ||
			this.shadow != other.shadow){
			
			return true;
		}
		
		return false;
	}
}