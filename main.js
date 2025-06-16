// main.js (Non-module version with CDN)

window.onload = function () {
  const config = {
    type: Phaser.AUTO,
     backgroundColor: "#181c24", // 🌟 warna latar belakang kebiruan
    scale: {
      mode: Phaser.Scale.FIT, // 🌟 agar responsive
      autoCenter: Phaser.Scale.CENTER_BOTH, // 🌟 agar muncul di tengah
    width: 1280,
    height: 720,
    },
    pixelArt: true, // 🌟 agar grafik tetap tajam saat diskalakan
    scene: [SplashScene, Level01Scene, Level02Scene],
  };

  const game = new Phaser.Game(config);
};



