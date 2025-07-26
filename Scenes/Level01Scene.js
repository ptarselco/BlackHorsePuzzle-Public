class Level01Scene extends Phaser.Scene {
  constructor() {
    super('Level01Scene');
    this.isPaid = false; // Default, belum bayar
    this.currentFavMusic = null;
    this.favMusicTimeLeft = 0; // total detik favorit aktif
    this.favMusicTimer = null;
    this.hasClaimedHat = false; // untuk menyimpan status klaim topi
    this.hasWonOnce = false; // atau this.sudahMenang = false;
    this.backendUrl = 'https://backend-paypalblackhorsepuzzle.onrender.com'; 
    this.userCountry = 'ID'; // FIXED :Default

    // Inisialisasi properti favorit
    this.airBtn = null;
    this.grassBtn = null;
    this.carrotBtn = null;
    this.carrotLeaf = null;
    this.appleBtn = null;
    // Untuk menyimpan status favorit yang dibeli
    this.favoritItemBought = null;
    this.favoritItemBtnRef = null;
  }

  preload() {
   // Loader untuk text saat loading --> please wait (Co)
   document.getElementById('loader').style.display = 'flex';

 
    // Puzzle pieces
    for (let i = 1; i <= 10; i++) {
      const num = i.toString().padStart(2, '0');
      this.load.image(`hex${i}`, `./Puzzle-Assets/Level01/Lv.01 Hex-${num}.webp`);
    }
    // Board & UI
    this.load.image('boardLevel01', './Puzzle-Assets/Level01/Board Game Puzzle Level-01.webp');
    // Puzzle pieces (essential saja dulu)
    // Favorit
    this.load.image('water1', './Puzzle-Assets/UI/FW. Water1.webp');
    this.load.image('water2', './Puzzle-Assets/UI/FW. Water2.webp');
    this.load.image('water3', './Puzzle-Assets/UI/FW. Water3.webp');
    this.load.image('grass', './Puzzle-Assets/UI/FG. Grass04.webp');
    this.load.image('carrot', './Puzzle-Assets/UI/FC. Carrot.webp');
    this.load.image('apple1', './Puzzle-Assets/UI/FA. Appel1.webp');
    this.load.image('apple2', './Puzzle-Assets/UI/FA. Appel2.webp');
    this.load.image('apple3', './Puzzle-Assets/UI/FA. Appel3.webp');
    this.load.image('apple4', './Puzzle-Assets/UI/FA. Appel4.webp');
    this.load.image('musicNoteB', './Puzzle-Assets/UI/FN. Not Blue Cyan.webp');
    this.load.image('musicNoteG', './Puzzle-Assets/UI/FN. Not Green.webp');
    this.load.image('musicNoteR', './Puzzle-Assets/UI/FN. Not Red.webp');
    this.load.image('help_en_1', './Puzzle-Assets/Level01/Lv.01 Help - English (Page1).webp');
    this.load.image('help_en_2', './Puzzle-Assets/Level01/Lv.01 Help - English (Page2).webp');
    this.load.image('help_id_1', './Puzzle-Assets/Level01/Lv.01 Help - Indonesia (Page1).webp');
    this.load.image('help_id_2', './Puzzle-Assets/Level01/Lv.01 Help - Indonesia (Page2).webp');
    this.load.image('help_other_0', './Puzzle-Assets/Level01/Lv.01 Help - Other (Code).webp');  
    this.load.image('help_other_1', './Puzzle-Assets/Level01/Lv.01 Help - Other (Page1).webp');  
    this.load.image('help_other_2', './Puzzle-Assets/Level01/Lv.01 Help - Other (Page2).webp');    
    this.load.image('helpBtn', './Puzzle-Assets/UI/GM. Help.webp');
    this.load.image('back', './Puzzle-Assets/UI/GM. Back.webp');
    this.load.image('next', './Puzzle-Assets/UI/GM. Next.webp');
    this.load.image('playSheriff', './Puzzle-Assets/UI/GM. Play.webp');
    this.load.image('playSheriffL', './Puzzle-Assets/UI/GM. Play Light.webp');
    this.load.image('lv01Puzzle10', './Puzzle-Assets/UI/GM. L01-10 Puzzle.webp');
    this.load.image('lv01Puzzle20', './Puzzle-Assets/UI/GM. L01-20 Puzzle.webp');
    this.load.image('paypalQR', './Puzzle-Assets/UI/Menu Favorite -qrcode.png');
    //this.load.audio('gameoverSound', './Puzzle-Assets/Sfx/scenes/game-over-elements-impact.mp3'); // utk 20 Puzzle
    this.load.image('textGlow02', './Puzzle-Assets/UI/Sp. Text Level 02 Glow.webp');
    this.load.image('hexSlot01', './Puzzle-Assets/UI/GM. Slot Hexa01.webp');
    this.load.image('hexSlot02', './Puzzle-Assets/UI/GM. Slot Hexa02.webp');
    this.load.image('hexSlot03', './Puzzle-Assets/UI/GM. Slot Hexa03.webp');
    this.load.image('hexSlot04', './Puzzle-Assets/UI/GM. Slot Hexa04.webp');
    this.load.image('hexSlot05', './Puzzle-Assets/UI/GM. Slot Hexa05.webp');
    this.load.image('hexSlot06', './Puzzle-Assets/UI/GM. Slot Hexa06.webp');
    this.load.image('hexSlot07', './Puzzle-Assets/UI/GM. Slot Hexa07.webp');
    this.load.image('hexSlot08', './Puzzle-Assets/UI/GM. Slot Hexa08.webp');
    this.load.image('hexSlot09', './Puzzle-Assets/UI/GM. Slot Hexa09.webp');
    this.load.image('hexSlot010', './Puzzle-Assets/UI/GM. Slot Hexa10.webp');
  //  this.load.image('horse', './Puzzle-Assets/UI/GM. Black Horse Run Behind.webp');
    this.load.image('blankBhL1', './Puzzle-Assets/UI/Blank Black Horse Level01.webp');
    this.load.image('bhAngguk1', './Puzzle-Assets/UI/GM. BH Head Angguk1.webp');
    this.load.image('bhAngguk2', './Puzzle-Assets/UI/GM. BH Head Angguk2.webp');
    this.load.image('bhAngguk3', './Puzzle-Assets/UI/GM. BH Head Angguk3.webp');
    this.load.image('bhGeleng1', './Puzzle-Assets/UI/GM. BH Head Geleng1.webp');
    this.load.image('bhGeleng2', './Puzzle-Assets/UI/GM. BH Head Geleng2.webp');
    this.load.image('bhGeleng3', './Puzzle-Assets/UI/GM. BH Head Geleng3.webp');
    this.load.image('download', './Puzzle-Assets/UI/GM. Cowboy-brown-hat-win.png');
    this.load.image('claimHat', './Puzzle-Assets/UI/GM. Claim Hat.webp')
    this.load.image('claimHatC', './Puzzle-Assets/UI/GM. Claim Hat Coklat.webp');
    //this.load.image('gameOver', './Puzzle-Assets/UI/GM. Game Over.webp');
    // Audio and Sound
    this.load.image('soundOn', './Puzzle-Assets/UI/GM. Sound On.webp');
    this.load.image('soundOnL', './Puzzle-Assets/UI/GM. Sound On Light.webp');
    this.load.image('soundOff', './Puzzle-Assets/UI/GM. Sound Off.webp');
    this.load.image('soundOffL', './Puzzle-Assets/UI/GM. Sound Off Light.webp');
  //  this.load.audio('introMusic', './Puzzle-Assets/Sfx/scenes/level01-1-herdhorses-guitar-intro-ident.mp3');
  //  this.load.audio('mainMusic', './Puzzle-Assets/Sfx/scenes/level01-2 music-favorite-sunset-dreams.mp3');
  //  this.load.audio('winMusic', './Puzzle-Assets/Sfx/scenes/win-in-the-video-game.mp3');
  //  this.load.audio('horseNeigh', './Puzzle-Assets/Sfx/sound/horse-neigh.mp3');
  //  this.load.audio('horseSnort', './Puzzle-Assets/Sfx/sound/horse-snort.mp3');
  //  this.load.audio('horseHoof', './Puzzle-Assets/Sfx/sound/hoof-run.mp3');
  //  this.load.audio('horsehoofstep', './Puzzle-Assets/Sfx/sound/hoof-step.mp3');
  //  this.load.audio('horseGallop', './Puzzle-Assets/Sfx/sound/blackhorse-gallop.mp3');
  //  this.load.audio('herdGallop', './Puzzle-Assets/Sfx/sound/herd-gallop.mp3');
    
    // Sembunyikan loader please wait (dari Co)
  this.load.on('complete', () => {
    document.getElementById('loader').style.display = 'none';
      // Tampilkan loginBox jika user belum login
 if (!localStorage.getItem("playerEmail")) {
  document.getElementById("loginBox").style.display = "block";
   document.getElementById("logoutBtn").style.display = "none";
} else {
  document.getElementById("loginBox").style.display = "none";    document.getElementById("logoutBtn").style.display = "inline-block";
 }

});  
  }

  create() {
    console.log("Level01 create, login:", localStorage.getItem("playerEmail"));
    if (!localStorage.getItem("playerEmail")) {
    console.log("Belum login, kembali ke SplashScene"); 
    this.scene.start('SplashScene');
    return;
  }

  // Deklarasi variabel utama
  const email = localStorage.getItem("playerEmail");
  let userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {
    playCount: 0,
    isGameOver: false,
    score: 0
  };
  const history = window.getPlayerGameHistory ? window.getPlayerGameHistory(email) : null;
  const sudahMain3x = history && history.hasPlayedBefore && (history.totalGamesPlayed || 0) >= 3;
  const isUserBaru = !history || !history.hasPlayedBefore;
  const masihGratis = history && history.hasPlayedBefore && (history.totalGamesPlayed || 0) < 3;
  const gameOverState = localStorage.getItem(`gameOver_${email}`);

  

// PANGGIL 5 FUNGSI YANG ADA DI CLASS (BELUM SEMUA DI PANGGIL DI SINI)

 // ✅ SCORE CALCULATION FIRST (BEFORE Game Over check):
  let score = 0;
  if (email) {
    score = parseInt(localStorage.getItem(`score_${email}`)) || 0;
  } else {
    score = this.registry.get('score') || 0;
  }
  this.score = score;
  this.registry.set('score', this.score);

  
  // === GET USER PROGRESS ===
  this.getUserProgress(email).then(progress => {
  if (progress) {
    this.score = progress.score || 0;
    this.playCount = progress.playCount || 0;
    // === CEK UPDATE PROGRESS ===
    this.updateUserProgress(email, progress);
    // === CEK STATUS USER AND GAME OVER
    this.checkUserStatusAndGameOver(email);
    // === CEK GAME OVER STATUS DARI SERVER
    if (progress.isGameOver) {
      this.lockLevel(email, 'Level01');
    }
    this.checkGameOverStatusFromServer();
   }
});

  // === CEK SCORE === // cek ulang penulisan
  this.saveScore (this.score, email);

 
  // ✅ SESSION-BASED WELCOME BACK FLAG:
  // Only check once per browser session, not per scene load
  if (!this.registry.get('welcomeBackShown')) { 
    this.hasShownWelcomeBack = false; 
  } else { 
    this.hasShownWelcomeBack = true; 
 } 

  // ✅ ADD CONSOLE LOG HERE (after all Game Over logic):
  console.log(`🔍 Game state check:
- Email: ${email}
- Score: ${this.score}  
- Game Over State: ${gameOverState}
- isUserBaru: ${isUserBaru}
- Total Games Played: ${history?.totalGamesPlayed}
- Final isGameOver: ${this.isGameOver}`);
   
  
 //-------------------------------------------------------------
    // Background & board
    // Background load musik favorit setelah 3 detik
    this.time.delayedCall(3000, () => {
      console.log('🎵 Background loading favorite music...');
      this.backgroundLoadFavoriteMusic();
    });
 //-------------------------------------------------------------   
    // Musik favorit
    for (let i = 1; i <= 5; i++) {
    //this.load.audio(`musicFav${i}`, `./Puzzle-Assets/Sfx/music favorites/music-favorite-${i}.mp3`);
      this.load.audio('musicfav03', './Puzzle-Assets/Sfx/music favorites/music-favorite-easy-country-music-intro-outro.mp3');
      this.load.audio('musicfav04', './Puzzle-Assets/Sfx/music favorites/music-favorite-golden-sunset-piano.mp3');
      this.load.audio('musicfav05', './Puzzle-Assets/Sfx/music favorites/music-favorite-horsepower.mp3');
      this.load.audio('musicfav06', './Puzzle-Assets/Sfx/music favorites/music-favorite-musique-west-cowboy.mp3');
      this.load.audio('musicfav07', './Puzzle-Assets/Sfx/music favorites/music-favorite-old-west.mp3');
    //}
      this.load.once('complete', () => {
      console.log('✅ Favorite music loaded in background!');
      this.favoriteAssetsReady = true;
    });

    this.load.start();
    }
    //Posisi background dan board
    this.add.image(960, 640, "boardLevel01").setDepth(0);
    this.sound.stopAll();
    this.add.rectangle(0, 0, 1960, 1280, 0x181c24).setOrigin(0).setAlpha(0.01);

    // UI & horse
    //this.add.image(250, 250, 'horse').setScale(0.6);
    this.timerText = this.add.text(563, 40, "00:00", { font: "50px Segoe UI", fill: "#fff" });
    //this.add.image(9640, 400, 'gameOver').setOrigin(0.5).setDepth(200).setScale(1);
    // Menghitung mundur waktu yang dibeli
    //this.add.image(620,105, 'countdown').setOrigin(0.5).setDepth(200).setScale(0.4);
    this.countdownText = this.add.text(510, 110, "", {
      font: "bold 28px Segoe UI",
      fill: "#00eaff"
    }).setDepth(9999).setVisible(false); // text countdown


    // Variabel untuk menghitung salah berturut-turut
    this.salahBerturut = 0;


    // Tambahkan property di create():
    this.bhHead = this.add.image(248, 250, 'bhGeleng2').setScale(0.5).setDepth(10);
    this.bhAngguk2 = this.add.image(248, 250, 'bhAngguk2').setScale(0.5).setDepth(10);
    this.blankBhL1 = this.add.image(248, 250, 'blankBhL1').setScale(0.7).setDepth(9);

    this.scoreText = this.add.text(1716, 40, "00000", { font: "50px Segoe UI", fill: "#fff" }).setDepth(9999);
    this.scoreText.setText(this.score.toString().padStart(5, '0')); // Tambahkan baris ini
    //this.scoreText.setText("00000"); 

    //Atur Ronde untuk Game Over (ATUR WAKTU DI TIMER)
    this.round = 1; // Mulai dari ronde 1
    this.roundTimeLimits = [19, 11, 9]; // Detik untuk ronde 1=19, 2=11, 3=9 detik  

  //-----------------------------MULAI 10 PUZZLE-------------------------------------  
    // Tombol-tombol UI
    this.add.image(1410, 1100, 'lv01Puzzle20').setScale(0.3).setInteractive().setDepth(999);
   
    // Deklarasi lv01Puzzle10Btn 10 puzzle  
    // filepath: [Level01Scene.js](http://_vscodecontentref_/0)    
    const lv01Puzzle10Btn = this.add.image(1270, 1100, 'lv01Puzzle10').setScale(0.3).setInteractive().setDepth(999);
    // Event handler untuk lv01Puzzle10Btn - Play 10 Puzzle
    
     lv01Puzzle10Btn.on('pointerdown', () => {
  // ✅ ENHANCED GAME OVER PROTECTION WITH SPECIFIC MESSAGE:
    if (this.isGameOver && (this.score || 0) <= 0) { 
    // Show specific Game Over message for 10 puzzle button
    this.showGameOverPuzzleMessage();
    return;
  }

   // ✅ SPECIAL CHECK: If Game Over was closed but not cleared (score = 0)
  if (this.isGameOverClosed && (this.score || 0) <= 0) {
    this.showGameOverPuzzleMessage();
    return;
  }
  
  // ✅ If player has score > 0, allow playing even after Game Over
  if ((this.score || 0) > 0) {
    console.log(`✅ Player has score ${this.score} - allowing 10 puzzle access`);
  }

  // Toggle pesan: jika sudah ada, hilangkan; jika belum, tampilkan
  if (this.welcomeMsgRect && this.welcomeMsgRect.visible) {
    this.welcomeMsgRect.destroy();
    this.welcomeMsgText.destroy();
    this.welcomeMsgRect = null;
    this.welcomeMsgText = null;
    if (this.welcomeMsgTimer) this.welcomeMsgTimer.remove();
    return;
  }
  
      
      // Efek sinar (glow/scale)
      this.tweens.add({
        targets: lv01Puzzle10Btn,
        scale: 0.35,
        duration: 200,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut'
      });

      // Rectangle pesan
     this.welcomeMsgRect = this.add.rectangle(960, 350, 1200, 500, 0x023d3f, 0.95)
    .setStrokeStyle(4, 0x00eaff)
    .setDepth(2001).setInteractive()
    .on('pointerdown', () => {
      if (this.welcomeMsgRect) this.welcomeMsgRect.destroy();
      if (this.welcomeMsgText) this.welcomeMsgText.destroy();
      this.welcomeMsgRect = null;
      this.welcomeMsgText = null;
      if (this.welcomeMsgTimer) this.welcomeMsgTimer.remove();
    });
  

    // Pesan bilingual
    const pesanEN = "Welcome, Conquerors!\nUse 5 seconds to observe the Puzzle and arrange Black Horse's face.\n3 consecutive mistakes will trigger a reaction Black Horse. Read Help before Click Play!";
    const pesanID = "Selamat datang para Penakluk!\nGunakan 5 detik untuk memperhatikan Puzzle dan susun wajah Black Horse.\n3 kesalahan berturut-turut akan memicu reaksi Black Horse. Baca Bantuan sebelum Klik Play!";
    
    this.welcomeMsgText = this.add.text(960, 350,
    pesanEN + "\n\n" + pesanID,
    {
      font: "bold 38px Imprint MT Shadow, serif",
      fill: "#fff",
      align: "center",
      wordWrap: { width: 1000 }
    }
  ).setOrigin(0.5).setDepth(2002);
  // Auto-hide setelah 3 detik
  this.welcomeMsgTimer = this.time.delayedCall(3000, () => {
    if (this.welcomeMsgRect) this.welcomeMsgRect.destroy();
    if (this.welcomeMsgText) this.welcomeMsgText.destroy();
    this.welcomeMsgRect = null;
    this.welcomeMsgText = null;
  });


      // Mulai game 10 puzzle
      // Misal: reset ronde, score, timer, dan tampilkan puzzle
      this.round = 1;
     // this.score = 0;
      this.scoreText.setText(this.score.toString().padStart(5, '0'));

      // Tambahkan pengecekan login sebelum mengaktifkan tombol Play saat logout
      if (localStorage.getItem("playerEmail")) {
      // Panggil fungsi mulai game, misal:
      if (this.isPaid || isUserBaru || masihGratis) {
      if (this.playBtn) {
        this.playBtn.setTexture('playSheriffL');
        this.playBtn.setInteractive({ useHandCursor: true });
        this.playBtn.setAlpha(1);
        this.playBtn.setVisible(true);
      }
    } else {
  // Belum bayar dan bukan user baru/masih gratis: Play tetap burem
  if (this.playBtn) {
    this.playBtn.disableInteractive();
    this.playBtn.setAlpha(0.5);
    this.playBtn.setVisible(true);
  }
  // (Opsional) Tampilkan pesan game lock
 // this.showGameOverReturnMessage && this.showGameOverReturnMessage();
 }
}
});
//-----------------------------BATAS 10 PUZZLE-------------------------------------
   
// DEKLARASI TOMBOL 20 PUZZLE (COMING SOON) 
    // filepath: [Level02Scene.js]
    const lv01Puzzle20Btn = this.add.image(1410, 1100, 'lv01Puzzle20').setScale(0.3).setInteractive().setDepth(999);
    lv01Puzzle20Btn.on('pointerdown', () => {
     // ✅ ADD GAME OVER PROTECTION:
    if (this.isGameOver) {
    // Show specific Game Over message
    this.showGameOverPuzzleMessage();
    return;
  } 

     // Jika pesan sudah ada, klik akan menghilangkan
  if (this.comingSoonText && this.comingSoonText.visible) {
    this.comingSoonText.destroy();
    this.comingSoonRect.destroy();
    this.comingSoonText = null;
    this.comingSoonRect = null;
    if (this.comingSoonTimer) this.comingSoonTimer.remove();
    return;
  } 
      
    // Rectangle background
  this.comingSoonRect = this.add.rectangle(1160, 600, 700, 150, 0x023d3f, 0.95)
    .setStrokeStyle(4, 0x00eaff)
    .setDepth(2000)
    .setInteractive()
    .on('pointerdown', () => {
      if (this.comingSoonText) this.comingSoonText.destroy();
      if (this.comingSoonRect) this.comingSoonRect.destroy();
      this.comingSoonText = null;
      this.comingSoonRect = null;
      if (this.comingSoonTimer) this.comingSoonTimer.remove();
    });

  // Pesan Coming Soon
  this.comingSoonText = this.add.text(1160, 600, "20 Puzzle - Coming Soon!", {
    font: "bold 60px Segoe UI",
    fill: "#00eaff",
    align: "center"
  }).setOrigin(0.5).setDepth(2001);

  // Auto-hide setelah 2 detik
  this.comingSoonTimer = this.time.delayedCall(2000, () => {
    if (this.comingSoonText) this.comingSoonText.destroy();
    if (this.comingSoonRect) this.comingSoonRect.destroy();
    this.comingSoonText = null;
    this.comingSoonRect = null;
  });
});

 // Di dalam create()
//--------------------------------------------------------------------------------------
    // Deklarasi Title dan Menu Text--> Mulai Help
    let helpTitle, menuText;

    this.helpBtn = this.add.image(240, 1010, 'helpBtn').setScale(0.9).setInteractive({ useHandCursor: true }); 
   
    this.helpBtn.on('pointerdown', () => {
      // Hapus help panel lama jika ada
      if (this.helpPanelGroup) {
        this.helpPanelGroup.clear(true, true);
        this.helpPanelGroup = null;
        helpTitle = null;
        menuText = null;
        }

        this.helpPanelGroup = this.add.group();   

      // Array gambar help
     const helpImages = {
     en: ['help_en_1', 'help_en_2'],
     id: ['help_id_1', 'help_id_2'],
     other: ['help_other_0', 'help_other_1', 'help_other_2']
     };
   
     // --- FUNGSI PILIH KEY GAMBAR ---
     function getHelpImageKey(lang) {
     if (lang === 'en' || lang === 'id') return lang;
     return 'other';
     }

    // --- VARIABEL BAHASA & PAGE ---
    let currentLang = window.currentLang || 'en';
    let currentPage = 0;
    // let helpImg, helpTitle, menuText, infoText;


    // Tampilkan help pertama
    let helpImg; 
    let key = (currentLang === 'en' || currentLang === 'id') ? currentLang : 'other';
    this.helpImg = this.add.image(960, 640, helpImages[key][currentPage]).setDepth(3001);
    this.helpPanelGroup.add(this.helpImg);
    

      // Tombol EN
      let enBtn = this.add.text(890, 47, "EN", {
        font: "bold 55px Segoe UI", fill: "#00eaff", //backgroundColor: "#fff"
      }).setInteractive({ useHandCursor: true }).setDepth(3002);
      this.helpPanelGroup.add(enBtn);

      // Tombol ID
      let idBtn = this.add.text(1050, 47, "ID", {
        font: "bold 55px Segoe UI", fill: "#00eaff", //backgroundColor: "#fff"
      }).setInteractive({ useHandCursor: true }).setDepth(3002);
      this.helpPanelGroup.add(idBtn);

      // Tombol OTHER
      let otherBtn = this.add.text(1210, 47, "OTHER", {
        font: "bold 55px Segoe UI", fill: "#00eaff", //backgroundColor: "#fff"
      }).setInteractive({ useHandCursor: true }).setDepth(3002);
      this.helpPanelGroup.add(otherBtn);
    
       // 1. Tambahkan gambar template ---> menampilkan gambar help other page1 dan page2
       helpImg = this.add.image(960, 640, helpImages[getHelpImageKey(currentLang)][currentPage]).setDepth(3001);
       this.helpPanelGroup.add(helpImg);

        // --- TAMPILKAN TEKS JIKA OTHER ---
        //Jika OTHER, tambahkan teks di atas gambar
        if (getHelpImageKey(currentLang) === 'other') {
        let t1 = window.helpText1[currentLang] || window.helpText1['other'];
        let t2 = window.helpText2[currentLang] || window.helpText2['other'];
        // Pilih data sesuai halaman aktif
         let title = currentPage === 0 ? t1.title : t2.title;
         let menu = currentPage === 0 ? t1.menu : t2.menu;
       }

      
       // Buat rectangle di samping template
       let rect = this.add.rectangle(1707, 503, 450, 1600, 0x023d3f, 0.7)
       //.setStrokeStyle(4, 0x00eaff)
       .setDepth(3002);
       this.helpPanelGroup.add(rect);

        // --- TOMBOL PILIHAN BAHASA LAIN (muncul jika klik OTHER) ---
        this. otherLangBtns = [];
        const supportedLangs = ['zh', 'ja', 'ko', 'hi', 'ur', 'ar', 'es', 'pt', 'fr', 'de', 'ru', 'it', 'tr'];

        const languageMap = {
        zh: 'CHINA',
        ja: 'JAPAN',
        ko: 'KOREA',
        hi: 'INDIA',
        ur: 'PAKISTAN',
        ar: 'ARAB',
        es: 'SPAIN',
        pt: 'PORTUGAL',
        fr: 'FRANCE',
        de: 'GERMANY',
        ru: 'RUSSIA',
        it: 'ITALY',
        tr: 'TURKEY'
        };

       // --- STATUS AKTIF ---
       //let currentLang = null; // null = belum pilih negara
       let isOtherMode = false;
       

        //function showOtherLangs() {
        const showOtherLangs = () => {
         // Hapus tombol bahasa lain jika sudah ada
        if (this.helpTitle) { this.helpTitle.destroy(); this.helpTitle = null; }
        if (this.menuText) { this.menuText.destroy(); this.menuText = null; }
        if (this.helpImg) { this.helpImg.destroy(); this.helpImg = null; }
        this.otherLangBtns.forEach(btn => btn.destroy());
        this.otherLangBtns = [];
        // Tampilkan tombol bahasa lain
        supportedLangs.forEach((lang, idx) => {
        let negara = languageMap[lang];
        let kode = lang.toUpperCase();
        let negaraText = this.add.text(1620, 300 + idx * 65, negara, {
        font: "bold 48px Segoe UI", fill: "#00eaff", align: "left"
        }).setDepth(3003);

        let kodeText = this.add.text(1510, 300 + idx * 65, kode, {
        font: "bold 48px Segoe UI", fill: "#00eaff", align: "right"
        }).setDepth(3003);
      
        // Simpan text bahasa yang terakhir ditampilkan
        //this.lastBahasaText = null;

       

        //Event tombol inisial bahasa lain (ZH, JA, KO, dst)
        [negaraText, kodeText].forEach(btn => { // ini untuk klik Negara   
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
        currentLang = lang;
        isOtherMode = true;
        currentPage = 0; // reset ke page 1
        console.log('Isi tombol sebelum destroy:', this.otherLangBtns);
        this.otherLangBtns.forEach(b => b.destroy());
        this.otherLangBtns = [];
        updateHelpPanel();
        });
     
      
       // Saat klik OTHER:
       otherBtn.on('pointerdown', () => { // ini untuk Title dan Menu
            // Hapus text bahasa sebelumnya jika ada
        if (this.helpPanelGroup) {
        this.helpPanelGroup.clear(true, true);
        this.helpPanelGroup = null;
      }
        
        if (this.helpTitle) { this.helpTitle.destroy(); this.helpTitle = null; }
        if (this.menuText) { this.menuText.destroy(); this.menuText = null; }
        if (this.helpImg) { this.helpImg.destroy(); this.helpImg = null; }
        this.otherLangBtns.forEach(btn => btn.destroy());
        this.otherLangBtns = [];

        if (this.helpTitle) {
        this.helpTitle.destroy();
        this.helpTitle = null;
        }
        if (this.menuText) {
        this.menuText.destroy();
        this.menuText = null;
        }
        if (this.helpImg) {
        this.helpImg.destroy();
        this.helpImg = null;
        }
        this.otherLangBtns.forEach(btn => btn.destroy());
        this.otherLangBtns = [];
      
        currentLang = 'other';
        currentPage = 1; // <-- WAJIB! Selalu kembali ke page 0 (negara/kode)
        updateHelpPanel(); 
       });
       this.helpPanelGroup.add(btn);
       this.otherLangBtns.push(btn);
       });
        });
      // });
       return;
        }
//------------------------------------------------------------------------------      
        // --- FUNGSI UPDATE HELP PANEL ---
       const updateHelpPanel = () => {
       // Ganti gambar help sesuai bahasa dan halaman
       helpImg.setTexture(helpImages[getHelpImageKey(currentLang)][currentPage]);
       // Jika OTHER, update teks
       if (getHelpImageKey(currentLang) === 'other') {
      //  if (getHelpImageKey(currentLang) === 'other' && currentPage === 0) {
       let t1 = window.helpText1[currentLang] || window.helpText1['other'];
       let t2 = window.helpText2[currentLang] || window.helpText2['other'];
       // Pilih data sesuai halaman aktif
       let title = currentPage === 0 ? t1.title : t2.title;
       let menu = currentPage === 0 ? t1.menu : t2.menu;    
       
    
       // Update atau buat objek text
       if (!helpTitle) {
        helpTitle = this.add.text(500, 80, title, {
          font: "bold 50px Segoe UI", // atur ukuran font di sini
          fill: "#fff",
          align: "left",
          wordWrap: { width: 900 }
        }).setOrigin(0.0).setDepth(3020);
        this.helpPanelGroup.add(helpTitle);
        } else {
        console.log('currentPage:', currentPage, 'title:', title, 'menu:', menu);
        helpTitle.setText(title);
        }

        if (!menuText) {
        //let menu = "Ini baris pertama.\nIni baris kedua.\nIni baris ketiga.";
        menuText = this.add.text(500, 300, menu, {
          font: "30px Segoe UI", 
          fill: "#fff", 
          align: "left",
          wordWrap: { width: 900 }
        }).setOrigin(0.0).setDepth(3020);
        this.helpPanelGroup.add(menuText);
        } else {
        menuText.setText(menu);
        }
        } else {
        // Jika bukan OTHER, sembunyikan teks
        if (helpTitle) helpTitle.setText('');
        if (menuText) menuText.setText('');
       }
       // Atur font Jepang
       let fontFamily = currentLang === 'ja' ? "Noto Sans JP, Arial, sans-serif" : "Segoe UI, Arial, sans-serif";
       let fontSize = currentLang === 'ja' ? "40px" : "30px";

       menuText = this.add.text(80, 180, menu, {
       font: `${fontSize} ${fontFamily}`,
       fill: "#00eaff",
       align: "left",
       wordWrap: { width: 800 }
       }).setOrigin(0, 0);
       };
 
    // Tombol Prev
    let prevBtn = this.add.text(600, 1219, "Prev", {
    font: "bold 52px Segoe UI", fill: "#00eaff", //mirip cyan tapi lebih gelap kalau kuning #ffff00
    stroke: "#fff",  // outline putih
    strokeThickness: 8, // tebal outline
    shadow: {
    offsetX: 0,
    offsetY: 0,
    color: "#fff",
    blur: 10,
    fill: true
  }
  }).setInteractive({ useHandCursor: true }).setDepth(3002);
  this.helpPanelGroup.add(prevBtn);

  // Tombol Next
  let nextBtn = this.add.text(1220, 1219, "Next", {
    font: "bold 52px Segoe UI", fill: "#00eaff",
    stroke: "#fff",  // outline putih
    strokeThickness: 8, // tebal outline
    shadow: {
    offsetX: 0,
    offsetY: 0,
    color: "#fff",
    blur: 10,
    fill: true
  }
  }).setInteractive({ useHandCursor: true }).setDepth(3002);
  this.helpPanelGroup.add(nextBtn);

  // Fungsi update gambar help
  function updateHelpImage() {
    helpImg.setTexture(helpImages[currentLang][currentPage]);
  }

  // Event tombol EN
  enBtn.on('pointerdown', () => {
    currentLang = 'en';
    currentPage = 0;
    updateHelpPanel();
  });

  // Event tombol ID
  idBtn.on('pointerdown', () => {
    currentLang = 'id';
    currentPage = 0;
    updateHelpPanel();
  });

   // Event tombol OTHER --> ini untuk Tombol OTHER
   otherBtn.on('pointerdown', () => { 
    currentLang = 'other';
    currentPage = 0; // reset ke page 1
    showOtherLangs.call(this);
    updateHelpPanel();
  });

  // Event tombol Prev
  prevBtn.on('pointerdown', () => {
    if (currentPage > 0) {
      currentPage--;
      updateHelpPanel();
    }
  });

  // Event tombol Next
  nextBtn.on('pointerdown', () => {
   // if (currentPage < helpImages[currentLang].length - 1) {
      const key = getHelpImageKey(currentLang); // 'en', 'id', atau 'other'
      if (currentPage < helpImages[key].length - 1) {
      currentPage++;
      updateHelpPanel();
    }
  });

//-------------------------------------------------------------------------------------------
      // Tombol close
      let closeBtn = this.add.text(1444, 18, "X", {
        font: "bold 56px Segoe UI", fill: "#fff", backgroundColor: "#e00"
      }).setInteractive({ useHandCursor: true }).setDepth(3002);
      this.helpPanelGroup.add(closeBtn);

      closeBtn.on('pointerdown', () => {
        this.helpPanelGroup.clear(true, true);
        this.helpPanelGroup = null;
        if (helpTitle) { helpTitle.destroy(); helpTitle = null; }
        if (menuText) { menuText.destroy(); menuText = null; }
      });
    });
    // Batas akhir help
    //---------------------------------------------------------------------------------------------------------
    // Aktifkan tombol BACK
    const backBtn = this.add.image(100, 1010, 'back').setScale(0.9).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
     // ✅ ADD GAME OVER PROTECTION:
  if (this.isGameOver) {
    this.showHoldMessageAboveNotes(); // Show "Please buy favorite menu" message
    return; // Block BACK button if game over
  } 

  // ✅ RESET WELCOME BACK FLAG before scene transition:
  //this.resetWelcomeBackFlag();

      this.scene.start('SplashScene');
    });

    // Aktifkan tombol NEXT
    const nextBtn = this.add.image(380, 1010, 'next').setScale(0.9).setInteractive({ useHandCursor: true });
    nextBtn.on('pointerdown', () => {
     // ✅ ADD GAME OVER PROTECTION:
  if (this.isGameOver) {
    this.showHoldMessageAboveNotes(); // Show "Please buy favorite menu" message
    return; // Block NEXT button if game over
  } 

  // ✅ RESET WELCOME BACK FLAG before scene transition:
  //this.resetWelcomeBackFlag();

      this.scene.start('Level02Scene');
    });


    // Inisialisasi tombol sound di create() ganti dengan ada variable soundOnBtn, soundOnLightBtn, soundOffBtn, soundOffLightBtn
    this.soundOnBtn = this.add.image(1550, 1102, 'soundOn').setScale(0.7).setInteractive().setDepth(999);
    this.soundOnLightBtn = this.add.image(1550, 1102, 'soundOnL').setScale(0.7).setInteractive().setDepth(1000).setVisible(false);
    this.soundOffBtn = this.add.image(1670, 1115, 'soundOff').setScale(0.7).setInteractive().setDepth(999);
    this.soundOffLightBtn = this.add.image(1671, 1106, 'soundOffL').setScale(0.7).setInteractive().setDepth(1000).setVisible(false);


    // === CLAIM HAT BAWAH ===
    // Inisialisasi tombol claimHat bawah
    this.hasClaimedHat = this.registry.get('hasClaimedHat') || false;
    this.claimHatBottomBtn = this.add.image(1820, 1113, this.hasClaimedHat ? 'claimHatC' : 'claimHat')
      .setScale(this.hasClaimedHat ? 0.3 : 0.7) // <-- scale biru dan coklat bisa beda
      .setInteractive({ useHandCursor: true })
      .setDepth(1000);

    this.claimHatBottomBtn.on('pointerdown', () => {
      //if (!this.hasClaimedHat && (this.score || 0) >= 100) { // yang ini sekali download
      if ((this.score || 0) >= 100) {
        // Selalu download topi coklat
        this.hasClaimedHat = true;
        this.registry.set('hasClaimedHat', true);
        this.claimHatBottomBtn.setTexture('claimHatC').setScale(0.3); // <-- scale khusus untuk coklat

        // Langsung download topi
        const link = document.createElement("a");
        link.href = "./Puzzle-Assets/UI/GM. Cowboy-brown-hat-win.png";
        link.download = "GM. Cowboy-brown-hat-win.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Pesan sukses
        if (this.claimHatMsg) this.claimHatMsg.destroy();
        this.claimHatMsg = this.add.text(1820, 1060, "Hat claimed!", {
          font: "bold 24px Segoe UI",
          fill: "#00eaff",
          backgroundColor: "#fff",
          padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setDepth(2100);
        this.time.delayedCall(1500, () => {
          if (this.claimHatMsg) this.claimHatMsg.destroy();
        });
      } else if ((this.score || 0) < 100) {
        // Pesan gagal
        if (this.claimHatMsg) this.claimHatMsg.destroy();
        this.claimHatMsg = this.add.text(1750, 1000, "Score must be at least 100!", {
          font: "bold 24px Segoe UI",
          fill: "#fff",
          backgroundColor: "#e00",
          padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setDepth(2100);
        this.time.delayedCall(1500, () => {
          if (this.claimHatMsg) this.claimHatMsg.destroy();
        });
      }
    });
//-----------------------------------------------------------------------------------------
// Donation Area
// Around line 730, after claim hat button creation:

    // Around line 735, after claim hat button:

// === DONATION BUTTON (DENGAN CAHAYA CYAN PINGGIR) ===
this.donationBtn = this.add.text(1550, 1220, "💝 SUPPORT LV02", {
  font: "bold 40px Segoe UI",
  fill: "#ffd700", // Gold text
  backgroundColor: "#046064", // Dark teal background
  padding: { left: 18, right: 18, top: 6, bottom: 6 }
})
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .setDepth(1000);

// ✅ HOVER EFFECTS (Cahaya cyan di pinggir)
this.donationBtn.on('pointerover', () => {
  this.donationBtn.setStroke("#00eaff", 4); // Cyan outline thick
  this.donationBtn.setShadow(0, 0, "#00eaff", 15, true, true); // Cyan glow
  this.donationBtn.setScale(1.08);
  this.donationBtn.setFill("#ffffff"); // White text
  this.donationBtn.setBackgroundColor("#B8860B"); // Darker gold background
});

this.donationBtn.on('pointerout', () => {
  this.donationBtn.setStroke("", 0); // Remove outline
  this.donationBtn.setShadow(0, 0, "", 0, false, false); // Remove glow
  this.donationBtn.setScale(1);
  this.donationBtn.setFill("#ffd700"); // Back to gold
  this.donationBtn.setBackgroundColor("#046064"); // Back to dark teal
});

// ✅ CLICK EFFECTS (Maju ke depan + cahaya spiral)
this.donationBtn.on('pointerdown', () => { // ini 1 
 // ✅ ADD GAME OVER PROTECTION:
  if (this.isGameOver) {
    this.showHoldMessageAboveNotes(); // Show "Please buy favorite menu" message
    return; // Block donation button if game over
  } 
  // 1. Button press animation (maju ke depan seperti play button)
  this.tweens.add({
    targets: this.donationBtn,
    y: this.donationBtn.y + 8, // Press down deeper
    scale: 0.94, // Smaller press effect
    duration: 150,
    ease: 'Sine.easeInOut',
    yoyo: true,
    onComplete: () => {
      // 2. Create cyan light border effect
      this.createDonationBorderEffect();    
      // 3. Redirect to Level02 with donation flag
      this.time.delayedCall(1000, () => {
        this.scene.start('Level02Scene', { showDonation: true });
      });
    }
  });
});


//Batas Donasi
//-----------------------------------------------------------------------------------------
  
    // Mengunci tombol play dari klik 10 puzzle
    this.isGameOver = false;

    // Favorit (dummy, bisa diatur ulang)
    this.add.image(999, 1100, 'apple1').setScale(0.7);
    this.add.image(999, 1100, 'apple2').setScale(0.7);
    this.add.image(999, 1100, 'apple3').setScale(0.7);
    this.add.image(999, 1100, 'apple4').setScale(0.7);

    this.airBtn = this.add.image(579, 1102, 'water3').setScale(0.35).setInteractive({ useHandCursor: true });
    this.appleBtn = this.add.image(999, 1100, 'apple1').setScale(0.7).setInteractive({ useHandCursor: true });

    // AIR: animasi frame menetes
    let airFrames = ['water1', 'water2', 'water3'];
    let airIdx = 0, airTween = null;
    this.airBtn.on('pointerover', () => {
      airTween = this.time.addEvent({
        delay: 200, loop: true, callback: () => {
          airIdx = (airIdx + 1) % airFrames.length;
          this.airBtn.setTexture(airFrames[airIdx]);
        }
      });
    });
    this.airBtn.on('pointerout', () => {
      if (airTween) { airTween.remove(); airTween = null; }
      this.airBtn.setTexture('water3');
    });
    // === Pembayaran Air (letakkan di bawah animasi) ===
    this.airBtn.on('pointerdown', () => {
       if (this.timerText.text !== "00:00") { 
    this.showHoldMessageAboveNotes(); // Please Hold ... the Game is Running
    return;
  }
      
      // Hapus Game Over saat klik menu favorit 13/06/25
      if (this.gameOverImg) {
        this.gameOverImg.destroy();
        this.gameOverImg = null;
      }
      this.showFavoritPayPanel('Water', 31, 1, this.airBtn);
    });

    // RUMPUT: goyang
    // --- RUMPUT MENU FAVORIT: Goyang seperti di SplashScene ---
    this.grassContainer = this.add.container(713, 1200);
    const grassImg = this.add.image(0, 0, 'grass').setScale(0.17).setOrigin(0.5, 1)
      .setInteractive({ useHandCursor: true }); // <-- ini yang penting!
    this.grassContainer.add(grassImg);
    this.grassContainer.setSize(grassImg.displayWidth, grassImg.displayHeight);
    this.grassContainer.setDepth(3001); 

    let grassTween = null;
    grassImg.on('pointerover', () => {
      //this.grassContainer.on('pointerover', () => {
      grassTween = this.tweens.add({
        targets: this.grassContainer,
        angle: { from: -7, to: 7 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    grassImg.on('pointerout', () => {
      if (grassTween) { grassTween.stop(); grassTween = null; }
      this.grassContainer.angle = 0;
    });
    // === Pembayaran Rumput (letakkan di bawah animasi) ===
    grassImg.on('pointerdown', () => {
    if (this.timerText.text !== "00:00") { 
    this.showHoldMessageAboveNotes(); // Please Hold ... the Game is Running
    return;
  }  

      if (this.gameOverImg) { //13/06/25
        this.gameOverImg.destroy();
        this.gameOverImg = null;
      }
      this.showFavoritPayPanel('Grass', 31, 1, this.grassContainer);
    });

    // WORTEL: pakai gambar utuh saja
    this.carrotBtn = this.add.image(863, 1085, 'carrot').setScale(0.3).setInteractive({ useHandCursor: true });

    let carrotTween = null;
    this.carrotBtn.on('pointerover', () => {
      carrotTween = this.tweens.add({
        targets: this.carrotBtn,
        angle: { from: -20, to: 20 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    this.carrotBtn.on('pointerout', () => {
      if (carrotTween) { carrotTween.stop(); carrotTween = null; }
      this.carrotBtn.angle = 0;
    });
    // === Pembayaran Wortel (letakkan di bawah animasi) ===
    this.carrotBtn.on('pointerdown', () => {
        if (this.timerText.text !== "00:00") { 
    this.showHoldMessageAboveNotes(); // Please Hold ... the Game is Running
    return;
  }

      if (this.gameOverImg) { // 13/06/25
        this.gameOverImg.destroy();
        this.gameOverImg = null;
      }
      this.showFavoritPayPanel('Carrot', 61, 2, this.carrotBtn);
    });

    // APPEL: ganti warna (frame)
    const appleKeys = ['apple1', 'apple2', 'apple3', 'apple4'];
    let appleIdx = 0, appleTween = null;
    this.appleBtn.on('pointerover', () => {
      appleTween = this.time.addEvent({
        delay: 180, loop: true, callback: () => {
          appleIdx = (appleIdx + 1) % appleKeys.length;
          this.appleBtn.setTexture(appleKeys[appleIdx]);
        }
      });
    });
    this.appleBtn.on('pointerout', () => {
      if (appleTween) { appleTween.remove(); appleTween = null; }
      this.appleBtn.setTexture('apple1');
    });

    // === Pembayaran Apel (letakkan di bawah animasi) ===
    this.appleBtn.on('pointerdown', () => { //13/06/25
     if (this.timerText.text !== "00:00") { 
    this.showHoldMessageAboveNotes(); // Please Hold ... the Game is Running
    return;
  } 
      if (this.gameOverImg) {
        this.gameOverImg.destroy();
        this.gameOverImg = null;
      }
      this.showFavoritPayPanel('Appel', 61, 2, this.appleBtn);
    });

    this.musicNotes = [
      this.add.image(1100, 1100, 'musicNoteB').setScale(0.4).setDepth(2799).setInteractive({ useHandCursor: true }),
      this.add.image(1130, 1100, 'musicNoteG').setScale(0.4).setDepth(2799).setInteractive({ useHandCursor: true }),
      this.add.image(1160, 1100, 'musicNoteR').setScale(0.4).setDepth(2799).setInteractive({ useHandCursor: true }),
    ];
  
    this.musicNotes.forEach(note => {
      // Animasi menari saat hover
      note.on('pointerover', () => {
        // Tween: not musik naik-turun (menari)
        note.tween = this.tweens.add({
          targets: note,
          y: note.y - 20,
          duration: 180,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        // (Opsional) bisa tambahkan efek scale juga
        note.tweenScale = this.tweens.add({
          targets: note,
          scale: 0.5,
          duration: 180,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });

      // Hentikan animasi saat cursor keluar
      note.on('pointerout', () => {
        if (note.tween) {
          note.tween.stop();
          note.tween = null;
        }
        // Kembalikan posisi dan scale ke semula
        note.y = 1100;
        note.setScale(0.4);
      });

      // Handler klik tetap seperti biasa
      note.on('pointerdown', () => {
        // perintah menghentikan klik not music saat game berlangsung
       //if (this.timeElapsed > 0) {// Panggil pesan custom di sini, bukan di create()
      if (this.timerText.text !== "00:00") { 
      this.showHoldMessageAboveNotes();
      return;
      } 
        if (this.gameOverImg) {
          this.gameOverImg.destroy();
          this.gameOverImg = null;
        }
        this.showMusicPanel();
      });
    });


    // === Tombol Play dengan animasi spiral ===
    this.createSheriffPlayButton();
    // Setelah tombol Play dibuat, langsung buremkan & nonaktifkan
    if (this.playBtn) {
    this.playBtn.setAlpha(0.5);
    this.playBtn.disableInteractive();
    this.playBtn.setVisible(true);  
    }

   

    // === Panel help, musik, dsb ===
    this.createHelpPanel();

    // === Posisi grid board kiri ===
    // Urutan index:   0 1 2
    //                 3 4 5
    //                 6 7 9
    //                   8
    this.puzzlePositions = [
      { x: 590, y: 358 }, // 1 Rambut 
      { x: 799, y: 355 }, // 2 Kuping kiri
      { x: 1006, y: 356 },// 3 Kuping kanan
      { x: 1110, y: 534 }, //4 Hidung
      { x: 903, y: 534 }, // 5 Mata
      { x: 694, y: 535 }, // 6 Leher Tengah
      { x: 590, y: 716 }, // 7 Leher Bawah
      { x: 799, y: 712 }, // 8 Leher & Dagu
      { x: 905, y: 893 }, // 9 Blank
      { x: 1005, y: 712 } // 10 Mulut/Moncong
    ];


    // Setelah this.puzzlePositions --> Inisialisasi puzzle pieces dan Nomor Puzzle
    this.puzzlePieces = [];
    this.puzzlePieceNumbers = [];

    // Sudah benar gambar dan nomor rubah di nomor gambar pada folder Puzzle-Assets/Level01
    for (let i = 0; i < 10; i++) {
      let nomorPuzzle = i + 1;
      let piece = this.add.image(118, 465, `hex${i + 1}`)
        .setOrigin(0.5)
        .setScale(0.29)
        .setAlpha(0.01)
        .setDepth(2)
        .setVisible(true)
        .setInteractive({ useHandCursor: true })
        .setData('number', nomorPuzzle);
      this.puzzlePieces.push(piece);

      let numText = this.add.text(piece.x, piece.y, nomorPuzzle, {
        font: "bold 32px Arial",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 4
      }).setOrigin(0.5).setDepth(3).setAlpha(0.01);
      this.puzzlePieceNumbers.push(numText);
    }


    // === Inisialisasi slot hexa GRID KANAN & Slot Nomor ===
    this.rightBoardVisuals = [];
    this.rightBoardNumbers = [];



    // Posisi slot hexa di grid kanan fix
    this.rightBoardPositions = [
      { x: 1400, y: 417 },// Slot 1
      { x: 1503, y: 358 },// Slot 2
      { x: 1607, y: 416.7 },// Slot 3
      { x: 1607, y: 537 },// Slot 4
      { x: 1503, y: 474 },// Slot 5
      { x: 1400, y: 539 },// Slot 6
      { x: 1400, y: 655 },// Slot 7
      { x: 1503, y: 595 },// Slot 8
      { x: 1503, y: 715 },// Slot 9
      { x: 1610, y: 660 },// Slot 10
    ];



    // Inisialisasi slot hexa di grid kanan dan nomor
    for (let i = 0; i < 10; i++) {
      const pos = this.rightBoardPositions[i];
      let slot = this.add.image(
        pos.x,
        pos.y,
        `hexSlot0${i + 1}`
      )
        .setOrigin(0.5)
        .setScale(1)
        .setAlpha(0.2)
        .setDepth(1);
      this.rightBoardVisuals.push(slot);

      let slotNum = this.add.text(
        pos.x,
        pos.y,
        i + 1,
        {
          font: "bold 32px Arial",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 4
        }
      ).setOrigin(0.5).setDepth(5).setAlpha(0.01);
      this.rightBoardNumbers.push(slotNum);
    }

    // BATAS GRID KANAN
    // Musik
    this.introMusic = this.sound.add('introMusic');
    this.mainMusic = this.sound.add('mainMusic', { loop: true });
    this.winMusic = this.sound.add('winMusic');
    this.horseNeigh = this.sound.add('horseNeigh');
    this.horseSnort = this.sound.add('horseSnort');
    this.horseHoof = this.sound.add('horseHoof');
    this.horseGallop = this.sound.add('horseGallop');
    this.herdGallop = this.sound.add('herdGallop');
    this.introMusic.setVolume(0.7);
    this.mainMusic.setVolume(0.6);
    this.winMusic.setVolume(0.7);
    this.horseNeigh.setVolume(0.5);
    this.horseSnort.setVolume(0.5);
    this.horseHoof.setVolume(0.5);
    this.horseGallop.setVolume(0.5);
    this.herdGallop.setVolume(0.5);
    this.introMusic.play();
    this.showHorseShakeHead();
    this.showHorseShakeHead();
    this.sound.play('horseNeigh');
    this.sound.play('horseSnort');
    this.showHorseShakeHead();
    this.introMusic.once('complete', () => {
    this.showHorseShakeHead();
    this.sound.play('horseSnort'); 
    this.mainMusic.play();
    this.showHorseShakeHead();
    this.sound.play('horseSnort'); 
    this.showHorseShakeHead();
     });
  
    // Main music dengan volume rendah
    if (this.sound.get('mainMusic')) {
      this.mainMusic = this.sound.add('mainMusic', { 
        loop: true, 
        volume: 0.6  // Volume kecil untuk background
      });
      this.mainMusic.play();
    } 

        

    // Handler Sound Off (pause music favorit & nyalakan soundOffL)
    this.soundOffBtn.on('pointerdown', () => {
      if (this.currentFavMusic && this.isFavMusicActive && this.currentFavMusic.isPlaying) {
        this.currentFavMusic.pause();
        this.soundOffLightBtn.setVisible(true);
        this.soundOnLightBtn.setVisible(false);

      }
    });


    // Handler Sound On (resume music favorit & nyalakan soundOnL)
    this.soundOnBtn.on('pointerdown', () => {
      // Jika music favorit ada dan sedang pause, resume 
      if (this.currentFavMusic && this.isFavMusicActive && this.currentFavMusic.isPaused) {
        this.currentFavMusic.resume();
        // Tampilkan hanya soundOnLight, sembunyikan lainnya
        this.soundOnLightBtn.setVisible(true);
        this.soundOffLightBtn.setVisible(false);

      }
    });

    // Handler klik pada Light untuk kembali ke tombol biasa
    this.soundOnLightBtn.on('pointerdown', () => {
      this.soundOnLightBtn.setVisible(false);
      this.soundOnBtn.setVisible(true);
      this.soundOffBtn.setVisible(true);
      this.soundOffLightBtn.setVisible(false);
    });
    this.soundOffLightBtn.on('pointerdown', () => {
      this.soundOffLightBtn.setVisible(false);
      this.soundOnBtn.setVisible(true);
      this.soundOffBtn.setVisible(true);
      this.soundOnLightBtn.setVisible(false);
    });

    // ...existing code di akhir create()...
    this.startIntroSequence();
    // BATAS CREATE

  this.isExitPanelShown = false;
  this.input.keyboard.on('keydown-ESC', () => {
     if (this.isExitPanelShown) {
      // Tutup panel jika ESC ditekan lagi
      if (this.exitPanelGroup) {
        this.exitPanelGroup.clear(true, true);
        this.exitPanelGroup = null;
      }
      this.isExitPanelShown = false;
    } else {
  this.showExitPanelOnly();
      this.isExitPanelShown = true;
    }
});  
}

// -----------------------------------------------------------------------------
startIntroSequence() {
  // Mainkan intro music
  if (this.introMusic) this.introMusic.play();
  // Geleng kepala
  if (this.showHorseShakeHead) this.showHorseShakeHead();
  // Ringkik
  if (this.horseNeigh) this.horseNeigh.play();
  // Dengus
  if (this.horseSnort) this.horseSnort.play();

  // Setelah intro selesai, mainkan main music
  if (this.introMusic) {
    this.introMusic.once('complete', () => {
      if (this.mainMusic) this.mainMusic.play();
    });
  } else {
    if (this.mainMusic) this.mainMusic.play();
  }
}


// ========== GAME OVER RETURN MESSAGE ==========
//Versi Co 4.1
async getUserStatus(email, level = 'Level01') {
  try {
    const res = await axios.get(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/status',
      { params: { email, level } }
    );
    return res.data;
  } catch (error) {
    console.error('❌ Error getUserStatus:', error);
    return null;
  }
}

async checkUserStatusAndGameOver(email) {
  // Ambil status user dari backend (GET, read-only)
  const status = await this.getUserStatus(email, 'Level01');
  if (!status) {
   console.error('Gagal ambil status user');
    return null;
  } 
  const res = await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/status', { email, level: 'Level01' });
  const userData = res.data;

  // Cek status user lama/baru
  const history = window.getPlayerGameHistory ? window.getPlayerGameHistory(email) : null;
  //const isUserBaru = !history || !history.hasPlayedBefore;//bukan dari backend
  const isUserBaru = !status.playCount || status.playCount === 0;

  // Jika user baru, aktifkan tombol Play & Puzzle
  if (isUserBaru) {
    this.isGameOver = false;
    if (this.playBtn) {
      this.playBtn.setInteractive({ useHandCursor: true });
      this.playBtn.setAlpha(1);
      this.playBtn.setVisible(true);
    }
    this.unblur10PuzzleButton && this.unblur10PuzzleButton();
    console.log('✅ User baru - tombol Play & Puzzle diaktifkan');
    return userData;
  }

  // Cek status game over untuk user lama
  if (userData.isGameOver) {
    if (userData.score > 0) {
      userData.isGameOver = false;
      localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));
      this.isGameOver = false;
      // Lanjutkan main
      return userData;
    } else {
      this.isGameOver = true;
      this.showGameOverReturnMessage();
      this.lockAllGameplayButtons();
      return userData;
    }
  }

  // Tambah playCount setiap kali fungsi ini dipanggil (untuk user lama)
   userData.playCount = (userData.playCount || 0) + 1;

   // Jika playCount >= 3 dan score masih 0, set game over
   if (userData.playCount >= 3 && (userData.score || 0) === 0) {
    await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/set-gameover', { email, isGameOver: true });
    userData.isGameOver = true;
    localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));
    this.isGameOver = true;
    this.showGameOverReturnMessage();
    this.lockAllGameplayButtons();
    return userData;
   }

  // Simpan playCount terbaru ke localStorage
  localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));

  // Jika lolos semua, aktifkan tombol Play & Puzzle
  this.isGameOver = false;
  if (this.playBtn) {
    this.playBtn.setInteractive({ useHandCursor: true });
    this.playBtn.setAlpha(1);
    this.playBtn.setVisible(true);
  }
  this.unblur10PuzzleButton && this.unblur10PuzzleButton();
  return userData;
}

// LOCK LEVEL (mengunci akses level untuk user)
async lockLevel(email, level) {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/lock',
      { email, level },
      { timeout: 5000 }
    );
    return res.data.success === true;
  } catch (err) {
    console.error('Lock level error:', err);
    return false;
  }
}

// UNLOCK LEVEL
async  unlockLevel(email, level) {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/unlock',
      { email, level }
    );
    // Response backend bisa { success: true, unlocked: true }
    return res.data.success || res.data.unlocked === true;
  } catch (err) {
    console.error('Unlock level error:', err);
    return false;
  }
}

async checkGameOverStatusFromServer() {
  const email = localStorage.getItem('playerEmail');
  if (!email) return;

  try {
    const response = await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/gameover', { email });
    const data = response.data;
    if (data.isGameOver) {
      this.isGameOver = true;
      this.showGameOverReturnMessage();
      this.lockAllGameplayButtons();
      return;
    }
    this.unlockGameAfterPurchase();
    // Jika tidak game over, lanjutkan setup board (jika belum di-setup)
    if (!this.isGameOver && !this.boardIsSetup) {
      this.setupBoard(data);
      this.boardIsSetup = true;
    }
  } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      this.lockAllGameplayButtons();
      this.showGameOverReturnMessage();
      return;
    }
    this.unlockGameAfterPurchase();
    // Jika tidak game over, lanjutkan setup board (jika belum di-setup)
    if (!this.isGameOver && !this.boardIsSetup) {
      this.setupBoard({});
      this.boardIsSetup = true;
    }
  }
}

// Fungsi GET user progress
async getUserProgress(email) {
  try {
    const res = await axios.get(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${email}/progress`,
      { timeout: 5000 }
    );
    return res.data; // { progress: {...} }
  } catch (err) {
    console.error('❌ Get user progress error:', err);
    return null;
  }
}

// Fungsi UPDATE user progress
async updateUserProgress(email, progressData) {
  try {
    const res = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${email}/progress`,
      progressData,
      { timeout: 5000 }
    );
    return res.data.success === true;
  } catch (err) {
    console.error('❌ Update user progress error:', err);
    return false;
  }
}

// SIMPAN SCORE KE MONGODB 
async saveScore(score, email) {
    try {
      await this.saveScoreToMongo(score, email);
      localStorage.removeItem(`tempScore_${email}`);
    } catch (e) {
      console.warn("MongoDB unreachable. Saving score locally.");
      localStorage.setItem(`tempScore_${email}`, JSON.stringify({ score, email }));
    }
  }

  async saveScoreToMongo(score, email) {
    const res = await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/score', { score, email });
    if (res.status !== 200) throw new Error("Failed to save score to MongoDB");
  }


//=================================================================================================

//Fungsi di kosongkan dulu dengan TODO ini
setupBoard(userData) {
  // TODO: Isi logika setup board sesuai kebutuhan
  // Contoh minimal:
  console.log('setupBoard dipanggil dengan:', userData);
  // Atau, panggil logika reset/init board yang sudah ada
}


showGameOverReturnMessage() {
  // ✅ CHECK SCORE FIRST - If score > 0, allow playing
  if ((this.score || 0) > 0) {
    console.log(`✅ Player has score ${this.score} - allowing gameplay`);
    
    // Clear Game Over state since player has score
    const email = localStorage.getItem('playerEmail');
    if (email) {
      localStorage.removeItem(`gameOver_${email}`);
      console.log('✅ Game Over cleared - Player has score to continue');
    }
    
    // ✅ ADD CONSOLE LOG HERE (when score = 0):
    console.log(`🔒 Game Over protection active: Score ${this.score}`);

   // // ✅ IF SCORE = 0, SHOW FULL GAME OVER PROTECTION WITH CLOSE BUTTON:
  //  console.log('🔒 Score is 0 - Full Game Over protection active');

    // Reset isGameOver flag
    this.isGameOver = false;
    
    // Show score-based continue message with CLOSE button
    this.showScoreBasedContinueMessage();
    return;
  }

  // ✅ IF SCORE = 0, SHOW FULL GAME OVER PROTECTION WITH CLOSE BUTTON:
  console.log('🔒 Score is 0 - Full Game Over protection active');

  // Background overlay
  const overlay = this.add.rectangle(960, 640, 1920, 1280, 0x000000, 0.1)
    .setDepth(9998);

  // Main message panel
  const messagePanel = this.add.rectangle(960, 640, 1400, 800, 0x023d3f, 1)
    .setStrokeStyle(6, 0x00eaff) //0xff0000
    .setDepth(9999);

  // Title
  const title = this.add.text(960, 400, "🔒 GAME OVER STATE DETECTED", {
    font: "bold 64px Segoe UI",
    fill: "#ff0000",
    align: "center"
  }).setOrigin(0.5).setDepth(10000);

  // Main message (English)
  const message = this.add.text(960, 580, 
    "Your last position was GAME OVER.\n\n" +
    "To continue playing, you need to persuade\n" +
    "Black Horse with his favorite menu.\n\n" +
    "🍎 Choose from: Water, Grass, Carrot, Apple, or Music\n" +
    "💰 Prices: $1-2 (+ 11% tax)", {
    font: "bold 42px Segoe UI",
    fill: "#ffffff",
    align: "center",
    wordWrap: { width: 1200 }
  }).setOrigin(0.5).setDepth(10000);

  

  // Continue button (disabled until purchase)
  const continueBtn = this.add.text(960, 850, "❌ LOCKED - BUY FAVORITE MENU FIRST", {
    font: "bold 40px Segoe UI",
    fill: "#666666",
    backgroundColor: "#333333",
    padding: { left: 30, right: 30, top: 15, bottom: 15 }
  }).setOrigin(0.5).setDepth(10000);

   // ✅ ADD CLOSE BUTTON (X) - Top right corner
  const closeBtn = this.add.text(1650, 250, "✕", {
    font: "bold 60px Arial",
    fill: "#fff",
    backgroundColor: "#e00",
    padding: { left: 15, right: 15, top: 5, bottom: 5 }
  }).setOrigin(0.5).setDepth(10000).setInteractive({ useHandCursor: true });

  // Close button handler - Allows access to favorite menu
  closeBtn.on('pointerdown', () => {
    // Remove Game Over return message
    overlay.destroy();
    messagePanel.destroy();
    title.destroy();
    message.destroy();
    continueBtn.destroy();
    closeBtn.destroy();

    // ✅ SPECIAL STATE: Game Over closed but not cleared
    // Player can access favorite menu but puzzles remain locked
    this.isGameOverClosed = true;
    this.isGameOver = false; // Allow favorite menu access
    
    // Blur/disable 10 puzzle button
    this.blur10PuzzleButton();
    
    console.log('🔓 Game Over message closed - Favorite menu accessible, puzzles locked');
  });


  // Store references for cleanup
  this.gameOverReturnElements = [overlay, messagePanel, title, message, continueBtn];

  // Lock all gameplay buttons immediately
  this.lockAllGameplayButtons();
}


// ========== SCORE-BASED CONTINUE MESSAGE ==========
showScoreBasedContinueMessage() {
   // ✅ ADD CONSOLE LOG HERE (at the very beginning):
  console.log(`✅ Score-based continue shown: Score ${this.score}`);

  // Background overlay (lighter)
  const overlay = this.add.rectangle(960, 640, 1920, 1280, 0x000000, 0.6)
    .setDepth(9998);

  // Main message panel
  const messagePanel = this.add.rectangle(960, 640, 1000, 600, 0x181c24, 0.95)
    .setStrokeStyle(6, 0x00ff00)
    .setDepth(9999);

  // Title
  const title = this.add.text(960, 500, "✅  WELCOME BACK!", {
    font: "bold 56px Segoe UI",
    fill: "#00ff00",
    align: "center"
  }).setOrigin(0.5).setDepth(10000);

  // Score display
  const scoreDisplay = this.add.text(960, 580, 
    `Current Score: ${this.score}\n\n` +
    "Game Over cleared automatically!\n" +
    "You can continue playing with your balance.\n\n" +
    "⏰ This message will stay for 3 seconds\n" +
    "or click CONTINUE/CLOSE to proceed.", { 
    font: "bold 36px Segoe UI",
    fill: "#ffffff",
    align: "center",
    wordWrap: { width: 800 }
  }).setOrigin(0.5).setDepth(10000);

  // Continue button (enabled)
  const continueBtn = this.add.text(960, 750, "✅ CONTINUE PLAYING", {
    font: "bold 40px Segoe UI",
    fill: "#ffffff",
    backgroundColor: "#00aa00",
    padding: { left: 30, right: 30, top: 15, bottom: 15 }
  }).setOrigin(0.5).setDepth(10000).setInteractive({ useHandCursor: true });

  // ✅ ADD CLOSE BUTTON (X) - Top right corner
  const closeBtn = this.add.text(1450, 350, "✕", {
    font: "bold 50px Arial",
    fill: "#fff",
    backgroundColor: "#e00",
    padding: { left: 12, right: 12, top: 4, bottom: 4 }
  }).setOrigin(0.5).setDepth(10000).setInteractive({ useHandCursor: true });

  // Continue button handler
  continueBtn.on('pointerdown', () => {
    // Remove this message
    overlay.destroy();
    messagePanel.destroy();
    title.destroy();
    scoreDisplay.destroy();
    continueBtn.destroy();
    closeBtn.destroy();
    
    // Ensure Game Over state is cleared
    this.isGameOver = false;
    this.isGameOverClosed = false;
    
    console.log('✅ Player chose to continue with available score');
  });

  // Close button handler - Same as Continue
  closeBtn.on('pointerdown', () => {
    overlay.destroy();
    messagePanel.destroy();
    title.destroy();
    scoreDisplay.destroy();
    continueBtn.destroy();
    closeBtn.destroy();
    
    this.isGameOver = false;
    this.isGameOverClosed = false;
    
    console.log('✅ Score-based continue message closed');
  });

  // ✅ AUTO-HIDE AFTER 3 SECONDS (faster auto-clear)
  this.time.delayedCall(3000, () => {
    if (overlay && overlay.active) {
      overlay.destroy();
      messagePanel.destroy();
      title.destroy();
      scoreDisplay.destroy();
      continueBtn.destroy();
      closeBtn.destroy();
      this.isGameOver = false;
      this.isGameOverClosed = false;
      
      console.log('✅ Auto-cleared: Player can continue with score');
    }
  });
}

// Around line 1450, ADD this function:
// Around line 1500, ADD this missing function:

// ========== LOW SCORE WARNING ==========
showLowScoreWarning() {
  // Remove existing warning
  if (this.lowScoreWarning) {
    this.lowScoreWarning.destroy();
    this.lowScoreWarningBg.destroy();
  }

  // Background
  this.lowScoreWarningBg = this.add.rectangle(960, 350, 1000, 300, 0x000000, 0.9)
    .setStrokeStyle(4, 0xffaa00)
    .setDepth(9998);

  // Warning message
  this.lowScoreWarning = this.add.text(960, 350,
    `⚠️ LOW SCORE WARNING!\n\n` +
    `Current Score: ${this.score}\n` +
    `Game continues, but consider buying\n` +
    `favorite menu for better performance!`, {
    font: "bold 32px Segoe UI",
    fill: "#ffffff",
    align: "center",
    wordWrap: { width: 900 }
  }).setOrigin(0.5).setDepth(9999);

  // Auto-hide after 4 seconds
  this.time.delayedCall(4000, () => {
    if (this.lowScoreWarning) {
      this.lowScoreWarning.destroy();
      this.lowScoreWarningBg.destroy();
      this.lowScoreWarning = null;
      this.lowScoreWarningBg = null;
    }
  });
}

// ========== BLUR 10 PUZZLE BUTTON ==========
blur10PuzzleButton() {
  // Find and blur the 10 puzzle button
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.setAlpha(0.3); // Make it very blurred
    this.lv01Puzzle10Btn.disableInteractive(); // Disable clicks
  }
  
  // Also blur the play button
  if (this.playBtn) {
    this.playBtn.setAlpha(0.3);
    this.playBtn.disableInteractive();
  }
  
  console.log('🔒 10 Puzzle and Play buttons blurred - Only favorite menu accessible');
}

// ========== UNBLUR BUTTONS AFTER PURCHASE ==========
unblur10PuzzleButton() {
  // Restore 10 puzzle button
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.setAlpha(1);
    this.lv01Puzzle10Btn.setInteractive();
  }
  
  // Restore play button  
  if (this.playBtn) {
    this.playBtn.setAlpha(1);
    this.playBtn.setInteractive();
  }
  
  console.log('✅ 10 Puzzle and Play buttons restored');
}



// ========== GAME OVER PROTECTION FUNCTIONS ==========
lockAllGameplayButtons() {
  // Disable (blur) the play button
  if (this.playBtn) {
    this.playBtn.setAlpha(0.3);
    this.playBtn.disableInteractive();
  }
  
  // Disable 10 puzzle button permanently until favorite menu purchase
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.disableInteractive();
    this.lv01Puzzle10Btn.setAlpha(0.5); // Visual indication
  }
  
  // Disable 20 puzzle button 
  if (this.lv01Puzzle20Btn) {
    this.lv01Puzzle20Btn.disableInteractive();
    this.lv01Puzzle20Btn.setAlpha(0.5);
  }
  
  console.log('🔒 All gameplay buttons locked due to Game Over');
}

unlockGameAfterPurchase() {
  // Called after successful favorite menu purchase
  this.isGameOver = false;
  this.isGameOverClosed = false; // ✅ Clear both states

  // ✅ CLEAR GAME OVER STATE FROM LOCALSTORAGE:
  const email = localStorage.getItem('playerEmail');
  if (email) {
    localStorage.removeItem(`gameOver_${email}`);
    console.log('✅ Game Over state cleared - Player can play again');
  }
  
  // Restore buttons to full functionality
  this.unblur10PuzzleButton();

  // Re-enable buttons
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.setInteractive();
    this.lv01Puzzle10Btn.setAlpha(1);
  }
  
  if (this.lv01Puzzle20Btn) {
    this.lv01Puzzle20Btn.setInteractive();
    this.lv01Puzzle20Btn.setAlpha(1);
  }
  
  // Clear Game Over return message
  if (this.gameOverReturnElements) {
    this.gameOverReturnElements.forEach(element => {
      if (element) element.destroy();
    });
    this.gameOverReturnElements = null;
  }

  // Remove Game Over image
  if (this.gameOverImg) {
    this.gameOverImg.destroy();
    this.gameOverImg = null;
  }
  

  console.log('✅ Game unlocked after favorite menu purchase');
}
 // ========== GAME OVER PUZZLE MESSAGE ==========
showGameOverPuzzleMessage() {
  // Remove existing message
  if (this.gameOverPuzzleMsg) {
    this.gameOverPuzzleMsg.destroy();
    this.gameOverPuzzleMsgBg.destroy();
  }

  // Background
  this.gameOverPuzzleMsgBg = this.add.rectangle(960, 350, 1200, 400, 0x023d3f, 1)
    .setStrokeStyle(4, 0x00eaff)
    .setDepth(9998);

  // Message
  this.gameOverPuzzleMsg = this.add.text(960, 350,
    "🔒 GAME OVER - PUZZLES LOCKED!\n\n" +
    "Your last session ended in Game Over.\n" +
    "To unlock puzzles, you need to persuade\n" +
    "Black Horse with his favorite menu.\n\n" +
    "💰 Buy: Water ($1), Grass ($1), Carrot ($2),\n" +
    "Apple ($2), or Music ($2)", {
    font: "bold 36px Segoe UI",
    fill: "#ffffff",
    align: "center",
    wordWrap: { width: 1000 }
  }).setOrigin(0.5).setDepth(9999);

  // Auto-hide after 4 seconds
  this.time.delayedCall(2000, () => {
    if (this.gameOverPuzzleMsg) {
      this.gameOverPuzzleMsg.destroy();
      this.gameOverPuzzleMsgBg.destroy();
      this.gameOverPuzzleMsg = null;
      this.gameOverPuzzleMsgBg = null;
    }
});
}
  

// Tambahkan SETELAH create() function, sekitar line 1130: atasi delay 3000 loading musik favorit 

// Around line 811, ADD this complete function AFTER the create() function ends:

// ========== ALL FUNCTIONS OUTSIDE create() ==========

// ✅ CYAN BORDER LIGHT EFFECT (Add this AFTER create() function)
createDonationBorderEffect() {
  // Create 12 cyan particles around button
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 80;
    
    const light = this.add.circle(
      this.donationBtn.x + Math.cos(angle) * 50, 
      this.donationBtn.y + Math.sin(angle) * 20, 
      5, 
      0x00eaff
    )
      .setDepth(1020)
      .setAlpha(0.9);
    
    // Animate particles outward with fade
    this.tweens.add({
      targets: light,
      x: this.donationBtn.x + Math.cos(angle) * distance,
      y: this.donationBtn.y + Math.sin(angle) * distance,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.9, to: 0 },
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => light.destroy()
    });
  }

  // Button pulse effect
  this.tweens.add({
    targets: this.donationBtn,
    scale: { from: 1, to: 1.15, to: 1 },
    duration: 600,
    ease: 'Sine.easeInOut'
  });
}

