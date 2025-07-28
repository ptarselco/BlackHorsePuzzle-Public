// SplashScene.js - Versi Lazy Loading (Backup dari SplashScene.js)

class SplashScene extends Phaser.Scene {
  constructor() {
    super("SplashScene");
  }

  preload() {
    // Loader untuk text saat loading
    document.getElementById('loader').style.display = 'flex';

    // ========== LOAD PRIORITAS TINGGI (Essential Splash) ==========
    this.load.image("coverBlank", "./Puzzle-Assets/Splash/Cover Blank.webp");
    this.load.image("text1", "./Puzzle-Assets/UI/Text Level 01.webp");
    this.load.image("text1glow", "./Puzzle-Assets/UI/Sp. Text Level 01 Glow.webp");
    this.load.image("btnBlue", "./Puzzle-Assets/UI/Sp. Button Blue Level 01.webp");
    this.load.audio("cinematic", "./Puzzle-Assets/Sfx/scenes/splash01_music_cinematic.mp3");
    
    // Essential horse animation
    this.load.spritesheet("blackHorse", "./Puzzle-Assets/Splash/BlackHorseRun.webp", {
      frameWidth: 750, frameHeight: 750
    });
    this.load.image("dust", "./Puzzle-Assets/Splash/Grain Dust.webp");
    
    
    // Sembunyikan loader setelah essential loading selesai
    this.load.on('complete', () => {
      document.getElementById('loader').style.display = 'none';
      
      if (!localStorage.getItem("playerEmail")) {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
      } else {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
      }
    });
  }

  create() {
   console.log('🎬 Creating cinematic splash scene...'); 
    // Cek apakah playerEmail sudah ada di localStorage
    const email = localStorage.getItem("playerEmail");
    let playerScore = 0;

   
    // Essential splash display
   // this.add.image(960, 640, "coverBlank").setDepth(0);
   // ✅ REPLACE with:
    this.backgroundCover = this.add.image(960, 640, "coverBlank").setDepth(0);
    this.sound.play("cinematic");

    // Essential horse animation
   if (!this.anims.exists("run")) { 
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("blackHorse", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });
  }
    const horse = this.add.sprite(460, 820, "blackHorse").setScale(1.3);
    horse.setDepth(1);
    horse.setAngle(-2);
    horse.play("run");

    // ✅ ADD IMMEDIATE BLACK HORSE DUST (HERO ENTRANCE):
  const blackHorseDust = this.add.particles(0, 0, "dust", {
    x: { min: 10, max: 700 }, // ✅ Around black horse position
    y: { min: 920, max: 1250 },  // ✅ At horse feet level
    speed: { min: 30, max: 50 },
    lifespan: 1000,
    quantity: 1, // ✅ More dramatic dust for hero
    alpha: { start: 0.1, end: 0 },
    scale: { start: 0.2, end: 1.5 },
    angle: { min: -45, max: -135 }, // ✅ Dust flying backward
    blendMode: "ADD",
    tint: 0xD2B48C // ✅ Sandy brown color for dust
  }).setDepth(0); // ✅ Behind horse but in front of background

    // Level 01 tombol
    const level1 = this.add.image(233, 269, "text1").setScale(0.6).setInteractive();
    const level1Glow = this.add.image(233, 280, "text1glow").setScale(0.6).setVisible(false);
    const btnBlue = this.add.image(233, 280, "btnBlue").setScale(0.8).setVisible(false);
    
    level1Glow.setDepth(22);
    btnBlue.setDepth(21);
    level1.setDepth(23);

    // ========== LAZY LOAD BACKGROUND ASSETS ==========
    this.time.delayedCall(2000, () => {
      console.log('🎨 Background loading splash decorations...');
      this.lazyLoadBackgroundAssets();
    });

