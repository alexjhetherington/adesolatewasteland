module Main{
  var game : Game = null;

  export function start(){
    game = new Game();
  }

  window.onload = function(){
    Main.start();
  }

  function step(timestamp){
    if(game != null){
      game.update(timestamp);
    }
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
	
	
	/*function step(){
    if(game != null){
      game.update(performance.now());
    }
  }
  setInterval(step, 30);
	//workerTimer.setInterval(step, 30);*/
	//test

}