// ========== BACKGROUND LOADING FAVORITE MUSIC ==========
backgroundLoadFavoriteMusic() {
  console.log('🎵 Starting background favorite music loading...');
  
  // Check if already loaded
  if (this.favoriteAssetsReady) {
    console.log('✅ Favorite music already loaded!');
    return;
  }
  
  // Load favorite music assets in background
  const musicAssets = [
    { key: 'musicfav03', path: './Puzzle-Assets/Sfx/music favorites/music-favorite-easy-country-music-intro-outro.mp3' },
    { key: 'musicfav04', path: './Puzzle-Assets/Sfx/music favorites/music-favorite-golden-sunset-piano.mp3' },
    { key: 'musicfav05', path: './Puzzle-Assets/Sfx/music favorites/music-favorite-horsepower.mp3' },
    { key: 'musicfav06', path: './Puzzle-Assets/Sfx/music favorites/music-favorite-musique-west-cowboy.mp3' },
    { key: 'musicfav07', path: './Puzzle-Assets/Sfx/music favorites/music-favorite-old-west.mp3' }
  ];
  
  // Load each music file
  musicAssets.forEach(asset => {
    if (!this.sound.get(asset.key)) {
      this.load.audio(asset.key, asset.path);
    }
  });
  
  // Start loading
  if (this.load.list.size > 0) {
    this.load.once('complete', () => {
      console.log('✅ Background favorite music loading complete!');
      this.favoriteAssetsReady = true;
    });
    
    this.load.start();
  } else {
    console.log('✅ All favorite music already loaded!');
    this.favoriteAssetsReady = true;
  }
}
//Batas akhir backgroundLoadFavoriteMusic()
//--------------------------------------------------------------------

