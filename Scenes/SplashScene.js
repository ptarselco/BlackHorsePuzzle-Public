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
      
      if (!localStorage.getItem("email")) {
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
      } else {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
      }
    });
  }


//Fungsi di kosongkan dulu dengan TODO ini
setupBoard(data) {
  // Contoh: playBtn selalu burem dan nonaktif di awal
  if (this.playBtn) {
    this.playBtn.setAlpha(0.5);
    this.playBtn.disableInteractive();
    this.playBtn.setVisible(true);
  }

  // Jika ingin aktifkan playBtn setelah kondisi tertentu (misal: data.unlocked)
  if (data && data.unlocked) {
    if (this.playBtn) {
      this.playBtn.setAlpha(1);
      this.playBtn.setInteractive({ useHandCursor: true });
      this.playBtn.setVisible(true);
    }
  }
  console.log('setupBoard dipanggil dengan:', data);
  // Atau, panggil logika reset/init board yang sudah ada
}

lockAllGameplayButtons() {
  // Implementasi logika mengunci semua tombol gameplay di splash scene
  // Contoh: nonaktifkan tombol, tambahkan efek blur, dsb
  
  // Kunci tombol lain jika ada (misal level2, playBtn, dsb)
  if (this.playBtn) {
    this.playBtn.disableInteractive();
    this.playBtn.setAlpha(0.5);
  }
  // Disable 10 puzzle button permanently until favorite menu purchase
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.disableInteractive();
    this.lv01Puzzle10Btn.setAlpha(0.5); // Visual indication
  }
  // Tambahkan logika lain sesuai kebutuhan
  console.log('✅ Semua tombol gameplay dikunci');
}

unlockGameAfterPurchase() {
  // Logika unlock game setelah pembayaran atau proses unlock
  // Contoh: aktifkan tombol Level 01 dan tombol puzzle
  if (this.level1) {
    this.level1.setInteractive();
    this.level1.setAlpha(1);
  }
  if (this.playBtn) {
    this.playBtn.setInteractive();
    this.playBtn.setAlpha(1);
  }
  this.unblur10PuzzleButton && this.unblur10PuzzleButton();
  console.log('✅ Game unlocked after purchase');
}

showGameOverReturnMessage() {
  // alert("Game Over! Unlock with Black Horse's favorite menu");
}

blur10PuzzleButton() {
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.disableInteractive();
    this.lv01Puzzle10Btn.setAlpha(0.5);
  }
  if (this.playBtn) {
    this.playBtn.disableInteractive();
    this.playBtn.setAlpha(0.5);
  }
 }
unblur10PuzzleButton() {
  if (this.lv01Puzzle10Btn) {
    this.lv01Puzzle10Btn.setInteractive();
    this.lv01Puzzle10Btn.setAlpha(1);
  }
  console.log('✅ Tombol 10 Puzzle di-unblur');
}

