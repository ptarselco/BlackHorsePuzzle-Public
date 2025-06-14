// main.js (Non-module version with CDN)

window.onload = function () {
  const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1280,
    //backgroundColor: "#000000",
    scene: [SplashScene, Level01Scene, Level02Scene],
  };

  const game = new Phaser.Game(config);
};