// ========== OPTIMASI DETEKSI NEGARA DAN PREVIEW PAJAK ==========
   async detectUserCountry() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    this.userCountry = data.country_code || 'US';
    console.log(`🌍 User country detected: ${this.userCountry}`);
    return this.userCountry;
  } catch (error) {
    console.error('Country detection failed:', error);
    return 'US';
  }
}

async getTaxPreview(amount, country) {
  try {
   const response = await axios.post(`${this.backendUrl}/api/calculate-tax`, { amount, country });
   return response.data; 
  } catch (error) {
    console.error('Tax preview failed:', error);
    return { 
      baseAmount: amount, 
      taxRate: 0, 
      taxAmount: 0, 
      totalAmount: amount 
    };
  }
}

// ========== OPTIMASI PREVIEW TAX ==========
  // Tambah fungsi preview tax sebelum bayar
async showTaxPreview(musicTitle, country) {
  // Detect country & get tax info
  await this.detectUserCountry();
  const taxInfo = await this.getTaxPreview(2, this.userCountry);
  
  // Show tax breakdown
  if (this.taxPreviewText) this.taxPreviewText.destroy();
  
  this.taxPreviewText = this.add.text(850, 600, 
    `${musicTitle}\n` +
    `Base Price: $${taxInfo.baseAmount}\n` +
    `Tax (${taxInfo.taxRate}%): $${taxInfo.taxAmount}\n` +
    `Total: $${taxInfo.totalAmount}`, {
    font: "bold 24px Arial", 
    fill: "#fff", 
    align: "center"
  }).setOrigin(0.5).setDepth(402);
  
  return taxInfo;
}