  // Event klik Level 01
  //level1.on("pointerdown", () => {
      // Cek login
      //if (!localStorage.getItem("playerEmail")) {
        //document.getElementById("loginBox").style.display = "block";
        //alert("Please Login with your email!");
        //return;
      //}
  
// Event klik Level 01
level1.on("pointerdown", async () => {
  const email = localStorage.getItem("playerEmail");
  if (!email) {
    document.getElementById("loginBox").style.display = "block";
    alert("Please Login with your email!");
    return;
  }

  // Cek status game over dari backend
  let isGameOver = false;
  try {
    const response = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/gameover',
      { email }
    );
    isGameOver = response.data && response.data.isGameOver;
  } catch (err) {
    // Fallback ke localStorage jika backend gagal
    isGameOver = localStorage.getItem(`gameOver_${email}`) === 'true';
  }

  if (isGameOver) {
    // Buat instance Level01Scene untuk akses showGameOverReturnMessage
    const level01 = this.scene.get('Level01Scene');
    if (level01 && typeof level01.showGameOverReturnMessage === 'function') {
      level01.showGameOverReturnMessage();
      
    } else {
      // Jika belum ada instance, tampilkan pesan sederhana
      this.add.text(960, 800, "🔒 GAME OVER - Please buy favorite menu!", {
        font: "bold 36px Segoe UI",
        fill: "#ff0000",
        backgroundColor: "#fff",
        padding: { left: 30, right: 30, top: 10, bottom: 10 }
      }).setOrigin(0.5).setDepth(5001);
    }
    return;
    }

    // Jika tidak game over, lanjut ke Level01Scene
    this.scene.start("Level01Scene");
  

      // Show loading indicator
      const loadingText = this.add.text(960, 850, '', {
        fontSize: '24px', fill: '#00eaff'
      }).setOrigin(0.5);

      // Glow effect
      level1Glow.setVisible(true);
      btnBlue.setVisible(true);

      // ========== LAZY LOAD LEVEL01 ASSETS ==========
      console.log('🎵 Lazy loading Level01 assets...');
      this.lazyLoadLevel01Assets(() => {
        // Setelah loading selesai, pindah ke Level01
        loadingText.destroy();
        level1Glow.setVisible(false);
        btnBlue.setVisible(false);
        this.scene.start("Level01Scene");
      });
    });

    // Background music delayed
    this.time.delayedCall(3000, () => {
      if (this.backgroundMusicLoaded) {
        this.sound.play("music", { loop: true });
      }
    });
  }

  // ========== LAZY LOAD BACKGROUND ASSETS (Non-blocking) ==========
  lazyLoadBackgroundAssets() {
    // Load decorative assets di background
    this.load.image("cover", "./Puzzle-Assets/Splash/Cover Black Horse and His Herd R300.webp");
    //this.load.image("text2", "./Puzzle-Assets/UI/Text Level 02.webp");
    this.load.audio("music", "./Puzzle-Assets/Sfx/scenes/splash02_music_cowboy_western_background.mp3");
    this.load.audio("herdGallop", "./Puzzle-Assets/Sfx/sound/herd_gallop.mp3");
    this.load.image("flower", "./Puzzle-Assets/Splash/Flower orange red.webp");
    this.load.image("flowerR", "./Puzzle-Assets/Splash/Red Cactus Flower.webp");
    this.load.image("grass", "./Puzzle-Assets/Splash/Cutting Grass.webp");
    this.load.image("grass02", "./Puzzle-Assets/Splash/Grass02.webp");
    //this.load.image("text2glow", "./Puzzle-Assets/UI/Sp. Text Level 02 Glow.webp");
    this.load.image("btnRed", "./Puzzle-Assets/UI/Sp. Button Red Level 02.webp");
    
    // Load additional horses
    this.load.spritesheet("brownHorse01", "./Puzzle-Assets/Splash/BrownHorseRun01.webp", {
      frameWidth: 750, frameHeight: 750
    });
    this.load.spritesheet("brownHorse02", "./Puzzle-Assets/Splash/BrownHorseRun02.webp", {
      frameWidth: 750, frameHeight: 750
    });
    this.load.spritesheet("brownHorse03", "./Puzzle-Assets/Splash/BrownHorseRun03.webp", {
      frameWidth: 750, frameHeight: 750
    });
    this.load.spritesheet("ladyhorse", "./Puzzle-Assets/Splash/LadyHorseRun.webp", {
      frameWidth: 750, frameHeight: 750
    });

    this.load.once('complete', () => {
      console.log('✅ Background assets loaded!');
      this.backgroundMusicLoaded = true;
      this.createBackgroundElements();
    });

    this.load.start();
  }

  // ========== LAZY LOAD LEVEL01 ASSETS ==========
  lazyLoadLevel01Assets(callback) {
    // Load semua assets yang dibutuhkan Level01
    this.load.audio('horseNeigh', './Puzzle-Assets/Sfx/sound/horse-neigh.mp3');
    this.load.audio('horseSnort', './Puzzle-Assets/Sfx/sound/horse-snort.mp3');
    this.load.audio('horseHoof', './Puzzle-Assets/Sfx/sound/hoof-run.mp3');
    this.load.audio('horsehoofstep', './Puzzle-Assets/Sfx/sound/hoof-step.mp3');
    this.load.audio('horseGallop', './Puzzle-Assets/Sfx/sound/blackhorse-gallop.mp3');
    this.load.audio('herdGallop', './Puzzle-Assets/Sfx/sound/herd-gallop.mp3');
    
    // Music Level01
    this.load.audio('introMusic', './Puzzle-Assets/Sfx/scenes/level01-1-herdhorses-guitar-intro-ident.mp3');
    this.load.audio('mainMusic', './Puzzle-Assets/Sfx/scenes/level01-2 music-favorite-sunset-dreams.mp3');
    this.load.audio('winMusic', './Puzzle-Assets/Sfx/scenes/win-in-the-video-game.mp3');
    
    // Essential Level01 images
    //this.load.image('horse', './Puzzle-Assets/UI/GM. Black Horse Run Behind.webp');
   // this.load.image('paypalQR', './Puzzle-Assets/UI/paypal-qr.webp');

    this.load.once('complete', () => {
      console.log('✅ Level01 assets loaded!');
      callback();
    });

    this.load.start();
  }

  // ========== CREATE BACKGROUND ELEMENTS SETELAH LAZY LOAD ==========
  createBackgroundElements() {

    // ✅ REPLACE ALL THE ABOVE with this simple solo cover:
    // ✅ SIMPLE SOLO COVER (instead of herd horses):
    const herdCover = this.add.image(960, 640, "cover").setScale(1).setDepth(0);

    // ✅ SMOOTH TRANSITION EFFECT:
    herdCover.setAlpha(0);
    this.tweens.add({
      targets: herdCover,
      alpha: 1,
      duration: 2000,
      ease: 'Power2'
      //onComplete: () => {
      //console.log('✅ Herd cover transition complete!');
      //}
    });
    
    // Partikel Debu
    const particles = this.add.particles(0, 0, "dust", {
      x: { min: 10, max: 1900 },
      y: { min: 800, max: 1250 },
      speed: { min: 5, max: 70 },
      lifespan: 5000,
      quantity: 2,
      alpha: { start: 0.2, end: 0 },
      scale: { start: 0.1, end: 1 },
      angle: { min: -50, max: -100 },
      blendMode: "ADD"
    });

     // ✅ COMPLETE GRASS ANIMATIONS WITH PROPER DEPTH:
  const grass1 = this.add.image(200, 1100, "grass").setScale(1.0).setDepth(10);
  this.tweens.add({
    targets: grass1,
    rotation: 0.1,
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass2 = this.add.image(400, 1280, "grass02").setScale(0.6).setDepth(10);
  this.tweens.add({
    targets: grass2,
    rotation: -0.08,
    duration: 2500,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass3 = this.add.image(500, 1290, "grass").setScale(0.8).setDepth(10);
  this.tweens.add({
    targets: grass3,
    rotation: 0.12,
    duration: 1800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass4 = this.add.image(800, 1230, "grass02").setScale(0.7).setDepth(10);
  this.tweens.add({
    targets: grass4,
    rotation: -0.1,
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass5 = this.add.image(1000, 1215, "grass").setScale(0.9).setDepth(10);
  this.tweens.add({
    targets: grass5,
    rotation: 0.09,
    duration: 2400,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass6 = this.add.image(1200, 1225, "grass02").setScale(0.65).setDepth(10);
  this.tweens.add({
    targets: grass6,
    rotation: -0.11,
    duration: 2100,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass7 = this.add.image(1400, 1205, "grass").setScale(0.85).setDepth(10);
  this.tweens.add({
    targets: grass7,
    rotation: 0.13,
    duration: 1900,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass8 = this.add.image(1600, 1235, "grass02").setScale(0.75).setDepth(10);
  this.tweens.add({
    targets: grass8,
    rotation: -0.07,
    duration: 2300,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const grass9 = this.add.image(1800, 1250, "grass").setScale(1.05).setDepth(10);
  this.tweens.add({
    targets: grass9,
    rotation: 0.14,
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  // ✅ FLOWER ANIMATIONS:
  const flower1 = this.add.image(150, 1280, "flower").setScale(0.6).setDepth(11);
  flower1.setOrigin(0.5, 1); // ✅ PIVOT POINT AT BOTTOM (x=center, y=bottom)
  this.tweens.add({
    targets: flower1,
    rotation: 0.10,
    //y: flower1.y - 10, supaya bunga terlihat lebih hidup tidak goyang atas bawah
    duration: 4000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const flower2 = this.add.image(700, 1280, "flowerR").setScale(0.5).setDepth(11);
  flower2.setOrigin(0.5, 1); // ✅ PIVOT POINT AT BOTTOM (x=center, y=bottom)
  this.tweens.add({
    targets: flower2,
    rotation: 0.12,
    //y: flower2.y - 8,
    duration: 3500,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const flower3 = this.add.image(1000, 1340, "flower").setScale(0.5).setDepth(11);
  flower3.setOrigin(0.5, 1); // ✅ PIVOT POINT AT BOTTOM (x=center, y=bottom)
  this.tweens.add({
    targets: flower3,
    rotation: 0.18,
    //y: flower3.y - 12,
    duration: 2800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const flower4 = this.add.image(1500, 1220, "flowerR").setScale(0.5).setDepth(11);
  flower4.setOrigin(0.5, 1); // ✅ PIVOT POINT AT BOTTOM (x=center, y=bottom)
  this.tweens.add({
    targets: flower4,
    rotation: 0.15,
    //y: flower4.y - 9,
    duration: 3200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  const flower5 = this.add.image(1760, 1365, "flower").setScale(0.55).setDepth(11);
  flower5.setOrigin(0.5, 1); // ✅ PIVOT POINT AT BOTTOM (x=center, y=bottom)
  this.tweens.add({
    targets: flower5,
    rotation: 0.16,
   // y: flower5.y - 11,
    duration: 2900,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

    // Semua animasi rumput, bunga dari script asli (copy dari create() asli)
    // ... COPY SEMUA ANIMASI RUMPUT & BUNGA DARI SCRIPT ASLI ...

    // Brown horses animations
    if (!this.anims.exists("runBrown01")) {
    this.anims.create({
      key: "runBrown01",
      frames: this.anims.generateFrameNumbers("brownHorse01", { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
    });
  }
    
    const brownHorse1 = this.add.sprite(980, 890, "brownHorse01").setScale(0.8);
    brownHorse1.play("runBrown01");

    if (!this.anims.exists("runBrown02")) {
    this.anims.create({
      key: "runBrown02",
      frames: this.anims.generateFrameNumbers("brownHorse02", { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
    });
  }
    const brownHorse2 = this.add.sprite(1230, 840, "brownHorse02").setScale(0.75);
    brownHorse2.play("runBrown02");

    if (!this.anims.exists("runBrown03")) {
    this.anims.create({
      key: "runBrown03",
      frames: this.anims.generateFrameNumbers("brownHorse03", { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
    });
  }
    const brownHorse3 = this.add.sprite(1450, 830, "brownHorse03").setScale(0.7);
    brownHorse3.play("runBrown03");

    if (!this.anims.exists("runLady")) {
    this.anims.create({
      key: "runLady",
      frames: this.anims.generateFrameNumbers("ladyhorse", { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1
    });
  }
    const ladyHorse = this.add.sprite(1750, 830, "ladyhorse").setScale(0.7);
    ladyHorse.play("runLady");

     // ✅ NOW REPLACE BACKGROUND WITH HERD COVER:
    console.log('🖼️ Switching from solo to herd cover...');

    // Hide the background coverBlank
    //this.backgroundCover.setVisible(false);
    if (this.backgroundCover) {
  this.backgroundCover.setVisible(false);
  console.log('✅ Solo cover hidden');
} else {
  console.log('⚠️ backgroundCover not found');
}


    console.log('✅ herd cover displayed, solo background hidden');
    // ✅ Background cover already handled above
    console.log('✅ All background elements created successfully');
    
  }
}

window.SplashScene = SplashScene;