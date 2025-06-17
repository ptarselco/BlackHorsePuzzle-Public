// main.js (Non-module version with CDN)

window.onload = function () {
  const config = {
    type: Phaser.AUTO,
     width: 1920,
     height: 1280,
     backgroundColor: "#181c24", // 🌟 warna latar belakang kebiruan
     parent: 'game-container', // opsional
    
     scale: {
      mode: Phaser.Scale.FIT, // 🌟 agar responsive
      autoCenter: Phaser.Scale.CENTER_BOTH, // 🌟 agar muncul di tengah
      width: 1920,
      height:1280,
   },


  //scale: {
  //mode: Phaser.Scale.RESIZE, // 🌟 agar layar fleksibel & tidak hardcoded
  //autoCenter: Phaser.Scale.CENTER_BOTH
 // },

    pixelArt: true, // 🌟 agar grafik tetap tajam saat diskalakan
    scene: [SplashScene, Level01Scene, Level02Scene],
    physics: {
    default: 'arcade',
    arcade: {
      debug: false
   }
  }
};
const game = new Phaser.Game(config);
window.game = game;
};