// Tambahkan SETELAH line 1240 (setelah showTaxPreview function ends):
// 👇 ADD HELPER METHOD HERE 👇
// ========== BACKGROUND TAX UPDATE (SEPARATE ASYNC METHOD) ==========
async updateTaxInBackground(musicTitle, x, y) {
  try {
    // Use existing detectUserCountry and getTaxPreview functions
    await this.detectUserCountry();
    const taxInfo = await this.getTaxPreview(2, this.userCountry);
    
    // Update with real calculation if preview still exists
    if (this.taxPreviewText) {
      this.taxPreviewText.setText(
        `${musicTitle}\n` +
        `Base: $${taxInfo.baseAmount}\n` +
        `Tax (${taxInfo.taxRate}%): $${taxInfo.taxAmount}\n` +
        `Total: $${taxInfo.totalAmount}`
      );
      
      // Change color to indicate real calculation
     // this.taxPreviewText.setFill("#ffd700"); // Gold color for real data
    }
  } catch (error) {
    console.log('Tax API failed, using static calculation');
    // Keep static calculation if API fails - no error shown to user
  }
}

 // ========== OPTIMASI VOLUME MANAGEMENT ==========
  playFavoriteMusic(index) {
    // Pause main music saat favorit aktif
    if (this.mainMusic && this.mainMusic.isPlaying) {
      this.mainMusic.pause();
    }
    
    // Play musik favorit dengan volume normal
    const key = this.musicKeys[index - 1];
    this.currentFavMusic = this.sound.add(key, { 
      loop: true, 
      volume: 0.8  // Volume normal untuk favorit
    });
    this.currentFavMusic.play();
    this.isFavMusicActive = true;
  }

  stopFavoriteMusic() {
    if (this.currentFavMusic && this.currentFavMusic.isPlaying) {
      this.currentFavMusic.stop();
      this.currentFavMusic = null;
      this.isFavMusicActive = false;
    }
    
    // Resume main music dengan volume kecil
    if (this.mainMusic && this.mainMusic.isPaused) {
      this.mainMusic.resume();
    }
  }


  // Tombol Play Sheriff dengan animasi spiral
   createSheriffPlayButton() {
    const playBtn = this.add.image(250, 830, 'playSheriff')
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .setDepth(999);

    this.playBtn = playBtn; // Simpan referensi tombol Play


    // --- LOGIKA GAME MULAI DI SINI ---
    playBtn.on('pointerdown', async () => { //(TIDAK MUNCUL PUZZLE)
      playBtn.setTexture('playSheriffL');
      playBtn.setScale(0.4);

      if (this.claimHatBtn) {
        this.claimHatBtn.destroy();
        this.claimHatBtn = null;
      }
      if (this.downloadHat) {
        this.downloadHat.destroy();
        this.downloadHat = null;
      }
      //----------------------------------------------------------------
      // Hentikan winMusic, lanjutkan music favorit jika ada
      if (this.winMusic && this.winMusic.isPlaying) this.winMusic.stop();
      if (this.currentFavMusic && this.isFavMusicActive && this.currentFavMusic.isPaused) {
        this.currentFavMusic.resume();
        this.soundOffBtn.clearTint();
        }

        
      // === TIMER FAVORIT: JANGAN RESET ===
      // Jika sedang mode favorit, lanjutkan timer dari sisa waktu
      if (this.isFavMusicActive && this.favoritTimeToAdd) {
        // Jangan reset this.timeElapsed, lanjutkan timer
        // Timer sudah berjalan, tidak perlu di-reset
      } else {
        //----------------------------------------------------------------
        // Jika bukan mode favorit, reset timer seperti biasa
        // Reset timer
        this.timeElapsed = 0;
        this.timerText.setText("00:00");
      }
      // Hapus timer event sebelumnya jika ada
      if (this.roundTimer) {
        this.roundTimer.remove(false);
      }

//-----------------------------------------------------------------------------------------------------------------------------------------------------------

      // Mulai timer baru sesuai ronde (setelah win dari menu favorit)
      let timeLimit = this.roundTimeLimits[this.round - 1] || 19; // pengaturan play setelah win repeat 18 detik hitung seperti ronde awal (3 ronde)
      this.roundTimer = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.timeElapsed++;
          let min = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
          let sec = (this.timeElapsed % 60).toString().padStart(2, '0');
          this.timerText.setText(`${min}:${sec}`);

          if (this.timeElapsed >= timeLimit) {
            this.roundTimer.remove(false);
            this.onTimeUp();
          }
          // music latar dimainkan (14/06/25) TAMBAHAN
          if (this.mainMusic && !this.mainMusic.isPlaying) {
           this.mainMusic.play({ loop: true });
          }
        },
        callbackScope: this,
        loop: true
      });

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------      
     
      // --- Tambahkan animasi tombol Play ditekan ---
      this.tweens.add({
        targets: playBtn,
        y: playBtn.y + 10,
        duration: 80,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });

      // Hentikan semua tween yang masih berjalan
      this.tweens.killAll(); // ini di tambahkan untuk menghentikan semua tween yang mungkin masih berjalan

      // Acak urutan puzzle dulu
      this.order = Phaser.Utils.Array.NumberArray(0, 9); // tgl 02 ini dibawah this.rightBoardSlots atau 
      Phaser.Utils.Array.Shuffle(this.order); // // === TAMBAHKAN INI DI SINI ===

      // RESET semua puzzle ke posisi awal sebelum spiral
      for (let i = 0; i < 10; i++) {
        let piece = this.puzzlePieces[this.order[i]];
        //let piece = puzzlethis.order[i]; // BENAR: gunakan mapping hasil shuffle
        piece.x = 118;
        piece.y = 465;
        piece.setAlpha(0.01);
        piece.setVisible(true);
        piece.setInteractive();
        //piece.removeAllListeners();
        this.puzzlePieceNumbers[i].x = 118;
        this.puzzlePieceNumbers[i].y = 465;
        this.puzzlePieceNumbers[i].setAlpha(0.01);
      }
      this.rightBoardSlots = Array(10).fill(null);

      // -----------------------------------------------  
      // === TAMBAHKAN INI DI SINI === // BARU DITAMBAH 04/06
      // Inisialisasi grid kiri baru
      for (let i = 0; i < 10; i++) {
        let piece = this.puzzlePieces[this.order[i]];
        piece.setData('gridIdx', i); // i adalah index slot grid kiri baru untuk piece ini
        //this.leftBoardSlots[i] = piece.getData('number');
      }
      // --------------------------------------------------


      this.helpPanel && this.helpPanel.setAlpha(0);
      this.helpText && this.helpText.setAlpha(0);
      //playBtn.setVisible(false);



      // ANIMASI BERHASIL
      // Fungsi rekursif spiral besar radius 300
      function spiralLoop(piece, i, count, max, callback) {
        piece.angle = 0;
        this.tweens.add({
          targets: piece,
          x: 850 + Math.cos((i / 9) * Math.PI * 2) * 300,
          y: 600 + Math.sin((i / 9) * Math.PI * 2) * 300,
          angle: 360,
          duration: 700,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            if (count < max) {
              // Kembali ke tengah lalu spiral lagi
              this.tweens.add({
                targets: piece,
                x: 850,
                y: 600,
                angle: 0,
                duration: 300,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                  spiralLoop.call(this, piece, i, count + 1, max, callback);
                }
              });
            } else {
              callback();
            }
          }
        });
      }

      // ANIMASI SPIRAL DAN KLIK BERHASIL SUDAH SESUAI
      // Animasi spiral dan entry ke grid kiri 
      for (let i = 0; i < 10; i++) {
        let piece = this.puzzlePieces[this.order[i]]; // salah
        //let piece = puzzlethis.order[i]; // BENAR: gunakan mapping hasil shuffle
        piece.setVisible(true);
        piece.setAlpha(1);

        // Mulai dari posisi awal (misal pojok kiri bawah)
        piece.x = 450;
        piece.y = 170;

        // 1. Tween turun ke tengah
        this.tweens.add({
          targets: piece,
          x: 850,
          y: 600,
          duration: 500,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            // 2. Spiral kecil di tengah
            this.tweens.add({
              targets: piece,
              x: 850 + Math.cos((i / 9) * Math.PI * 2) * 300,
              y: 600 + Math.sin((i / 9) * Math.PI * 2) * 300,
              angle: 360,
              duration: 500,
              ease: 'Sine.easeInOut',
              onComplete: () => {
                // 3. Spiral besar 1x (pakai spiralLoop)
                spiralLoop.call(this, piece, i, 0, 1, () => {

                  // 4. Tween ke posisi grid kiri
                  this.tweens.add({
                    targets: piece,
                    x: this.puzzlePositions[i].x,
                    y: this.puzzlePositions[i].y,
                    angle: 0,
                    duration: 500,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                      // Simpan index posisi grid kiri acak
                      piece.setData('gridIdx', i);

                      // Sembunyikan tulisan COUNTDOWN jika masih ada (hanya sekali, puzzle terakhir)
                      // if (i === 9 && this.countdownText) {
                      //this.countdownText.setVisible(false);
                      // }

                      // Jika ini puzzle terakhir dan ada waktu favorit yang dibeli, baru mulai timer
                      if (i === 9 && this.favoritTimeToAdd) {
                        this.addFavoritTimeToMainTimer(this.favoritTimeToAdd, this.favoritLabelToAdd);
                        this.favoritTimeToAdd = null;
                        this.favoritLabelToAdd = null;
                      }

                      // === INTERAKTIF: KLIK puzzle di grid kiri ke grid kanan ===
                      piece.removeAllListeners();
                      piece.setInteractive();
                      piece.on('pointerdown', () => {
                        let nomorPuzzle = piece.getData('number');
                        let slotIdx = nomorPuzzle - 1; // slot kanan sesuai nomor puzzle
                        let gridIdx = piece.getData('gridIdx'); // index posisi grid kiri acak

                        // Cek apakah ini giliran yang benar
                        let nextSlot = this.rightBoardSlots.findIndex(slot => slot === null);
                        if (slotIdx !== nextSlot) {
 
  this.salahBerturut = (this.salahBerturut || 0) + 1;
  // === LOGIKA 3x SALAH: ANIMASI SPIRAL/GOYANG ===
    if (this.salahBerturut >= 3) {
      let lastTween = null;

      // Animasi spiral/goyang semua puzzle grid kiri
      for (let i = 0; i < 10; i++) {
        let puzzle = this.puzzlePieces[this.order[i]];
        // Cek jika puzzle masih di grid kiri (belum masuk rightBoard)
        let nomor = puzzle.getData('number');
        if (!this.rightBoardSlots.includes(nomor)) {
          let startX = puzzle.x;
          let startY = puzzle.y;
           // ✅ SAVE TWEEN REFERENCE:
          lastTween = this.tweens.addCounter({
            from: 0,
            to: Math.PI * 4, // untuk putaran
            duration: 1000, // lamanya makin lama makin geli
            onUpdate: tween => {
              const t = tween.getValue();
              puzzle.x = startX + Math.cos(t) * 30;
              puzzle.y = startY + Math.sin(t) * 30;
              puzzle.angle = t * 180 / Math.PI;
            },
            onComplete: () => {
              puzzle.x = startX;
              puzzle.y = startY;
              puzzle.angle = 0;
            }
          });
        }
      }
      
  // Setelah semua puzzle selesai goyang, baru dengus & geleng kepala
  if (lastTween) {
    lastTween.setCallback('onComplete', () => {
      this.sound.play('horseSnort');
      this.showHorseShakeHead();
      this.tweens.add({
        targets: this.bhhead,
        angle: { from: -20, to: 20 },
        yoyo: true,
        repeat: 3,
        duration: 120
      });
      this.salahBerturut = 0;
    });
  } else {
    // Jika tidak ada puzzle yang goyang, langsung dengus & geleng kepala
    this.sound.play('horseSnort');
    this.showHorseShakeHead();
    this.tweens.add({
      targets: this.bhHead,
      angle: { from: -20, to: 20 },
      yoyo: true,
      repeat: 3,
      duration: 120
    });
   // this.salahBerturut = 0;
  }

      this.salahBerturut = 0;
      return;
    }

                          // Jika benar urut terbang ke grid kanan
                          this.tweens.add({
                            targets: piece,
                            x: this.rightBoardPositions[slotIdx].x, // BENAR: TERBANG KE GRID KANAN
                            y: this.rightBoardPositions[slotIdx].y,
                            duration: 200,// atur kecepatan sesuai kebutuhan pindah ke grid kanan
                            ease: 'Sine.easeInOut',
                            onComplete: () => {
                              // Setelah terbang ke kanan, kembali ke posisi grid kiri
                              this.tweens.add({
                                targets: piece,
                                x: this.puzzlePositions[gridIdx].x, // KEMBALI KE GRID KIRI
                                y: this.puzzlePositions[gridIdx].y,
                                duration: 250,
                                ease: 'Sine.easeInOut'
                              });                        
                          }
                          });
                          return;
                        }
                        // Benar urutan: masuk ke slot kanan
                        this.salahBerturut = 0; 
                        if (this.rightBoardSlots[slotIdx] !== null) return; // slot sudah terisi
                        this.tweens.add({
                          targets: piece,
                          x: this.rightBoardPositions[slotIdx].x,
                          y: this.rightBoardPositions[slotIdx].y,
                          duration: 200,
                          ease: 'Sine.easeInOut',
                          

                          onUpdate: () => {
                            this.puzzlePieceNumbers[nomorPuzzle - 1].x = piece.x;
                            this.puzzlePieceNumbers[nomorPuzzle - 1].y = piece.y;
                          },
                          onComplete: () => {
                            //this.rightBoardSlots[slotIdx] = nomorPuzzle; // Simpan nomor puzzle di slot kanan
                            this.puzzlePieceNumbers[nomorPuzzle - 1].x = this.rightBoardPositions[slotIdx].x;
                            this.puzzlePieceNumbers[nomorPuzzle - 1].y = this.rightBoardPositions[slotIdx].y;
                            //this.puzzlePieceNumbers[nomorPuzzle - 1].x = slotIdx === 9 ? this.rightBoardPositions[slotIdx].x + 1 : this.rightBoardPositions[slotIdx].x;
                            //this.puzzlePieceNumbers[nomorPuzzle - 1].y = this.rightBoardPositions[slotIdx].y;
                            this.rightBoardSlots[slotIdx] = nomorPuzzle;
                            piece.disableInteractive();
                            if (this.rightBoardSlots.every(slot => slot !== null)) {
                            this.checkPuzzle();
                            } 
                          }
                        });
                      });
                    }
                  });
                });
              
              }
            });
          }
        });
      }
    }); // penutup playBtn.on
  }



  // === Panel help, musik, dsb === ini tidak bisa dihapus pengaruh ke sound on off
  createHelpPanel() {
    this.helpPanel = this.add.rectangle(1050, 320, 340, 340, 0x181c24, 0.82)
      .setStrokeStyle(3, 0x00eaff)
      .setAlpha(0)
      .setDepth(100);
    this.helpText = this.add.text(900, 180,
      { font: "20px Segoe UI", fill: "#fff", wordWrap: { width: 320 } }
    )
      .setAlpha(0).setDepth(101);
  }

  // === Cek puzzle, dsb ===
  checkPuzzle() {
    console.log('rightBoardSlots:', this.rightBoardSlots); // Tambahkan di sini
    let benar = true;
    for (let i = 0; i < 10; i++) {
      if (this.rightBoardSlots[i] !== i + 1) {
        benar = false;
        break;
      }
    }

    // Jika benar, tampilkan pesan sukses dan tambahkan score-->saat kalah di ontime
    if (benar) {
      // Hentikan timer supaya onTimeUp tidak terpanggil lagi
      if (this.roundTimer) {
        this.roundTimer.remove(false);
        this.roundTimer = null;
      }

      this.score = (this.score || 0) + 100;
      this.scoreText.setText(this.score.toString().padStart(5, '0')); // Tambahkan baris ini
      this.registry.set('score', this.score);
      const email = localStorage.getItem('playerEmail');
      if (email) this.saveScore(this.score, email);
      //if (email && typeof safeUpdateGameScore === 'function') { ////hendle score saat menang diganti dgn saveScore
      //safeUpdateGameScore(email, this.score);
      //}
      //localStorage.setItem('playerEmail', this.score); // awalnya playerScore<-- Tambahkan ini 14/06/25
      this.sound.play('horseNeigh');
      // Tampilkan black horse utuh hanya jika score >= 1000 --> tidak tampil dulu di score 1000
      //if (this.score >= 1000 && !this.blackHorseSprite) {
      //this.transformPuzzleToHorse();
      //}
      this.showClaimHat(() => {
      });

      this.showClaimHat(() => {
        if (this.playBtn) {
          this.playBtn.setInteractive();
          this.playBtn.setAlpha(1);
          this.playBtn.setVisible(true);
        }
      });

      // ✅ DESTROY AIR saat menang:
    if (this.currentAboveHorse) {
      this.currentAboveHorse.destroy();
      this.currentAboveHorse = null;
      console.log('💧 Air destroyed - Player won');
    }

    } else {
      // ✅ FAILED case - ADD air check:
    if (this.score > 0 && this.currentAboveHorse) {
      this.currentAboveHorse.destroy();
      this.currentAboveHorse = null;
      console.log('💧 Air destroyed - Player has score but failed puzzle');
    }
      this.onTimeUp();
    }
  }