// ==== 7 FUNCTIONS FOR SplashScene CONNECTED TO BACKEND ====
// 1. GET FUNCTION FOR USER PROGRESS
async getUserProgress(email) {
  try {
    //const res = await axios.post(
    const response = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/progress`,
      { email, level01Score },
      { timeout: 90000 }
    );
    //const progress = res.data.progress  || {};
    const progress = response.data.progress || {};
    // ✅ CALCULATE USER TYPES AND RETURN THEM:
    const newUser = !progress || progress.totalPlays === 0;
    const lossUser = progress && progress.totalPlays >= 3 && (progress.level01Score || 0) === 0;
    const winUser = progress && progress.totalPlays > 0 && (progress.level01Score || 0) > 0;
    
    console.log(`👤 User classification: newUser=${newUser}, lossUser=${lossUser}, winUser=${winUser}`);
    console.log(`📊 Progress data: totalPlays=${progress.totalPlays}, level01Score=${progress.level01Score}`);
    // Response: { success, progress, user }  
    return {
    success: response.data.success,
      progress: progress,
      user: response.data.user,
      // ✅ ADD USER TYPES:
      newUser: newUser,
      lossUser: lossUser,
      winUser: winUser,
      totalPlays: progress.totalPlays || 0,
      level01Score: progress.level01Score || 0
    };
     
  } catch (err) {
    console.error('❌ Get user progress error:', err);
    return { 
      newUser: true, 
      lossUser: false, 
      winUser: false, 
      progress: null,
      success: false,
      totalPlays: 0,
      level01Score: 0
     };
  }
}

// 2. UPDATE FUNCTION FOR USER PROGRESS
async updateUserProgress(email, progress) {
  try {
    const res = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
      { ...progress },
      { timeout: 90000 }
    );
    return res.data.success === true;
  } catch (err) {
    console.error('❌ Update user progress error:', err);
    return false;
  }
}

// 3. GET USER STATUS DARI BACKEND (POST)
async getUserStatus(email, level = 'Level01Scene') {
  try {
    const response = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/status',
      { email: email.toLowerCase().trim(), level },
      { timeout: 90000 }
    );
    return response.data;
  } catch (err) {
    console.error('❌ Error checkUserStatusAndGameOver:', err);
    return null;
  }
}
// GABUNGKAN CHECK USER STATUS DAN GAME OVER
async checkUserStatusAndGameOver(email) {
  // Ambil status user dari backend (POST)
  const status = await this.getUserStatus(email, 'Level01Scene');
  if (!status) {
    console.error('Gagal ambil status user');
      return null;
    }

 const progress = status.progress  || {};
    // ✅ CALCULATE USER TYPES AND RETURN THEM:
    const newUser = !progress || progress.totalPlays === 0;
    const lossUser = progress && progress.totalPlays >= 3 && (progress.level01Score || 0) === 0;
    const winUser = progress && progress.totalPlays > 0 && (progress.level01Score || 0) > 0;

  
// Jika newUser, aktifkan tombol Play & Puzzle
  if (newUser) {
    this.isGameOver = false;
    this.unblur10PuzzleButton && this.unblur10PuzzleButton();
    console.log('✅ User baru - tombol Play & Puzzle diaktifkan');
    return status;
  }

  // Cek status game over untuk lossUser or winUser
  if (status.isGameOver) {
    if (winUser) {
      // WIN USER: Sudah main >= 1x, score > 0
      status.isGameOver = false;
      localStorage.setItem(`gameData-${email}`, JSON.stringify(status));
      this.isGameOver = false;
      this.unblur10PuzzleButton && this.unblur10PuzzleButton();
      console.log('✅ Game over status di-reset - tombol Play & Puzzle diaktifkan');
      // Lanjutkan main
      return status;
    } else if (lossUser) {
      // LOSS USER: Sudah main >= 3x, score = 0
      this.isGameOver = true;
      //this.showGameOverReturnMessage();
      //this.lockAllGameplayButtons();
      return status;
    }
  }

  // Tambah totalPlays setiap kali fungsi ini dipanggil (untuk user lama)
  status.totalPlays = (status.totalPlays || 0) + 1;

  // Jika totalPlays >= 3 dan level01Score masih 0, set game over
 // if (status.totalPlays >= 3 && (status.level01Score || 0) === 0) {
          //await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/set-gameover', { email, isGameOver: true });
 // await this.setGameOver(email, true); // gunakan fungsi async
 // status.isGameOver = true;
 // localStorage.setItem(`gameData-${email}`, JSON.stringify(status));
 // this.isGameOver = true;
 // this.showGameOverReturnMessage();
 // this.lockAllGameplayButtons();
 // return status;
 // }

  // Simpan totalPlays terbaru ke localStorage
  localStorage.setItem(`gameData-${email}`, JSON.stringify(status));

  // Jika lolos semua, aktifkan tombol Play & Puzzle
  this.isGameOver = false;
  this.unblur10PuzzleButton && this.unblur10PuzzleButton();
  return status;
}

// 4. Fungsi SET GAME OVER (async)
async setGameOver(email, isGameOver = true) {
  try {
    await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/set-gameover',
      { email, isGameOver },
      { timeout: 90000 }
    );
    return true;
  } catch (err) {
    console.error('Set game over error:', err);
    return false;
  }
}

// 5. CHECK GAME OVER STATUS DARI SERVER
async checkGameOverStatusFromServer() {
  const email = localStorage.getItem('email');
  if (!email) return;

  try {
    const response = await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/gameover', 
      { email },
      { timeout: 90000 }  
    );
    const data = response.data;
    if (data.isGameOver) {
      this.isGameOver = true;
      //this.showGameOverReturnMessage();
      //await this.lockLevel(email, 'Level01');
      //this.lockAllGameplayButtons();
      return;
    }
    } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      //this.showGameOverReturnMessage();
      //this.lockAllGameplayButtons();
      //await this.lockLevel(email, 'Level01');
      return;
    }
    console.error('Error checking game over status:', err);
    }
}

// 6. LOCK LEVEL (mengunci akses level untuk user)
async lockLevel(email, level) {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/lock',
      { email, level },
      { timeout: 90000 }
    );
    if (res.data.success) {
      this.isGameOver = true;
      this.blur10PuzzleButton();
      this.lockAllGameplayButtons();
      this.showGameOverReturnMessage();
      return true;
    }
    return false;
  } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      this.isGameOver = true;
      this.blur10PuzzleButton();
      this.lockAllGameplayButtons();
      this.showGameOverReturnMessage();
      return true;
    }
    // Jika tidak game over, tidak perlu lock
    console.error('Error checking game over status:', err);
    return false;
  }
}

// 7. UNLOCK LEVEL
async  unlockedLevels(email, level) {
  try {
    console.log('🔍 Checking unlock status for:', email);

   // ✅ USE EXISTING checkPaymentStatusFromBackend FUNCTION:
    const paymentData = await checkPaymentStatusFromBackend(email);
    
    if (!paymentData || paymentData.isPaid !== true) {
      console.warn('❌ User belum melakukan pembayaran atau payment status tidak valid.');
      console.log('Payment data:', paymentData);
      return false;
    }

    console.log('✅ Payment verified! Proceeding to unlock level...');
   
    // Jika sudah bayar, lanjut unlock level
    const unlockRes = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/unlock',
      { email, level },
      { timeout: 90000 }
    );

    console.log('🔓 Unlock level response:', unlockRes.data);

   if (unlockRes.data.success || unlockRes.data.unlocked === true) { 
     this.unblur10PuzzleButton(); // Hapus blur tombol 10 puzzle
     this.unlockGameAfterPurchase(); // Aktifkan tombol Play & Puzzle
    } 
   
    // ✅ LOGIKA UNLOCK LEVEL:
    // Jika backend mengembalikan { success: true } atau { unlocked: true }
    const isUnlocked = unlockRes.data.success || unlockRes.data.unlocked === true;
    console.log('🎯 Final unlock result:', isUnlocked);
    return isUnlocked;
    // Response backend bisa { success: true, unlocked: true }
    //return res.data.success || res.data.unlocked === true;
  } catch (err) {
    console.error('Unlock level error:', err);

    // ✅ NO ALERT - JUST LOG:
    console.log('❌ Unlock process failed - user should refresh page');
    return false;
  }
}

  // ========== LAZY LOAD LEVEL01 ASSETS (Non-blocking) ==========
  
  create() {
   console.log('🎬 Creating cinematic splash scene...'); 
    // Cek apakah email sudah ada di localStorage
    const email = localStorage.getItem("email");
    let playerScore = 0;
    // ✅ ENHANCED SAFETY CHECK in updateGameScore function:
    if (email) {
    const scoreStatus = checkPlayerScoreStatus(email); 
    updateGameScore(email, scoreStatus.currentScore);
    //updateGameScore(email,scoreStatus.currentScore);
    console.log('✅ updateGameScore dipanggil:', email,scoreStatus.currentScore);
    
    // Sembunyikan loginBox, tampilkan logoutBtn
    const loginBox = document.getElementById("loginBox");
    const logoutBtn = document.getElementById("logoutBtn");
    if (loginBox) loginBox.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    // Email tidak ditemukan, tampilkan loginBox dan sembunyikan logoutBtn
    console.warn('❌ email tidak ditemukan - tidak bisa updateGameScore');
    const loginBox = document.getElementById("loginBox");
    const logoutBtn = document.getElementById("logoutBtn");
    if (loginBox) loginBox.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
  
    // Panggil sync progress dari backend di sini
  if (email) {
    syncProgressFromBackend(email); // ← panggil di sini
  }

  window.addEventListener('beforeunload', () => {
  const email = localStorage.getItem("email");
  if (!email) return;
  const progress = {
    level01Score: window.level01Score || 0,
    totalPlays: window.totalPlays || 0,
    isGameOver: window.isGameOver || false
  };
  const url = `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`;
  navigator.sendBeacon(url, JSON.stringify(progress));
  });

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
  level1.on("pointerdown", async () => {
  // Glow effect
  level1Glow.setVisible(true);
  btnBlue.setVisible(true);

  const email = localStorage.getItem("email");
  if (!email) {
    document.getElementById("loginBox").style.display = "block";
    alert("Please Login with your email!");
    return;
  }

  // ✅ TAMBAH AUTO PAYMENT CHECK DI SINI (line 437-438): tamabah 070825
  console.log('🔍 Auto checking payment status for:', email);
  try {
    const paymentData = await checkPaymentStatusFromBackend(email);
    if (paymentData && paymentData.isPaid === true) {
      console.log('✅ Payment detected! Auto-unlocking game...');
      
      // Clear game over state
      localStorage.removeItem(`gameOver_${email}`);
      
      // Update user data
      let userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
      userData.isGameOver = false;
      userData.isPaid = true;
      localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));
      
      // Hide glow effect
      level1Glow.setVisible(false);
      btnBlue.setVisible(false);
      
      console.log('🎮 Payment verified - proceeding to Level01Scene');
      this.scene.start("Level01Scene", { 
        isGameOver: false, 
        isPaid: true,
        level01Score: userData.level01Score || 0 
      });
      return;
    } else {
      console.log('❌ No payment detected - checking game over logic');
    }
  } catch (error) {
    console.error('❌ Payment check error:', error);
  }

  try {
     // 1. Ambil progress user dari backend
    //const progress = await this.getUserProgress(email);
    const progressRes = await this.getUserProgress(email);
    const progress = progressRes.progress || {};
    const totalPlays = progress.totalPlays ?? 0;
    const level01Score = progress.level01Score ?? 0;
    // 2. Tentukan status user
    const newUser = !progress.totalPlays || progress.totalPlays === 0;
    const lossUser = progress.totalPlays >= 3 && (progress.level01Score || 0) === 0;
    const winUser = progress.totalPlays >= 3 && (progress.level01Score || 0) > 0;

    // 3. Update progress user ke backend
    // Kirim field progress langsung, bukan object progress
    const newAverageTime = typeof this.timeElapsed === 'number' ? this.timeElapsed : 0;
    const newCompletionRate = 100; // Atau hitung sesuai logic, default 100%
    const isPerfectGame = true;    // Atau false jika ada salah, default true
    const totalAttempts = (progress.totalAttempts || 0) + 1; // Default tambah 1
    const bestTime = progress.bestTime ?? 0;
    const averageTime = progress.averageTime ?? 0;
    const completionRate = progress.completionRate ?? 0;
    const perfectGames = progress.perfectGames ?? 0;

    
    await this.updateUserProgress(email, {
     level01Completed: true,
     level01Score: this.level01Score,
     level01HighScore: Math.max(this.level01Score, this.highScore),
     totalPlays: (progress.totalPlays || 0) + 1,
     bestTime: this.timeElapsed,
     averageTime: newAverageTime,
     completionRate: newCompletionRate,
     perfectGames: isPerfectGame,
     totalAttempts: totalAttempts,
     completionTime: this.timeElapsed || 0, // Atau hitung sesuai logic
     isPerfectGame: isPerfectGame === true
   });

    // 4. Ambil status user dari backend
    const userStatus = await this.getUserStatus(email, 'Level01, Level01Scene');
    // Cek dan update status game over (jika perlu set-gameover)
    const status = await this.checkUserStatusAndGameOver(email);

    // 5. Cek status game over dari server (opsional, validasi ulang)
    await this.checkGameOverStatusFromServer();

    // 6. Lock level jika game over logika 3 user
    if (newUser) {
      this.isGameOver = false;
      this.unblur10PuzzleButton();
      // Tampilkan pesan selamat datang jika perlu
      this.scene.start("Level01Scene", { isGameOver: false, level01Score: 0 });
      return;
    }
    if (lossUser || (status && status.isGameOver && (status.level01Score || 0) === 0)) {
      await this.lockLevel(email, 'level01');
      this.isGameOver = true;
      this.showGameOverReturnMessage();
      this.lockAllGameplayButtons();
      this.scene.start("Level01Scene", { isGameOver: true, level01Score: 0 });
      return;
    }
    if (winUser || (status && status.level01Score > 0)) {
      this.isGameOver = false;
      this.unblur10PuzzleButton();
      // Tampilkan pesan kemenangan jika perlu
      this.scene.start("Level01Scene", { isGameOver: false, level01Score: status.level01Score });
      return;
    }

    // 7. Unlock level (opsional, misal setelah pembayaran)
    await this.unlockedLevels(email, 'level01');

    
    // FUNGSI UNTUK SYNC DATA DARI BACKEND KE LOCAL STORAGE DAN WINDOW SETIAP KALI LOGIN ATAU RELOAD
    async function syncProgressFromBackend(email) {
    try {
    const res = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/progress`
    );
    const progress = res.data?.progress || {};
    // Sync level01Score
    localStorage.setItem(`score_${email}`, progress.level01Score || 0);
    window.level01Score = progress.level01Score || 0;
    window.playerScore = progress.level01Score || 0;
    // Sync history (if you store it in backend)
    localStorage.setItem(`gameHistory_${email}`, JSON.stringify({
      hasPlayedBefore: true,
      totalGamesPlayed: progress.totalPlays || 1,
      highestScore: progress.level01HighScore || progress.level01Score || 0,
      gameOvers: progress.gameOvers || 0,
      lastPlayedDate: new Date().toISOString(),
      favoriteGiven: progress.favoriteGiven || false
    }));
    console.log('✅ Synced progress from backend:', progress);
  } catch (err) {
    console.error('❌ Failed to sync progress from backend:', err);
  }
}

  // === CEK STATUS PEMBAYARAN DARI BACKEND ===
    const paymentStatus = await window.checkPaymentStatusFromBackend(email);
    if (paymentStatus.isPaid) {
      this.unblur10PuzzleButton && this.unblur10PuzzleButton();
      this.unlockGameAfterPurchase && this.unlockGameAfterPurchase();
      console.log('✅ Game unlocked: pembayaran terverifikasi');
    } else {
      this.lockAllGameplayButtons && this.lockAllGameplayButtons();
      console.log('🔒 Game locked: belum ada pembayaran');
    }

    // Jika belum game over, lanjut ke Level01Scene
    // Show loading indicator
    const loadingText = this.add.text(960, 850, '', {
      fontSize: '24px', fill: '#00eaff'
    }).setOrigin(0.5);

    // ========== LAZY LOAD LEVEL01 ASSETS ==========
      console.log('🎵 Lazy loading Level01 assets...');
      this.lazyLoadLevel01Assets(async () => {
        // Setelah loading selesai, pindah ke Level01
        loadingText.destroy();
        level1Glow.setVisible(false);
        btnBlue.setVisible(false);

        // Contoh: update progress ke backend sebelum pindah scene
        await this.updateUserProgress(email, {
        // ...progress data...
        level01Score: status.level01Score,
        totalPlays: status.totalPlays,
        isGameOver: status.isGameOver
        });

        this.scene.start("Level01Scene", { //pindah ke Level01Scene
        email,
        level01Score: status.level01Score,
        totalPlays: status.totalPlays,
        isGameOver: status.isGameOver
        });
      });
    } catch (error) {
    alert("Failed to check user status: " + error.message);
    }
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

  // ========== LAZY LOAD LEVEL01 ASSETS ========== // LAZY LOAD LEVEL01 ASSETS LEBIH CEPAT TAMPIL
  lazyLoadLevel01Assets(callback) {
    // Load semua assets yang dibutuhkan Level01 (Aktif yang di Level01)
    //this.load.audio('horseNeigh', './Puzzle-Assets/Sfx/sound/horse-neigh.mp3');
    //this.load.audio('horseSnort', './Puzzle-Assets/Sfx/sound/horse-snort.mp3');
    //this.load.audio('horseHoof', './Puzzle-Assets/Sfx/sound/hoof-run.mp3');
    //this.load.audio('horsehoofstep', './Puzzle-Assets/Sfx/sound/hoof-step.mp3');
    //this.load.audio('horseGallop', './Puzzle-Assets/Sfx/sound/blackhorse-gallop.mp3');
    //this.load.audio('herdGallop', './Puzzle-Assets/Sfx/sound/herd-gallop.mp3');
    
    // Music Level01
    //this.load.audio('introMusic', './Puzzle-Assets/Sfx/scenes/level01-1-herdhorses-guitar-intro-ident.mp3');
    //this.load.audio('mainMusic', './Puzzle-Assets/Sfx/scenes/level01-2 music-favorite-sunset-dreams.mp3');
    //this.load.audio('winMusic', './Puzzle-Assets/Sfx/scenes/win-in-the-video-game.mp3');
    
    // Essential Level01 images
    //this.load.image('horse', './Puzzle-Assets/UI/GM. Black Horse Run Behind.webp');
   // this.load.image('paypalQR', './Puzzle-Assets/UI/paypal-qr.webp');

   this.load.once('complete', () => {
    console.log('✅ Level01 assets loaded!');
    if (typeof callback === 'function') callback();
    // ⬇️ Tambahkan di sini untuk memastikan asset sudah di-cache sebelum scene dimulai
    //this.scene.start("Level01Scene", {/* data jika perlu */});
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