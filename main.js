// main.js (Non-module version with CDN)
import SplashScene from './Scenes/SplashScene.js';
import Level01Scene from './Scenes/Level01Scene.js';
import Level02Scene from './Scenes/Level02Scene.js';

window.onload = function () {
  const config = {
    type: Phaser.AUTO,
     //width: 1920,
     //height: 1280,
     backgroundColor: "#181c24", // 🌟 warna latar belakang kebiruan
     parent: 'game-container', // opsional
     width: 1920,
     height:1280,
    
     scale: {
      mode: Phaser.Scale.FIT, // 🌟 agar responsive
      autoCenter: Phaser.Scale.CENTER_BOTH, // 🌟 agar muncul di tengah
    },

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