// ========== UNBLUR 10 PUZZLE BUTTON ==========
 //  unblur10PuzzleButton() {
  // Aktifkan tombol 10 Puzzle
 // if (this.lv01Puzzle10Btn) {
 // this.lv01Puzzle10Btn.setAlpha(1);
 //   this.lv01Puzzle10Btn.setInteractive({ useHandCursor: true });
 // }

  // Aktifkan tombol Play
  //if (this.playBtn) {
    //this.playBtn.setAlpha(1);
    //this.playBtn.setInteractive({ useHandCursor: true });
  //}

 // console.log('✅ 10 Puzzle and Play buttons restored');
//}
//================================================

  // filepath: [Level01Scene.js](http://_vscodecontentref_/2)
  showClaimHat(callback) {
    // Hapus claimHatBtn dan downloadHat jika ada
    if (this.claimHatBtn) {
      this.claimHatBtn.destroy();
      this.claimHatBtn = null;
    }
    if (this.downloadHat) {
      this.downloadHat.destroy();
      this.downloadHat = null;
    }

    // Selalu mainkan win music dan ringkikan kuda setiap menang
    if (this.winMusic) this.winMusic.play();
    if (this.horseNeigh) this.horseNeigh.play();

    // Pause main music/fav music saat win
    if (this.mainMusic && this.mainMusic.isPlaying) this.mainMusic.pause();
    if (this.currentFavMusic && this.currentFavMusic.isPlaying) this.currentFavMusic.pause();

    // Setelah win music selesai, resume music favorit/main
    this.winMusic.once('complete', () => {
      if (this.currentFavMusic && this.isFavMusicActive) {
        this.currentFavMusic.resume();
      } else if (this.mainMusic) {
        this.mainMusic.resume();
      }
    });
    
   
    // Topi biru di tengah hanya muncul saat kemenangan pertama
    if (!this.hasWonOnce) {
      this.hasWonOnce = true;
      this.claimHatBtn = this.add.image(1100, 650, 'claimHat').setScale(0.7).setInteractive();
      this.claimHatBtn.on('pointerdown', () => {
        // Hilangkan topi biru tengah setelah diklik
        if (this.claimHatBtn) {
          this.claimHatBtn.destroy();
          this.claimHatBtn = null;
        }
        // (Opsional) Pesan info
        if (this.claimHatMsg) this.claimHatMsg.destroy();
        this.claimHatMsg = this.add.text(1100, 600, "Claim your hat below!", {
          font: "bold 24px Segoe UI",
          fill: "#00eaff",
          backgroundColor: "#fff",
          padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setDepth(2100);
        this.time.delayedCall(1200, () => {
          if (this.claimHatMsg) this.claimHatMsg.destroy();
        });
        if (callback) callback();
      });
    } else {
      // Jika sudah pernah menang, langsung callback (tanpa topi biru tengah)
      if (callback) callback();
    }
  }



  // filepath: [Level01Scene.js](https://_vscodecontentref_/2)
  onTimeUp() {
    this.sound.play('horseSnort');

    // Kurangi score jika gagal, minimal 0 --> saat kalah, saat menang di checkpuzzle
    this.score = Math.max(0, (this.score || 0) - 100);
    this.scoreText.setText(this.score.toString().padStart(5, '0'));
    this.registry.set('score', this.score);
    // Simpan score ke localStorage saat mongodb offline
    const email = localStorage.getItem('playerEmail');
    if (email) this.saveScore(this.score, email);
    //if (email && typeof safeUpdateGameScore === 'function') { //hendle score saat kalah diganti dgn saveScore
    //safeUpdateGameScore(email, this.score);
    //}
     // ⬇️ Tambahkan pengecekan ini setelah safeUpdateGameScore tambah 08/07/25
    // Cek apakah sudah 3x main extra setelah beli menu favorit dan score sudah 0
    const history = window.getPlayerGameHistory ? window.getPlayerGameHistory(email) : null;
    if (
        this.score === 0 &&
        history &&
        history.hasPlayedBefore &&
       // history.favoriteGiven && // sudah pernah beli menu favorit
        (history.totalGamesPlayed || 0) >= 3 // sudah main 3x extra
    ) {
        if (window.lockPlayAndShowGameOver) {
            window.lockPlayAndShowGameOver();
        }
    }
    

   // localStorage.setItem('playerEmail', this.score); //21/06/25 playerScore ganti playerEmail <-- 14/06/25

    // ✅ ADD THIS SIMPLE CHECK - Destroy air if score > 0:
  if (this.score > 0 && this.currentAboveHorse) {
    this.currentAboveHorse.destroy();
    this.currentAboveHorse = null;
    console.log('💧 Air destroyed - Player still has score');
  } 

    // === Tambahkan kode ini untuk menghentikan musik favorit saat waktu habis ===
    if (this.currentFavMusic && this.currentFavMusic.isPlaying) {
      this.currentFavMusic.stop();
      this.isFavMusicActive = false;
      this.isFavoritActive = false; // Tambahkan ini
    }

    // Kembalikan tombol Play ke kondisi off
    if (this.playBtn) {
      this.playBtn.setTexture('playSheriff');
      this.playBtn.setScale(0.3);
    }

    this.round = (this.round || 1) + 1;
    this.showRoundMessage("");

    // Panggil di onTimeUp() sebelum showRoundMessage: Geleng kepala kuda
    this.showHorseShakeHead();

    // 3 Ronde dan atur timer 00:00
    if (this.round === 2) {
     this.isGameOver = true;
      this.timeElapsed = 0; //untuk mulai menu favorit saat timer over 00:00 19/06/25
      if (this.timerText) this.timerText.setText("00:00"); 
      this.showRoundMessage("");

    } else if (this.round === 3) {
       this.isGameOver = true;
      this.timeElapsed = 0; //untuk mulai menu favorit saat timer over 00:00 19/06/25
      if (this.timerText) this.timerText.setText("00:00"); 
      this.isGameOver = true;
      this.showRoundMessage("");

    } else if (this.round > 3) {
      // ✅ CHECK SCORE BEFORE APPLYING GAME OVER:
  if ((this.score || 0) <= 0) {
    // Only apply Game Over if score is 0 or negative
    this.isGameOver = true;

     // ⬇️ Tambahkan di sini (setelah set isGameOver = true dan simpan localStorage):
    if (this.playBtn) {
      this.playBtn.disableInteractive();
      this.playBtn.setAlpha(0.5);
    }
    if (this.lv01Puzzle10Btn) {
      this.lv01Puzzle10Btn.disableInteractive();
      this.lv01Puzzle10Btn.setAlpha(0.5);
    }
    
    console.log('🔒 Play & Puzzle buttons locked - Game Over triggered');
  
   
   // ✅ SAVE GAME OVER STATE TO LOCALSTORAGE:
       const email = localStorage.getItem('playerEmail');
       if (email) {
       localStorage.setItem(`gameOver_${email}`, 'true');
       console.log('💾 Game Over state saved - Score is 0');
     }
      } else {
    // Player still has score - don't apply full Game Over
    console.log(`✅ Round > 3 but player has score ${this.score} - no Game Over saved`);
    this.isGameOver = false;
    
    // Just show low score warning but allow playing
    this.showLowScoreWarning();
    }

    

      this.timeElapsed = 0; //untuk mulai menu favorit saat timer over 00:00 19/06/25
      if (this.timerText) this.timerText.setText("00:00"); 
      // 1. Reset semua puzzle ke grid kiri, sembunyikan puzzle
      for (let i = 0; i < 10; i++) {
        let piece = this.puzzlePieces[i];
        piece.setVisible(false);
        this.puzzlePieceNumbers[i].setVisible(false);
      }


      // 2. Panel favorit muncul air
      this.showFavoritPanel();

      //Reset semua slot kanan
      this.rightBoardSlots = Array(10).fill(null);
      // 2. Puzzle berubah jadi Black Horse utuh & animasi keliling grid kiri
      // this.transformPuzzleToHorse();

      // 3. Tampilkan gambar Game Over di tengah layar
     // if (this.gameOverImg) this.gameOverImg.destroy();
     // this.gameOverImg = this.add.image(960, 400, 'gameOver')
       // .setOrigin(0.5)
       // .setDepth(200)
       // .setScale(0.7);
      
      // Emergency fix - paste in console:
console.log('🔧 Fixing showGameOver function...');
// Simple air destruction - paste in console:
console.log('💧 Destroying air above horse...');

if (window.game && window.game.scene) {
  const level01 = window.game.scene.getScene('Level01Scene');
  
  if (level01) {
    // Override showGameOver function with score check
    level01.showGameOver = function() {
      // ✅ CHECK SCORE FIRST
      if ((this.score || 0) > 0) {
        console.log(`✅ Score ${this.score} > 0 - Game Over NOT shown`);
        
        // ✅ DESTROY AIR DI KEPALA if exists
        if (level01 && level01.score > 0) {
        // Destroy air above horse if player has score
        if (this.currentAboveHorse) {
          this.currentAboveHorse.destroy();
          this.currentAboveHorse = null;
          console.log('💧 Air above horse destroyed - Player has score');
        }
      } 
        return; // Don't show Game Over if player has score
      }
      
      console.log(`💀 Score ${this.score} <= 0 - Showing Game Over`);
      
      // ✅ DESTROY AIR DI KEPALA BEFORE SHOW GAME OVER
      if (this.currentAboveHorse) {
        this.currentAboveHorse.destroy();
        this.currentAboveHorse = null;
        console.log('💧 Air above horse destroyed before Game Over');
      }
      
      // Show Game Over only if score <= 0
      //if (!this.gameOverImg) {
        //this.gameOverImg = this.add.image(960, 400, 'gameOver')
          //.setOrigin(0.5)
          //.setDepth(200)
          //.setScale(0.7);
      //}
      
      // Lock play button
      if (this.playBtn) {
        this.playBtn.disableInteractive();
        this.playBtn.setAlpha(0.5);
      }
    };
    
    // ✅ IMMEDIATE CLEANUP if score > 0
    if (level01.score > 0) {
      // Remove Game Over image
     // if (level01.gameOverImg) {
       // level01.gameOverImg.destroy();
       // level01.gameOverImg = null;
       // console.log('🗑️ Game Over image removed - Player has score');
      //}
      
      // Remove air above horse
      if (level01.currentAboveHorse) {
        level01.currentAboveHorse.destroy();
        level01.currentAboveHorse = null;
        console.log('💧 Air above horse removed - Player has score');
      }
      
      // Restore play button
      if (level01.playBtn) {
        level01.playBtn.setInteractive();
        level01.playBtn.setAlpha(1);
      }
    }
    
    console.log('✅ showGameOver function fixed');
  }
}

          // 4. Nonaktifkan tombol Play ---> Aktifkan kembali jika ada favorit aktif
      //if (this.playBtn) {
      //this.playBtn.disableInteractive();
         //this.playBtn.setInteractive({ useHandCursor: true }); //sudah non aktif duluan
      //this.playBtn.setAlpha(0.5); // opsional, biar kelihatan tidak aktif
      //}

      // 5. Not music diaktifkan (Tambahkan kode ini agar not musik bisa di klik lagi setelah Game Over)
      if (this.musicNotes) {
        this.musicNotes.forEach(note => note.setInteractive({ useHandCursor: true }));
      }

      // Tampilkan panel air HANYA jika belum ada favorit aktif
      if (!this.isFavMusicActive && !this.isFavoritActive) {
        this.time.delayedCall(1500, () => {
          this.showFavoritPanel();
        });         
      }
      return; 
    }


    this.order = Phaser.Utils.Array.NumberArray(0, 9);
    Phaser.Utils.Array.Shuffle(this.order);

    for (let i = 0; i < 10; i++) {
      let piece = this.puzzlePieces[this.order[i]];
      let gridIdx = this.order[i];
      piece.x = this.puzzlePositions[gridIdx].x;
      piece.y = this.puzzlePositions[gridIdx].y;
      piece.setAlpha(0.01);
      piece.setVisible(true);
      piece.setInteractive();
      piece.setData('gridIdx', gridIdx);

      this.puzzlePieceNumbers[i].x = this.puzzlePositions[gridIdx].x;
      this.puzzlePieceNumbers[i].y = this.puzzlePositions[gridIdx].y;
      this.puzzlePieceNumbers[i].setAlpha(0.01);
      this.puzzlePieceNumbers[i].setVisible(true);
    }
  }

  // ...fungsi-fungsi lain...
  // Mengeleng kepala
  showHorseShakeHead() {
    const frames = [ 'bhGeleng2', 'bhGeleng3', 'bhGeleng1', 'bhGeleng2', 'bhGeleng3', 'bhGeleng1', 'bhGeleng2'];
    let idx = 2;
    this.time.addEvent({
      repeat: frames.length - 1,
      delay: 90,
      callback: () => {
        this.bhHead.setTexture(frames[idx]);
        idx++;
      }
    });
  }

  // Mengangguk kepala
  showHorseNodHead() {
    // Sembunyikan bhHead (geleng) saat angguk
    if (this.bhHead) this.bhHead.setVisible(false);
    if (this.bhAngguk2) this.bhAngguk2.setVisible(true);

    const frames = ['bhAngguk1', 'bhAngguk2', 'bhAngguk3', 'bhAngguk2', 'bhAngguk1'];
    let idx = 0;
    let nodAnim = this.time.addEvent({
      repeat: frames.length - 2,
      delay: 120,
      callback: () => {
        this.bhAngguk2.setTexture(frames[idx]);
        //this.bhHead.setTexture(frames[idx]);
        idx++;
        // Setelah selesai, kembalikan ke geleng
        if (idx === frames.length) {
          if (this.bhHead) this.bhHead.setVisible(true);
          if (this.bhAngguk2) this.bhAngguk2.setVisible(false);
        }
      }
    });
  }


  showRoundMessage(msg) {
    if (this.roundMsgText) this.roundMsgText.destroy();
    this.roundMsgText = this.add.text(960, 200, msg, {
      font: "bold 120px Orbitron, Arial, sans-serif", // ukuran besar dan font benar
      fill: "#00eaff",
      stroke: "#fff",
      strokeThickness: 8,
      align: "center",
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#00eaff",
        blur: 32,
        fill: true
      }
    })
      .setOrigin(0.5)
      .setDepth(200)
      .setAlpha(0.95)
      .setScale(0.1);

    this.tweens.add({
      targets: this.roundMsgText,
      scale: 1,
      duration: 900,
      ease: 'Back.Out'
    });

    this.time.delayedCall(4000, () => {
      if (this.roundMsgText) this.roundMsgText.destroy();
    });
  }

// Fungsi pesan kecil di atas not music
showHoldMessageAboveNotes() {
  // Misal, not music pertama di posisi (1100, 1100)
  const x = 855; // rata tengah 3 not
  const y = 1000; // di atas not music

  // Hapus pesan lama jika ada
  if (this.holdMsgText) this.holdMsgText.destroy();

  // Tampilkan pesan kecil
  this.holdMsgText = this.add.text(x, y, "Please Hold... The Game is running", {
    font: "bold 32px Arial",
    fill: "#fff",
   backgroundColor: "#e00",
    padding: { left: 16, right: 16, top: 4, bottom: 4 }
  }).setOrigin(0.5).setDepth(5001);

  // Hilang otomatis setelah 1.2 detik
  this.time.delayedCall(1200, () => {
    if (this.holdMsgText) this.holdMsgText.destroy();
  });
}

  showFavoritPanel() {

    if (this.currentAboveHorse) {
      this.currentAboveHorse.destroy();
      this.currentAboveHorse = null;
    }


    //--------------------------------------------------------
    // Tampilkan gambar air besar di atas kepala Black Horse
    this.currentAboveHorse = this.add.image(150, 100, 'water2')
      .setScale(0.8)
      .setDepth(102)
      .setInteractive();
    //--------------------------------------------------------

    // --- Animasi Favorit ---
    // Jika air diklik, tampilkan dialog pembayaran
    this.currentAboveHorse.on('pointerdown', () => {
      // Tampilkan dialog pembayaran
      if (this.payPanel) this.payPanel.destroy();
      this.payPanel = this.add.rectangle(640, 360, 400, 200, 0x23283a, 0.96)
        .setStrokeStyle(3, 0x00eaff).setDepth(200);
      this.payText = this.add.text(640, 320, "Buy Water for Black Horse?\nClick PAY to continue!", {
        font: "bold 32px Segoe UI",
        fill: "#fff",
        align: "center"
      }).setOrigin(0.5).setDepth(201);

      this.showFavoritMenuBar(); // <-- panggil method di sini 

      // Not musik menari
      this.animateMusicNotes();

      payBtn.on('pointerdown', () => {
        // Destroysemua elemen panel favorit
        if (this.payPanel) this.payPanel.destroy();
        if (this.payText) this.payText.destroy();
        if (this.favoritPanelGroup) this.favoritPanelGroup.clear(true, true); // jika pakai group
        payBtn.destroy();
        if (this.currentAboveHorse) {
          this.currentAboveHorse.destroy();
          this.currentAboveHorse = null;
        }
        this.isFavoritActive = false;
        this.round = 1;
        if (this.horseGallop) this.horseGallop.stop();
        // Aktifkan kembali puzzle
        this.puzzlePieces.forEach(piece => piece.setInteractive());
        // Aktifkan kembali not musik
        if (this.musicNotes) {
          this.musicNotes.forEach(note => note.setInteractive({ useHandCursor: true }));
        }

        // Aktifkan kembali tombol Play setelah beli favorit
        if (this.playBtn) {
          this.playBtn.setInteractive({ useHandCursor: true });
          this.playBtn.setAlpha(1);
        }


        // Animasi angguk kepala
        this.showHorseNodHead();

        // === Tambahkan ini jika ingin langsung buka panel musik setelah favorit ===
        this.showMusicPanel();
      });
    });
  }


  musicTitles = [
    //"Beautiful Sunset",
   // "Drippy Cowboy Country Rnbsuno",
    "Easy Country Music Intro Outro",
    "Golden Sunset Piano",
    "Horsepower",
    "Musique West Cowboy",
    "Old West",
   // "Relaxing Green Nature",
   // "Starlit Serenade",
   // "Sunset Dreams"
  ];

  // Tambahkan ini di bawahnya:
  musicKeys = [
  'musicfav03',
  'musicfav04',
  'musicfav05',
  'musicfav06',
  'musicfav07'
  ];

  showMusicPanel() {
    // Pastikan status favorit tidak aktif agar tombol bisa di klik
    this.isFavoritActive = false;

    // --- Tambahkan ini untuk menutup panel pembayaran favorit ---
    if (this.payPanel) this.payPanel.destroy();
    if (this.payText) this.payText.destroy();
    if (this.payQR) this.payQR.destroy();
    //Jika ada tombol PAY/CANCEL global, tambahkan destroy juga:
     if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; }
     if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; } 

    // Hapus panel lama jika ada
    if (this.musicPanelGroup) {
      this.musicPanelGroup.clear(true, true);
      this.musicPanelGroup = null;
    }
    this.musicPanelGroup = this.add.group();

    // Panel background
    const panelBg = this.add.rectangle(1202, 430, 1399, 600, 0x23283a, 0.8)
      .setStrokeStyle(3, 0x00eaff)
      .setDepth(1000);
    this.musicPanelGroup.add(panelBg);

    // Judul
    const panelTitle = this.add.text(1140, 250, "Choose Your Favorite Music", {
      font: "bold 90px Imprint MT Shadow, serif",
      align: "center",
      fill: "#fff"
    }).setOrigin(0.5).setDepth(1001);
    this.musicPanelGroup.add(panelTitle);

    // Daftar tombol music (5 baris)
    for (let i = 1; i <= 5; i++) {
      //let y = 420 + i * 35;
      let y = 360 + (i - 1) * 65; // spacing antar baris
      //let btn = this.add.text(800, y, `Music ${i}`, {
      let musicTitle = this.musicTitles[i - 1] || `Music ${i}`;
      let btn = this.add.text(568, y, musicTitle, {
        fontFamily: '"Imprint MT Shadow", serif',
        font: "bold 52px Imprint MT Shadow, serif",
        fill: "#fff",
        backgroundColor: "rgba(0,0,0,0)",// transparan
        padding: { left: 18, right: 18, top: 8, bottom: 8 }
      })
        .setOrigin(0, 0.5)
        .setDepth(1001)
        .setInteractive({ useHandCursor: true });
      this.musicPanelGroup.add(btn);

      // Tombol Buy $2
      let buyBtn = this.add.text(1650, y, "BUY $2", {
        fontFamily: '"Imprint MT Shadow", serif',
        font: "bold 48px Imprint MT Shadow, serif",
        fill: "#fff",
        backgroundColor: "rgba(0,0,0,0)", // transparan
        padding: { left: 10, right: 10, top: 8, bottom: 8 }
      })
        .setOrigin(0, 0.5)
        .setDepth(1001)
        .setInteractive({ useHandCursor: true });
      this.musicPanelGroup.add(buyBtn);

      // ========== TAX PREVIEW ON HOVER (NO ASYNC CONFLICT) ==========
       buyBtn.on('pointerover', () => {
       // Call tax preview WITHOUT making this function async
       //this.showTaxPreviewForMusic(musicTitle, 1650, y - 50);
       if (this.taxPreviewText) {
       this.taxPreviewText.destroy();
        this.taxPreviewText = null;
     }
      // Show instant static tax calculation
           const baseAmount = 2.00;
           const taxRate = 11.0; // FIXED 11% Indonesia
           const taxAmount = (baseAmount * taxRate / 100);
           const totalAmount = baseAmount + taxAmount;
        //const country = this.userCountry || 'ID';
        // const taxRate = taxRates[country] || taxRates['default'];

        // Tax rates by country
        //const taxRates = {
          //'US': 8.5,   'CA': 12.0,  'GB': 20.0,  'DE': 19.0,  
          //'FR': 20.0,  'AU': 10.0,  'ID': 11.0,  'IT': 22.0,  
          //'ES': 21.0,  'NL': 21.0,  'default': 0
        //};
        
        // Show instant preview
        // Show sticky tax preview (cyan color only, no yellow update)
        // Show clean tax preview (CYAN ONLY - no color changes)
        this.taxPreviewText = this.add.text(1650, y - 50, 
          `${musicTitle}\n` +
          `Base: $${baseAmount.toFixed(2)}\n` +
          `Tax ID (${taxRate}%): $${taxAmount.toFixed(2)}\n` +
          `Total: $${totalAmount.toFixed(2)}`, {
          font: "bold 30px Imprint MT Shadow, serif", 
          fill: "#00eaff", // cyan color
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          align: "center"
        }).setOrigin(0.5).setDepth(1002);
        

        // Store tax info for confirmation panel
        this.currentTaxInfo = {
          musicTitle: musicTitle,
          baseAmount: baseAmount.toFixed(2),
          taxRate: taxRate,
          taxAmount: taxAmount,//toFixed(2),
          totalAmount: totalAmount, //toFixed(2)
          country: 'ID'
        };

        // Update with real calculation in background (no blocking)
       // this.updateTaxInBackground(musicTitle, 1650, y - 50);
     });

          // Add mouse out handler to hide preview
      //buyBtn.on('pointerout', () => {
        //if (this.taxPreviewText) {
          //this.taxPreviewText.destroy();
          //this.taxPreviewText = null;
        //}
        //});
      //});

     
    
//-------------------------------------------------------------------------------------------------------------
      //btn.on('pointerdown', () => { // BAGIAN INI DI TAMBAH BIASANYA TIDAK BISA KLIK NOT MUSIC 05/06 10:10 AM
      // Handler konfirmasi (YES/NO & pembayaran)
      const showConfirm = () => {
        // Remove previous confirmation panel if any
        if (this.confirmPanel) this.confirmPanel.destroy();
        if (this.confirmText) this.confirmText.destroy();
        if (this.confirmYes) this.confirmYes.destroy();
        if (this.confirmNo) this.confirmNo.destroy();

        // Hide tax preview when confirmation shows
        if (this.taxPreviewText) {
        this.taxPreviewText.destroy();
        this.taxPreviewText = null;
     }

        // Use stored tax info for consistency (from hover)
        //let baseAmount, taxRate, taxAmount, totalAmount;

        // ✅ ALWAYS use Indonesia tax (consistent with hover)
        let baseAmount = 2.00;
        let taxRate = 11.0; // FIXED Indonesia 11%
        let taxAmount = (baseAmount * taxRate / 100);
        let totalAmount = baseAmount + taxAmount;
        
        if (this.currentTaxInfo) {
            // Use consistent tax info from hover
          baseAmount = parseFloat(this.currentTaxInfo.baseAmount);
          taxRate = this.currentTaxInfo.taxRate;
          taxAmount = this.currentTaxInfo.taxAmount;
          totalAmount = this.currentTaxInfo.totalAmount;
        } 

         // Get current tax info (from hover or calculate fresh)
         // Fallback calculation if no stored info
        //baseAmount = 2.00;
        //taxRate = 11.0; // FIXED Indonesia 11%
        //taxAmount = (baseAmount * taxRate / 100);
        //totalAmount = baseAmount + taxAmount;
        //const country = this.userCountry || 'ID';
        //const taxRates = {
          //'US': 8.5, 'CA': 12.0, 'GB': 20.0, 'DE': 19.0,
          //'FR': 20.0, 'AU': 10.0, 'ID': 11.0, 'IT': 22.0,
          //'ES': 21.0, 'NL': 21.0, 'default': 0
        //};
        //taxRate = taxRates[country] || taxRates['default'];
        //}

        // Show confirmation panel
        this.confirmPanel = this.add.rectangle(1200, 700, 900, 600, 0x0adcf5, 1)
          .setDepth(2001);
        //this.confirmText = this.add.text(1200, 660, `Are you sure you want to choose "${musicTitle}" for Black Horse?`, {
          //font: "bold 40px Segoe UI",
          //fill: "#00000",
          //align: "center",
          //wordWrap: { width: 700 }
        //}).setOrigin(0.5).setDepth(2002);

         
         // SINGLE confirmation text (no doubles) 
        this.confirmText = this.add.text(1200, 650, 
          //`Are you sure you want to choose "${musicTitle}" for Black Horse?\n\n` +
          `💰 Payment Details:\n` +
          `Music: ${musicTitle}\n` +
          `Base Price: $${baseAmount.toFixed(2)}\n` +
          `Tax (${taxRate}%): $${taxAmount.toFixed(2)}\n` +
          `Total Amount: $${totalAmount.toFixed(2)}`, {
          font: "bold 52px Imprint MT Shadow, serif",
          fill: "#00000",
          align: "center",
          wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(2002);

        // YES button (positioned lower due to larger panel)
        this.confirmYes = this.add.text(1350, 920, "YES", {
          font: "bold 60px Imprint MT Shadow, serif",
          fill: "#00000",
          //backgroundColor: "#181c24",
          padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setDepth(2002).setInteractive();

        // NO button
        this.confirmNo = this.add.text(1050, 920, "NO", {
          font: "bold 60px Imprint MT Shadow, serif",
          fill: "#00000",
          //backgroundColor: "#181c24",
          padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setDepth(2002).setInteractive();

        // Hide tax preview when confirmation shows
        if (this.taxPreviewText) {
          this.taxPreviewText.destroy();
          this.taxPreviewText = null;
        }

        
        // Handler YES
        this.confirmYes.on('pointerdown', () => {
          // Remove confirmation panel
          this.confirmPanel.destroy(); 
          this.confirmText.destroy();
          this.confirmYes.destroy(); 
          this.confirmNo.destroy();

           // Continue to payment with consistent tax info
          this.showPaymentPanel(musicTitle, baseAmount, taxRate, taxAmount, totalAmount, i);
          });

           // Handler NO
           this.confirmNo.on('pointerdown', () => { // Tamabah 08/06/25 ---> INI ADA
          // Hapus panel konfirmasi saja, biarkan panel musik tetap terbuka
          this.confirmPanel.destroy(); 
          this.confirmText.destroy();
          this.confirmYes.destroy(); 
          this.confirmNo.destroy();
        });
      }
        
        btn.on('pointerdown', showConfirm); // Panggil fungsi konfirmasi saat tombol diklik
        buyBtn.on('pointerdown', showConfirm); // Panggil fungsi konfirmasi saat tombol Buy diklik
      }
        
      // Tombol close panel
      let closeBtn = this.add.text(1770, 250, "X", {
      font: "bold 100px Arial",
      fill: "#fff",
      backgroundColor: "#e00",
      padding: { left: 10, right: 10, top: 2, bottom: 2 }
      }).setOrigin(0.5).setDepth(1001).setInteractive({ useHandCursor: true });
      this.musicPanelGroup.add(closeBtn);

      closeBtn.on('pointerdown', () => {
      if (this.musicPanelGroup) {
      this.musicPanelGroup.clear(true, true);
      this.musicPanelGroup = null;
      }
      // Hapus tax preview jika ada
      if (this.taxPreviewText) {
        this.taxPreviewText.destroy();
        this.taxPreviewText = null;
      }
      // Hapus panel konfirmasi jika ada
      if (this.confirmPanel) {
        this.confirmPanel.destroy();
        this.confirmPanel = null;
      }
      if (this.confirmText) {
        this.confirmText.destroy();
        this.confirmText = null;
      } 
      if (this.confirmYes) {
        this.confirmYes.destroy();
        this.confirmYes = null;
      }
      if (this.confirmNo) {
        this.confirmNo.destroy();
        this.confirmNo = null;
      }  
      // Hapus panel pembayaran jika ada
      if (this.payPanel) {
        this.payPanel.destroy();
        this.payPanel = null;
      }
      if (this.payText) {
        this.payText.destroy();
        this.payText = null;
      }
      if (this.payQR) {
        this.payQR.destroy();
        this.payQR = null;
      }
       if (this.payBtn) {
        this.payBtn.destroy();
        this.payBtn = null;
      }
      if (this.cancelBtn) { 
        this.cancelBtn.destroy();
        this.cancelBtn = null;
      }
    });
  }


         // Definisikan ShowPaymentPanel (Tutup panel daftar music sebelum tampilkan panel pembayaran)
         // const showPaymentPanel = () => { //menyebabkan penel bayar tidak muncul
            // Tutup panel musik sebelum tampilkan panel pembayaran
            showPaymentPanel(musicTitle, baseAmount, taxRate, taxAmount, totalAmount, musicIndex) {
            // Close music panel
            if (this.musicPanelGroup) {
              this.musicPanelGroup.clear(true, true);
              this.musicPanelGroup = null;
            }
            

            // Panel pembayaran
            if (this.payPanel) this.payPanel.destroy();
            // QR code dihapus setelah pembayaran (diletakan di buyBtn dan payBtn)
            if (this.payQR) this.payQR.destroy(); // Hapus QR code jika ada
            if (this.payText) this.payText.destroy();// tambah 08/06/25
            if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; } // tambahan
            if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; } //tambahan


            // Panel Background
            this.payPanel = this.add.rectangle(1050, 400, 1300, 400, 0x23283a, 0.8)
              .setStrokeStyle(3, 0x00eaff).setDepth(400);

            // Bagian Konfirmasi In YES handler, update payment panel text:
            this.payText = this.add.text(1050, 350, // "Confirm payment for this music?\nClick PAY to continue!", {
             `Confirm payment for ${musicTitle}?\n` +
             `Total: $${totalAmount.toFixed(2)} (incl. ${taxRate}% tax)\n` +
             `Click PAY to continue!`, { 
              font: "bold 48px Imprint MT Shadow, serif",
              fill: "#fff",
              align: "center"
            }).setOrigin(0.5).setDepth(401);

            // === Tampilkan QR code di panel pembayaran === //---> INI ADA
            this.payQR = this.add.image(1050, 770, 'paypalQR')
              .setScale(1.2)
              .setDepth(402);
           
              // PAY button
            this.payBtn = this.add.text(1280, 500, "PAY", { // ---> INI ADA
              font: "bold 60px Imprint MT Shadow, serif",
              fill: "#00eaff",
              //backgroundColor: "#181c24",
              padding: { left: 30, right: 30, top: 10, bottom: 10 }
            }).setOrigin(0.5).setDepth(401).setInteractive();

            // Tombol CANCEL
            this.cancelBtn = this.add.text(850, 500, "CANCEL", {
              font: "bold 54px Imprint MT Shadow, serif",
              fill: "#fff",
              //backgroundColor: "#e00",
              padding: { left: 18, right: 18, top: 8, bottom: 8 }
            }).setOrigin(0.5).setDepth(2004).setInteractive();

            // Action Cancel (Cancel Handler)
            this.cancelBtn.on('pointerdown', () => {
              if (this.payPanel) { this.payPanel.destroy(); this.payPanel = null; }
              if (this.payText) { this.payText.destroy(); this.payText = null; }
              if (this.payQR) { this.payQR.destroy(); this.payQR = null; }
              if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; }
              if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; }
              });

            
            this.payBtn.on('pointerdown', () => { // ---> INI ADA
             // account ini untuk donasi
             // window.open('https://www.paypal.com/ncp/payment/7MARDZW8BDWVG', '_blank'); //ini tanpa harga dan tanpa variant 
             // PAY handler with dynamic PayPal amount
             window.open('https://www.paypal.com/ncp/payment/ZVFL3ND789CVE');
             //window.open('https://your-xsolla-link', '_blank');  // belum selesai paystationnya
             this.showWaitingForPaymentMessage();
             
              // Polling ke backend setiap beberapa detik
              this.paymentCheckInterval = setInterval(async () => {
              const paid = await checkPaymentStatusFromBackend(email);
              if (paid) {
              clearInterval(this.paymentCheckInterval);
              // ✅ UNLOCK GAME AFTER PURCHASE:
              this.unlockGameAfterPurchase();
              // PANGGIL UNLOCK LEVEL DI SINI
              const email = localStorage.getItem('playerEmail');
              const unlocked = await unlockLevel(email, 'Level01Scene');
              if (unlocked) {
              // Reset localStorage gameData user
              const resetData = {
              playCount: 0,
              isGameOver: false,
              score: 0
              };
              localStorage.setItem(`gameData-${email}`, JSON.stringify(resetData));
              alert('Level successfully unlocked. Enjoy playing again!');
              this.unblur10PuzzleButton();
              this.unlockGameAfterPurchase();
              window.unlockPlayAndHideGameOver && window.unlockPlayAndHideGameOver();
              location.reload();
              //} else {
              //alert('Gagal membuka level. Silakan hubungi admin.');           
              }
            }
           }, 3000);
            
       
  
              // Setelah pembayaran sukses:
              // ✅ Rest of payment handling code continues...
              if (this.payPanel) this.payPanel.destroy();
              if (this.payText) this.payText.destroy();
              // QR code dihapus setelah pembayaran
              if (this.payQR) this.payQR.destroy(); // <--- LETAKKAN DI SINI JIKA ADA QR
              this.payBtn.destroy();
              this.cancelBtn.destroy();

             // Stop all music before playing new favorite music // === LETAKKAN KODE INI DI SINI ===
               if (this.currentFavMusic && this.currentFavMusic.isPlaying) this.currentFavMusic.stop();
               if (this.mainMusic && this.mainMusic.isPlaying) this.mainMusic.stop();
               if (this.winMusic && this.winMusic.isPlaying) this.winMusic.stop();
              


              //------------------------------------------------------------
              // untuk mengembalikan timer ke no saat balik ke scene setelah beli favorit
              // Reset timer ke 00:00
              this.timeElapsed = 0;
              this.timerText.setText("00:00");

              // Simpan waktu favorit yang dibeli
              this.favoritTimeToAdd = 61; // contoh: 60 detik
              this.favoritLabelToAdd = musicTitle;
              //-------------------------------------------------------------


              // === Aktif Play kembali ===
              if (this.playBtn) {
                this.playBtn.setInteractive({ useHandCursor: true });
                this.playBtn.setAlpha(1);
              }
              // tamabahan ini 290625
              // Play selected favorite music
              const key = this.musicKeys[musicIndex - 1];
              this.currentFavMusic = this.sound.add(key, { loop: true });
              this.currentFavMusic.play();
              this.isFavMusicActive = true;


              // Efek animasi angguk kepala
              this.time.delayedCall(5000, () => {
                this.showHorseNodHead();
                this.sound.play('horseNeigh');
              });

              // === Tambahkan kode ini agar gambar air di kepala hilang setelah beli musik ===
              if (this.currentAboveHorse) {
                this.currentAboveHorse.destroy();
                this.currentAboveHorse = null;
              }
            });
          }

  // mengatur waktu favorit yang dibeli dan muncul text countdown
  addFavoritTimeToMainTimer(seconds, label) {
    // Hentikan timer ronde sebelumnya jika ada
    if (this.roundTimer) {
      this.roundTimer.remove(false);
      this.roundTimer = null;
    }

    // Set timer ke waktu favorit
    this.timeElapsed = 0;
    this.timerText.setText("00:00");

    // Mulai timer baru dengan waktu favorit
    let timeLimit = seconds;
    this.roundTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeElapsed++;
        let min = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
        let sec = (this.timeElapsed % 60).toString().padStart(2, '0');
        this.timerText.setText(`${min}:${sec}`);

        if (this.timeElapsed >= timeLimit) {
          this.roundTimer.remove(false);
          this.onTimeUp();
        }
      },
      callbackScope: this,
      loop: true
    });
 }
  //-------------------------------------------------------------
  // showFavoritPayPanel untuk 4 macam menu slain music favorit
  showFavoritPayPanel(label, seconds, price, btnRef) {
     // Pastikan status favorit tidak aktif agar tombol bisa di klik
    this.isFavoritActive = false;

  // Tutup panel musik jika masih terbuka
  if (this.musicPanelGroup) {
  this.musicPanelGroup.clear(true, true);
  this.musicPanelGroup = null;
  }
  // Tutup konfirmasi YES/NO pada music panel jika masih ada
  if (this.confirmPanel) this.confirmPanel.destroy();
  if (this.confirmText) this.confirmText.destroy();
  if (this.confirmYes) this.confirmYes.destroy();
  if (this.confirmNo) this.confirmNo.destroy();

      // Buka panel/menu lain
   //this.showFavoritPayPanel();

    // Hapus panel pembayaran lama jika ada
    if (this.payPanel) { this.payPanel.destroy(); this.payPanel = null; }
    if (this.payText) { this.payText.destroy(); this.payText = null; }
    if (this.payQR) { this.payQR.destroy(); this.payQR = null; }
    if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; }
    if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; }

    // Hapus gambar Game Over jika ada
    if (this.gameOverImg) {
      this.gameOverImg.destroy();
      this.gameOverImg = null;
    }

    // === KALKULASI TAX UNTUK MENU FAVORIT ===
    const baseAmount = price; // Gunakan price sebagai base amount
    const taxRate = 11.0; // Indonesia tax rate 11%
    const taxAmount = (baseAmount * taxRate / 100);
    const totalAmount = baseAmount + taxAmount;
 

    // Panel background
    this.payPanel = this.add.rectangle(850, 350, 800, 450, 0x23283a, 0.8)
      .setStrokeStyle(3, 0x00eaff).setDepth(2001);

    // Teks pembayaran
    this.payText = this.add.text(850, 310, 
    `Buy ${label}?\n` +
    `+${seconds-1}s gaming time\n` +
    `Base: $${baseAmount.toFixed(2)} | Tax (${taxRate}%): $${taxAmount.toFixed(2)}\n` +
    `Total: $${totalAmount.toFixed(2)}\n` +
    `Click PAY to continue!`, {
      font: "bold 48px Imprint MT Shadow, serif",
      fill: "#fff",
      align: "center"
    }).setOrigin(0.5).setDepth(2002);

    // QR code/paypal
    this.payQR = this.add.image(850, 750, 'paypalQR').setScale(1).setDepth(2003);

    // Tombol PAY
      this.payBtn = this.add.text(1050, 510, `PAY $${totalAmount.toFixed(2)}`, {
      font: "bold 48px Imprint MT Shadow, serif",
      fill: "#00eaff",
      //backgroundColor: "#181c24",
      padding: { left: 30, right: 30, top: 10, bottom: 10 }
    }).setOrigin(0.5).setDepth(2004).setInteractive();

    // Tombol CANCEL
    this.cancelBtn = this.add.text(650, 510, "CANCEL", {
      font: "bold 48px Imprint MT Shadow, serif",
      fill: "#fff",
      //backgroundColor: "#e00",
      padding: { left: 18, right: 18, top: 8, bottom: 8 }
    }).setOrigin(0.5).setDepth(2004).setInteractive();

    // Action Cancel
   this.cancelBtn.on('pointerdown', () => {
      if (this.payPanel) { this.payPanel.destroy(); this.payPanel = null; }
      if (this.payText) { this.payText.destroy(); this.payText = null; }
      if (this.payQR) { this.payQR.destroy(); this.payQR = null; }
      if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; }
      if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; }
      // Tidak ada perubahan timer, tidak lanjut proses
    });


    // Handler pembayaran
    this.payBtn.on('pointerdown', () => { // ---> INI ADA
             // account ini untuk donasi
             // window.open('https://www.paypal.com/ncp/payment/7MARDZW8BDWVG', '_blank'); //ini tanpa harga dan tanpa variant 
             // PAY handler with dynamic PayPal amount
             window.open('https://www.paypal.com/ncp/payment/ZVFL3ND789CVE');
             //window.open('https://your-xsolla-link', '_blank');  // belum selesai paystationnya
             this.showWaitingForPaymentMessage();
             
              // Polling ke backend setiap beberapa detik
              this.paymentCheckInterval = setInterval(async () => {
              const paid = await checkPaymentStatusFromBackend(email);
              if (paid) {
              clearInterval(this.paymentCheckInterval);
              this.handlePaymentSuccess(); 
              // ✅ UNLOCK GAME AFTER PURCHASE:
              if (this.isPaid) {
              this.unlockGameAfterPurchase();
              // PANGGIL UNLOCK LEVEL DI SINI
              const email = localStorage.getItem('playerEmail');
              const unlocked = await unlockLevel(email, 'Level01Scene');
              if (unlocked) {
              // Reset localStorage gameData user
              const resetData = {
              playCount: 0,
              isGameOver: false,
              score: 0
              };
              localStorage.setItem(`gameData-${email}`, JSON.stringify(resetData));
              alert('Level successfully unlocked. Enjoy playing again!');
              this.unblur10PuzzleButton();
              this.unlockGameAfterPurchase();
              window.unlockPlayAndHideGameOver && window.unlockPlayAndHideGameOver();
              location.reload();
              //} else {
              //alert('Gagal membuka level. Silakan hubungi admin.');           
              }
            }
          }
        }, 3000);
      
            
      // Setelah pembayaran sukses:
      if (this.payPanel) this.payPanel.destroy();
      if (this.payText) this.payText.destroy();
      if (this.payQR) this.payQR.destroy();
      this.payBtn.destroy();
      this.cancelBtn.destroy();
      
      this.favoritTimeToAdd = seconds; // 13/06/25
      this.favoritLabelToAdd = label; // 13/06/25

      // Tambah waktu ke timer utama
      //this.addFavoritTimeToMainTimer(seconds, label);

      // Reset timer di UI (jika perlu)
      this.timeElapsed = 0;
      if (this.timerText) this.timerText.setText("00:00");

      
      // Aktifkan tombol Play
      if (this.playBtn) {
        this.playBtn.setInteractive({ useHandCursor: true });
        this.playBtn.setAlpha(1);
      }


      // Jika menu favorit yang dibeli BUKAN music, mainkan musik latar Sunset Dreams
      if (label !== "Music" && label !== "music" && this.mainMusic) {
        if (this.currentFavMusic && this.currentFavMusic.isPlaying) this.currentFavMusic.stop();
        if (this.mainMusic && !this.mainMusic.isPlaying) {
          this.mainMusic.play({ loop: true });
        }
      }

    });

    // Efek animasi angguk kepala
    this.time.delayedCall(5000, () => {
      this.showHorseNodHead();
      this.sound.play('horseNeigh');
    });

    // === Tambahkan ini agar gambar air di kepala hilang setelah beli favorit ===
    if (this.currentAboveHorse) {
      this.currentAboveHorse.destroy();
      this.currentAboveHorse = null;
    }

    // (Opsional) Efek visual pada tombol yang dibeli
    if (btnRef) {
      this.tweens.add({
        targets: btnRef,
        scale: btnRef.scale * 1.2,
        duration: 150,
        yoyo: true
      });
    }
  }
  //-------------------------------------------------------------
 // showWaitingForPaymentMessage untuk menampilkan pesan "Please wait confirmation your payment..." jika pembayaran sedang diproses
  showWaitingForPaymentMessage() {
   if (
  !this.isPaid &&
  history.hasPlayedBefore &&
  (history.totalGamesPlayed || 0) >= 3 &&
  score === 0
) { 
  // Kunci tombol Play & 10 Puzzle
  if (this.playBtn) {
    this.playBtn.disableInteractive();
    this.playBtn.setAlpha(0.5);
  }
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.disableInteractive();
    this.lv01Puzzle10Btn.setAlpha(0.5);
  }
  // Tampilkan pesan "Game Lock - Unlock with Black Horse's favorite menu"
  if (this.waitingMsg) this.waitingMsg.destroy();
  this.waitingMsg = this.add.text(960, 700, "Game Lock - Unlock with Black Horse's favorite menu", {
  font: "bold 36px Segoe UI",
  fill: "#fff",
  backgroundColor: "#023d3f",
  padding: { left: 30, right: 30, top: 10, bottom: 10 }
  }).setOrigin(0.5).setDepth(5001);
  // Hilang otomatis setelah 2 detik (opsional)
  this.time.delayedCall(2000, () => {
  if (this.waitingMsg) this.waitingMsg.destroy();
  this.waitingMsg = null;
  });
  }
}
//-----------------------------------------------------------------
async checkUnlockStatus(email) {
  try {
    const res = await axios.post("https://arselco.com/api/set-gameover", { email, isGameOver: false }); // minta unlock
    const data = res.data;
    if (data.unlocked) {
      this.unlockGameAfterPurchase();  // ✅ gunakan fungsi kamu
    } else {
      this.showGameOverReturnMessage();  // ✅ tetap pakai fungsi kamu
    }
  } catch (err) {
    console.error("Error unlock:", err);
    this.showGameOverReturnMessage();
  }
}
//----------------------------------------------------------------------
  showFavoritMenuBar() {
    // Hapus menu lama jika ada
    if (this.favoritMenuGroup) this.favoritMenuGroup.clear(true, true);
    this.favoritMenuGroup = this.add.group();

    // --- AIR ---
    let airFrames = ['water1', 'water2', 'water3'];
    let airIdx = 0, airTween = null;
    let airBtn = this.add.image(600, 1150, airFrames[0]).setScale(0.3).setInteractive({ useHandCursor: true });
    this.favoritMenuGroup.add(airBtn);

    airBtn.on('pointerover', () => {
      airTween = this.time.addEvent({
        delay: 200, loop: true, callback: () => {
          airIdx = (airIdx + 1) % airFrames.length;
          airBtn.setTexture(airFrames[airIdx]);
        }
      });
    });
    airBtn.on('pointerout', () => { if (airTween) { airTween.remove(); airTween = null; } airBtn.setTexture('water1'); });
    airBtn.on('pointerdown', () => this.showFavoritPayPanel('Air', 30, 1, airBtn));

    // --- RUMPUT ---
    let grassBtn = this.add.image(713, 1109, 'grass').setScale(0.2).setInteractive({ useHandCursor: true });
    this.favoritMenuGroup.add(grassBtn);
    let grassTween = null;
    grassBtn.on('pointerover', () => {
      grassTween = this.tweens.add({
        targets: grassBtn,
        angle: { from: -10, to: 10 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    grassBtn.on('pointerout', () => { if (grassTween) { grassTween.stop(); grassTween = null; } grassBtn.angle = 0; });
    grassBtn.on('pointerdown', () => this.showFavoritPayPanel('Grass', 30, 1, grassBtn));

    // --- WORTEL ---
    let carrotBtn = this.add.image(840, 1150, 'carrot').setScale(0.5).setInteractive({ useHandCursor: true });
    let carrotLeaf = this.add.image(877, 1115, 'carrotL').setScale(0.3).setAlpha(0.7);
    this.favoritMenuGroup.add(carrotBtn);
    this.favoritMenuGroup.add(carrotLeaf);
    let carrotTween = null;
    carrotBtn.on('pointerover', () => {
      carrotTween = this.tweens.add({
        targets: carrotLeaf,
        angle: { from: -20, to: 20 },
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    carrotBtn.on('pointerout', () => { if (carrotTween) { carrotTween.stop(); carrotTween = null; } carrotLeaf.angle = 0; });
    carrotBtn.on('pointerdown', () => this.showFavoritPayPanel('Carrot', 60, 2, carrotBtn));

    // --- APPEL ---
    const appleKeys = ['apple1', 'apple2', 'apple3', 'apple4'];
    let appleIdx = 0, appleTween = null;
    let appleBtn = this.add.image(999, 1150, appleKeys[0]).setScale(0.7).setInteractive({ useHandCursor: true });
    this.favoritMenuGroup.add(appleBtn);
    appleBtn.on('pointerover', () => {
      appleTween = this.time.addEvent({
        delay: 180, loop: true, callback: () => {
          appleIdx = (appleIdx + 1) % appleKeys.length;
          appleBtn.setTexture(appleKeys[appleIdx]);
        }
      });
    });
    appleBtn.on('pointerout', () => { if (appleTween) { appleTween.remove(); appleTween = null; } appleBtn.setTexture('apple1'); });
    appleBtn.on('pointerdown', () => this.showFavoritPayPanel('Appel', 60, 2, appleBtn));
  }

//--------------------------------------------------------------------------------------------------------
// Fungsi ESC --> EXIT
showExitPanelOnly() {
  // Hapus panel lama jika ada
  if (this.exitPanelGroup) {
    this.exitPanelGroup.clear(true, true);
    this.exitPanelGroup = null;
  }
  this.exitPanelGroup = this.add.group();

  // Panel background
  const panel = this.add.rectangle(960, 640, 400, 170, 0x023d3f, 0.98)
    .setStrokeStyle(4, 0xffffff)
    .setDepth(6000);
  this.exitPanelGroup.add(panel);

  // Judul
  const title = this.add.text(960, 600, "Exit Game?", {
    font: "bold 40px Segoe UI",
    fill: "#fff",
    align: "center"
  }).setOrigin(0.5).setDepth(6001);
  this.exitPanelGroup.add(title);

  // Tombol EXIT
  const exitBtn = this.add.text(960, 690, "EXIT", {
    font: "bold 36px Segoe UI",
    fill: "#fff",
    //backgroundColor: "#e00",
    padding: { left: 32, right: 32, top: 12, bottom: 12 }
  }).setOrigin(0.5).setDepth(6001).setInteractive({ useHandCursor: true });
  this.exitPanelGroup.add(exitBtn);

  exitBtn.on('pointerdown', () => {
    this.exitPanelGroup.clear(true, true);
    this.exitPanelGroup = null;
    this.isExitPanelShown = false;
    this.scene.stop('Level01Scene');
    this.scene.start('SplashScene');
  });
}

//======================================================================================================
// Add this function after showFavoritPayPanel (around line 2900): Donation Popup
showDonationPopup() {
  // Close any existing panels first
  if (this.musicPanelGroup) {
    this.musicPanelGroup.clear(true, true);
    this.musicPanelGroup = null;
  }
  if (this.payPanel) this.payPanel.destroy();
  if (this.payText) this.payText.destroy();
  if (this.payQR) this.payQR.destroy();
  if (this.payBtn) { this.payBtn.destroy(); this.payBtn = null; }
  if (this.cancelBtn) { this.cancelBtn.destroy(); this.cancelBtn = null; }

  // Create donation popup group
  this.donationPopupGroup = this.add.group();

  // Dark overlay background
  const overlay = this.add.rectangle(960, 640, 1920, 1280, 0x000000, 0.8)
    .setDepth(5000)
    .setInteractive(); // Block clicks behind
  this.donationPopupGroup.add(overlay);

  // Show your donation image (centered)
  const donationImage = this.add.image(960, 640, 'donationPanel')
    .setScale(0.8) // Adjust scale as needed
    .setDepth(5001);
  this.donationPopupGroup.add(donationImage);

  // Scan QR Code message
  const scanMessage = this.add.text(960, 200, 
    "🔥 SUPPORT BLACK HORSE PUZZLE PROJECT LEVEL 02! 🔥", {
    font: "bold 48px Segoe UI",
    fill: "#ffd700",
    align: "center",
    stroke: "#000",
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(5002);
  this.donationPopupGroup.add(scanMessage);

  // Instructions
  const instructions = this.add.text(960, 1050, 
    "📱 Scan QR Code above or click PayPal.me button below\n" +
    "💰 Donations start from $1 - safely secured via PayPal!", {
    font: "bold 32px Segoe UI",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: { left: 20, right: 20, top: 10, bottom: 10 }
  }).setOrigin(0.5).setDepth(5002);
  this.donationPopupGroup.add(instructions);

  // PayPal.me button (memanjang)
  const paypalBtn = this.add.text(960, 1150, "💳 PAYPAL.ME- CLICK TO DONATE", {
    font: "bold 36px Segoe UI",
    fill: "#ffffff",
    backgroundColor: "#0070ba", // PayPal blue
    padding: { left: 30, right: 30, top: 12, bottom: 12 }
  })
    .setOrigin(0.5)
    .setDepth(5002)
    .setInteractive({ useHandCursor: true });
  this.donationPopupGroup.add(paypalBtn);

  // PayPal button hover effect
  paypalBtn.on('pointerover', () => {
    paypalBtn.setScale(1.05);
    paypalBtn.setBackgroundColor("#005ea6"); // Darker blue
  });

  paypalBtn.on('pointerout', () => {
    paypalBtn.setScale(1);
    paypalBtn.setBackgroundColor("#0070ba"); // Back to PayPal blue
  });

  // PayPal button click - open PayPal.me
  paypalBtn.on('pointerdown', () => {
    // Open PayPal.me in new tab
    window.open('https://paypal.me/lusibiz?country.x=ID&locale.x=en_US');
    
    // Show thank you message
    this.showDonationThankYou();
    
    // Redirect to Level 02 after short delay
    this.time.delayedCall(2000, () => {
      this.scene.start('Level02Scene');
    });
  });

  // Continue to Level 02 button
  const continueBtn = this.add.text(1200, 1220, "⏭️ CONTINUE TO LEVEL 02", {
    font: "bold 32px Segoe UI",
    fill: "#00eaff",
    backgroundColor: "#181c24",
    padding: { left: 20, right: 20, top: 8, bottom: 8 }
  })
    .setOrigin(0.5)
    .setDepth(5002)
    .setInteractive({ useHandCursor: true });
  this.donationPopupGroup.add(continueBtn);

  continueBtn.on('pointerdown', () => {
    this.scene.start('Level02Scene');
  });

  // Close button
  const closeBtn = this.add.text(1600, 150, "✕", {
    font: "bold 60px Arial",
    fill: "#fff",
    backgroundColor: "#e00",
    padding: { left: 15, right: 15, top: 5, bottom: 5 }
  }).setOrigin(0.5).setDepth(5002).setInteractive({ useHandCursor: true });
  this.donationPopupGroup.add(closeBtn);

  closeBtn.on('pointerdown', () => {
    this.closeDonationPopup();
  });

  // Optional: Close on overlay click
  overlay.on('pointerdown', () => {
    this.closeDonationPopup();
  });
}

// Thank you message for donation
showDonationThankYou() {
  // Remove existing thank you message
  if (this.thankYouText) this.thankYouText.destroy();

  this.thankYouText = this.add.text(960, 500, 
    "🙏 THANK YOU FOR SUPPORTING BLACK HORSE PUZZLE!\n" +
    "🚀 Your donation helps us create LEVEL 02!\n" +
    "⏭️ Redirecting to Level 02...", {
    font: "bold 42px Segoe UI",
    fill: "#ffd700",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: { left: 30, right: 30, top: 20, bottom: 20 },
    stroke: "#fff",
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(5010);

  // Animate thank you message
  this.tweens.add({
    targets: this.thankYouText,
    scale: { from: 0.1, to: 1 },
    alpha: { from: 0, to: 1 },
    duration: 800,
    ease: 'Back.easeOut'
  });
}

// Close donation popup
closeDonationPopup() {
  if (this.donationPopupGroup) {
    this.donationPopupGroup.clear(true, true);
    this.donationPopupGroup = null;
  }
  if (this.thankYouText) {
    this.thankYouText.destroy();
    this.thankYouText = null;
  }
}
//Batas Donation Popup
//-----------------------------------------------------------------------------------------
// Bagian ini belum di gunakan cocok untuk 20 puzzle
  startPuzzleSpin() {
    if (!this.isFavoritActive) return;

    // Mulai sound gallop jika belum berjalan
    if (this.horseGallop && !this.horseGallop.isPlaying) {
      this.horseGallop.play({ loop: true });
    }

    for (let i = 0; i < this.puzzlePieces.length; i++) {
      let piece = this.puzzlePieces[this.order[i]];
      this.tweens.add({
        targets: piece,
        angle: piece.angle + Phaser.Math.Between(90, 360),
        duration: 700,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          if (this.isFavoritActive) {
            this.startPuzzleSpin();
          } else {
            // Stop sound gallop jika spin selesai
            if (this.horseGallop && this.horseGallop.isPlaying) {
              this.horseGallop.stop();
            }
          }
        }
      });
    }


    if (this.playBtn) {
      this.playBtn.setInteractive();
      this.playBtn.setAlpha(1);
    }
  }

  transformPuzzleToHorse() {
    // Sembunyikan semua puzzle
    this.puzzlePieces.forEach(piece => piece.setVisible(false));
    this.puzzlePieceNumbers.forEach(num => num.setVisible(false));

    // Tampilkan gambar black horse utuh di tengah grid kiri
    if (this.blackHorseSprite) this.blackHorseSprite.destroy();
    this.blackHorseSprite = this.add.image(850, 600, 'horse')
      .setScale(0.2)
      .setDepth(100);


    // Animasi berlari keliling grid kiri (persegi panjang)
    const path = [
      { x: this.puzzlePositions[0].x, y: this.puzzlePositions[0].y },
      { x: this.puzzlePositions[2].x, y: this.puzzlePositions[2].y },
      { x: this.puzzlePositions[8].x, y: this.puzzlePositions[8].y },
      { x: this.puzzlePositions[6].x, y: this.puzzlePositions[6].y },
      { x: this.puzzlePositions[0].x, y: this.puzzlePositions[0].y }
    ];
    let idx = 0;
    this.isFavoritActive = true;
    const loopRun = () => {
      let next = (idx + 1) % path.length;
      this.tweens.add({
        targets: this.blackHorseSprite,
        x: path[next].x,
        y: path[next].y,
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          idx = next;
          if (!this.isFavoritActive) return; // stop jika sudah beli air
          loopRun();
        }
      });
    };
    loopRun();

    // Setelah beberapa detik, tampilkan panel favorit (air)
    this.time.delayedCall(2000, () => {
      this.showFavoritPanel();
    });
  }
}

window.Level01Scene = Level01Scene;