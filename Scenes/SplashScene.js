// SplashScene.js - Versi Lazy Loading (Backup dari SplashScene.js)

// Pastikan fungsi ini ada sebelum class SplashScene
if (typeof window.checkPaymentStatusFromBackend !== 'function') {
  window.checkPaymentStatusFromBackend = async function(email) {
    // Fallback: return unpaid status jika fungsi global belum ada
    return { isPaid: false, paypalAmount: 0, xsollaAmount: 0, supportAmount: 0, paymentMethods: [] };
  };
}

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
// ========== GANTI DENGAN FUNCTION getUserProgress YANG BENAR ==========
// 1. GET USER PROGRESS
async getUserProgress(email) {
  try {
    const response = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/progress`,
      { email, level: 'Level01Scene' },
      { timeout: 200000 }
    );
    
    // Ambil progress user
    const user = response.data.user || {};
    const progress = user.gameProgress || {};
    const level01Score = progress.level01Score || 0;
    const totalPlays = progress.totalPlays || 0;
    const level01HighScore = progress.level01HighScore || 0;
    const level01Completed = progress.level01Completed || false;

    // ✅ DEFINISIKAN currentScore & highScore
    const currentScore = progress.level01Score || 0;  // API -> Frontend
    const highScore = progress.level01HighScore || 0; // API -> Frontend
    
    // ✅ LOGIKA YANG DIPERBAIKI:
    const userStatus = {
     newUser: totalPlays === 0, // Belum pernah main sama sekali
     winUser: totalPlays > 0 && (currentScore > 0 || highScore > 0), // Pernah menang minimal 1x
     lossUser: totalPlays >= 3 && currentScore === 0 && highScore === 0 // 3x main tapi tidak pernah menang
    };

    console.log(`👤 User classification FIXED: totalPlays=${totalPlays}, currentScore=${currentScore}, highScore=${highScore}`);
    console.log(`👤 Classification: newUser=${userStatus.newUser}, lossUser=${userStatus.lossUser}, winUser=${userStatus.winUser}`);

    return {
    success: response.data.success,
      progress: progress,
      user: response.data.user,
      newUser: userStatus.newUser,
      winUser: userStatus.winUser,
      lossUser: userStatus.lossUser,
      totalPlays,
      level01Score: currentScore,
      level01HighScore: highScore
    };
  } catch (err) {
    console.error('❌ Get user progress error:', err);
    return { 
      progress: null, 
      success: false,
      level01Score: 0,
      level01HighScore: 0,
      level01Completed: false,
      totalPlays: 0,
      newUser: true, 
      lossUser: false, 
      winUser: false, 
    };
  }
}

// 2. UPDATE FUNCTION FOR USER PROGRESS
async updateUserProgress(email, progress) {
try {
// ✅ VALIDASI INPUT
    if (!email || typeof email !== 'string') {
      console.error('❌ Invalid email in updateUserProgress');
      return { success: false, error: 'Invalid email' };
    }

    // ✅ CURRENT SCORE = Score terakhir yang diperoleh (bisa naik/turun)
    const level01Score = Math.max(0, progress.level01Score ?? 0);
    
    // ✅ AMBIL HIGH SCORE EXISTING DARI BERBAGAI SUMBER
    const currentLocalHighScore = parseInt(localStorage.getItem(`highScore_${email}`) || '0');
    const gameData = JSON.parse(localStorage.getItem(`gameData-${email}`) || '{}');
    const existingHighScore = Math.max(
      currentLocalHighScore,
      gameData.gameProgress?.level01HighScore || 0,
      progress.level01HighScore || 0
    );
    
    // ✅ HIGH SCORE LOGIC YANG BENAR:
    // - Jika current score LEBIH TINGGI dari existing high score → UPDATE high score
    // - Jika current score LEBIH RENDAH dari existing high score → TETAP pakai existing high score
    const level01HighScore = Math.max(level01Score, existingHighScore);
    const isNewHighScore = level01Score > existingHighScore;
    
    const level01Completed = progress.level01Completed ?? (level01Score > 0);

    // ✅ PERBAIKAN: SELALU UPDATE CURRENT SCORE, HIGH SCORE HANYA UPDATE JIKA LEBIH TINGGI
    if (level01Score === 0 && !progress.forceUpdate && !progress.gameResult) {
      console.log('🚫 Skipping update - no valid game session');
      return {
        success: false,
        message: 'No valid game session to update',
        preservedScore: true
      };
    }

    console.log('📤 Updating progress:', {
      email,
      currentScore: level01Score, // ✅ Score terakhir (bisa naik/turun)
      existingHighScore: existingHighScore, // ✅ High score yang sudah ada
      newHighScore: level01HighScore, // ✅ High score yang akan disimpan
      isNewHighScore: isNewHighScore, // ✅ Apakah ini high score baru?
      gameResult: progress.gameResult || 'unknown'
    });

    // Hitung status user berdasarkan progress SETELAH UPDATE
    const finalTotalPlays = user.gameProgress.totalPlays || 0;
    const finalLevel01Score = user.gameProgress.level01Score || 0;
    const finalLevel01HighScore = user.gameProgress.level01HighScore || 0;

    // ✅ DEFINISIKAN currentScore & highScore
    const currentScore = finalLevel01Score || 0;  // API -> Frontend
    const highScore = finalLevel01HighScore || 0; // API -> Frontend

    const userStatus = {
     newUser: finalTotalPlays === 0,
     winUser: finalTotalPlays > 0 && (currentScore > 0 || highScore > 0),
     lossUser: finalTotalPlays >= 3 && currentScore === 0 && highScore === 0
    };

    const res = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
      {
        email,
        level01Score, // ✅ SELALU kirim current score (terakhir yang diperoleh)
        level01HighScore, // ✅ High score (hanya naik jika current > existing)
        level01Completed,
        totalPlays: Math.max(0, progress.totalPlays ?? 0),
        completionTime: progress.completionTime || 0,
        gameResult: progress.gameResult || 'unknown',
        // ✅ FLAGS UNTUK BACKEND
        updateCurrentScore: true, // ✅ Selalu update current score
        updateHighScore: isNewHighScore, // ✅ Hanya update high score jika lebih tinggi
        preserveHighScore: true, // ✅ Jangan turunkan high score existing
        allowScoreDecrease: true, // ✅ Izinkan current score turun
        isNewHighScore: isNewHighScore, // ✅ Flag: apakah ini high score baru
        source: 'splash_scene',
        timestamp: new Date().toISOString()
      },
      { timeout: 15000 }
    );

    // ✅ UPDATE LOCAL STORAGE DENGAN LOGIC YANG BENAR
    if (res.data.success) {
      const user = res.data.user || {};
      // Hitung status user berdasarkan progress SETELAH UPDATE
      const finalTotalPlays = user.gameProgress.totalPlays || 0;
      const finalLevel01Score = user.gameProgress.level01Score || 0;
      const finalLevel01HighScore = user.gameProgress.level01HighScore || 0;
      // ✅ SELALU update current score
      this.level01Score = level01Score;
      localStorage.setItem(`score_${email}`, level01Score.toString());
      
    // ✅ UPDATE high score HANYA jika lebih tinggi
    if (isNewHighScore) {
      this.level01HighScore = level01HighScore;
      localStorage.setItem(`highScore_${email}`, level01HighScore.toString());
      console.log(`🏆 NEW HIGH SCORE! ${existingHighScore} → ${level01HighScore}`);
        
        // ✅ BISA TAMBAHKAN CELEBRATION EFFECT
        this.showNewHighScoreEffect && this.showNewHighScoreEffect(level01HighScore);
      } else {
        this.level01HighScore = existingHighScore;
        console.log(`📊 Current: ${level01Score}, High Score unchanged: ${existingHighScore}`);
      }
      
      // ✅ Update gameData dengan kedua score
      const updatedGameData = {
        ...gameData,
        gameProgress: {
          ...gameData.gameProgress,
          level01Score: level01Score, // ✅ Current score (terakhir)
          level01HighScore: this.level01HighScore, // ✅ High score (tertinggi)
          level01Completed,
          lastUpdated: new Date().toISOString(),
          lastGameResult: progress.gameResult || 'unknown',
          isNewHighScore: isNewHighScore // ✅ Flag untuk UI
        },
        newUser: res.data.newUser || false,
        winUser: res.data.winUser || false,
        lossUser: res.data.lossUser || false
      };
      localStorage.setItem(`gameData-${email}`, JSON.stringify(updatedGameData));

      // ✅ UPDATE history dengan KEDUA score
      const history = JSON.parse(localStorage.getItem(`gameHistory_${email}`) || '{}');
      const updatedHistory = {
        ...history,
        currentScore: level01Score, // ✅ Score terakhir
        highestScore: this.level01HighScore, // ✅ Score tertinggi sepanjang masa
        lastGameDate: new Date().toISOString(),
        lastGameResult: progress.gameResult || 'unknown',
        isNewHighScore: isNewHighScore,
        previousHighScore: existingHighScore // ✅ Simpan high score sebelumnya untuk perbandingan
      };
      localStorage.setItem(`gameHistory_${email}`, JSON.stringify(updatedHistory));
      
      console.log('✅ Progress updated - Current:', level01Score, 'High:', this.level01HighScore);
    }

    return {
      success: res.data.success,
      user: res.data.user,
      newUser: res.data.newUser || false,
      winUser: res.data.winUser || false,
      lossUser: res.data.lossUser || false,
      message: res.data.message,
      currentScore: level01Score,
      highScore: this.level01HighScore,
      isNewHighScore: isNewHighScore, // ✅ Return info apakah high score baru
      previousHighScore: existingHighScore // ✅ Return high score sebelumnya
    };

    } catch (err) {
    console.error('❌ Update progress error:', err);
    
    // ✅ FALLBACK: Update local dengan logic yang sama
    if (email && progress.level01Score >= 0) {
      const currentLocal = JSON.parse(localStorage.getItem(`gameData-${email}`) || '{}');
      const localHighScore = currentLocal.gameProgress?.level01HighScore || 0;
      const newHighScore = Math.max(progress.level01Score || 0, localHighScore);
      const isNewHighScore = (progress.level01Score || 0) > localHighScore;
      
      const fallbackData = {
        ...currentLocal,
        gameProgress: {
          ...currentLocal.gameProgress,
          level01Score: progress.level01Score, // ✅ Current score
          level01HighScore: newHighScore, // ✅ High score (hanya naik jika lebih tinggi)
          lastUpdated: new Date().toISOString(),
          offlineUpdate: true,
          lastGameResult: progress.gameResult || 'unknown',
          isNewHighScore: isNewHighScore
        }
      };
      localStorage.setItem(`gameData-${email}`, JSON.stringify(fallbackData));
      localStorage.setItem(`score_${email}`, (progress.level01Score || 0).toString());
      
      // Update high score di localStorage jika lebih tinggi
      if (isNewHighScore) {
        localStorage.setItem(`highScore_${email}`, newHighScore.toString());
        console.log('💾 Fallback: NEW HIGH SCORE saved locally:', newHighScore);
      }

      console.log('💾 Fallback: Progress saved locally');
    }
    
    return {
      success: false,
      error: err.message,
      fallbackSaved: true
    };
  }
}

// ✅ TAMBAHAN: FUNCTION UNTUK SHOW NEW HIGH SCORE EFFECT
showNewHighScoreEffect(newHighScore) {
  console.log('🎉 NEW HIGH SCORE ACHIEVED:', newHighScore);
  
  // ✅ BISA TAMBAHKAN VISUAL EFFECT DI SINI
  // Contoh: 
  // - Flash screen
  // - Show congratulations text
  // - Play special sound
  // - Particle effects
  
  // Contoh simple text effect:
  if (this.add && typeof this.add.text === 'function') {
    const congratsText = this.add.text(960, 300, `NEW HIGH SCORE!\n${newHighScore}`, {
      fontSize: '48px',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setDepth(1000);
    
    // Fade out after 3 seconds
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: congratsText,
        alpha: 0,
        duration: 1000,
        onComplete: () => congratsText.destroy()
      });
    });
  }
}


// 3. GET USER STATUS DARI BACKEND (POST)
async getUserStatus(email, level = 'Level01Scene') {
  try {
    const response = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/status',
      { email, level: 'Level01Scene' },
      { timeout: 200000 }
    );
    return response.data;
  } catch (err) {
    console.error('❌ Error checkUserStatusAndGameOver:', err);
    return null;
  }
}

    // PERBAIKAN FUNGSI checkUserStatusAndGameOver
async checkUserStatusAndGameOver(email) {
  const status = await this.getUserStatus(email, 'Level01Scene');
  if (!status) {
    console.error('Gagal ambil status user');
    return null; 
}

// Ambil progress user dengan variable yang benar
//const user = response.data.user || {};
const progress = status.progress || {};
const unlocked = progress?.level01Completed || false; // Perbaiki nama property
const level01Score = progress.level01Score || 0;
const level01HighScore = progress.level01HighScore || 0;
const totalPlays = progress.totalPlays || 0;

// ✅ DEFINISIKAN currentScore & highScore
const currentScore = progress.level01Score || 0;  // API -> Frontend
const highScore = progress.level01HighScore || 0; // API -> Frontend

// Hitung status user berdasarkan progress
const userStatus = {
 newUser: totalPlays === 0,
 winUser: totalPlays > 0 && (currentScore > 0 || highScore > 0),
 lossUser: totalPlays >= 3 && currentScore === 0 && highScore === 0
};

console.log(`🔍 User status check: plays=${totalPlays}, score=${currentScore}, high=${highScore}`);
console.log(`🎯 User type: new=${userStatus.newUser}, win=${userStatus.winUser}, loss=${userStatus.lossUser}`);

// ✅ UNTUK NEW USER: Aktifkan game
  if (userStatus.newUser) {
    this.isGameOver = false;
    this.unblur10PuzzleButton && this.unblur10PuzzleButton();
    console.log('✅ User baru - game diaktifkan');
    return { ...status, newUser: true, winUser: false, lossUser: false };
  }

// ✅ UNTUK WIN USER: Selalu aktifkan game (sudah pernah menang)
  if (userStatus.winUser) {
    this.isGameOver = false;
    this.unblur10PuzzleButton && this.unblur10PuzzleButton();
    if (this.playBtn) {
      this.playBtn.setInteractive({ useHandCursor: true });
      this.playBtn.setAlpha(1);
      this.playBtn.setVisible(true);
    }
    console.log('✅ Win user - game tetap aktif');
    return { ...status, newUser: false, winUser: true, lossUser: false };
  }

  // ✅ UNTUK LOSS USER: Cek payment status
   if (userStatus.lossUser) {
  // Cek payment status
  const paymentData = await window.checkPaymentStatusFromBackend(email);
  const isPaid = paymentData && paymentData.isPaid === true;

  if (!isPaid) {
    this.isGameOver = true;
    status.isGameOver = true;
    status.showPaymentPanel = true;       
    status.showFavoritPayPanel = true;
    localStorage.setItem(`gameData-${email}`, JSON.stringify(status));
    this.lockAllGameplayButtons();
    console.log('❌ Loss user belum bayar - game dikunci');
    return { ...status, newUser: false, winUser: false, lossUser: true };
  } else {
    // ✅ SUDAH BAYAR - PANGGIL UNLOCK FUNCTION
    console.log('💳 Loss user sudah bayar - proceeding to unlock...');
    
    const unlockResult = await this.unlockedLevels(email, 'Level01Scene');
    if (unlockResult) {
      console.log('✅ Auto-unlock successful after payment detection');
      this.isGameOver = false;
      
      // ✅ GET UPDATED STATUS DARI LOCALSTORAGE SETELAH UNLOCK
      const updatedData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
      return { 
        ...status, 
        newUser: updatedData.newUser || false, 
        winUser: updatedData.winUser || true, // Biasanya jadi winUser setelah unlock
        lossUser: false, 
        isPaid: true,
        isGameOver: false
      };
    } else {
      console.error('❌ Auto-unlock failed despite payment');
      return { ...status, newUser: false, winUser: false, lossUser: true };
    }
  }
}
  // Default case
  this.isGameOver = false;
  this.unblur10PuzzleButton && this.unblur10PuzzleButton();
  return status;
}

// 4. Fungsi SET GAME OVER (async)
async setGameOver(email, isGameOver = true, userStatus = { newUser: false, winUser: false, lossUser: true }) {
  try {
  // Ambil progress dan status user dengan variable yang benar
  const progressRes = await this.getUserProgress(email);
  const progress = progressRes.progress || {};
  const unlocked = progress?.level01Completed || false;  
  const level01Score = progress.level01Score || 0;
  const level01HighScore = progress.level01HighScore || 0;
  const totalPlays = progress.totalPlays || 0;

  // ✅ DEFINISIKAN currentScore & highScore
  const currentScore = progress.level01Score || 0;
  const highScore = progress.level01HighScore || 0;

  // Hitung status user berdasarkan progress
  const userStatus = {
   newUser: totalPlays === 0,
   winUser: totalPlays > 0 && (currentScore > 0 || highScore > 0),
   lossUser: totalPlays >= 3 && currentScore === 0 && highScore === 0
  }; 
   console.log('🎯 Setting game over with calculated user status:', {
      email,
      isGameOver,
      totalPlays,
      currentScore,
      highScore,
      userStatus: userStatus
    });

    // ✅ LANGKAH 5: KIRIM KE BACKEND DENGAN STATUS YANG BENAR
    const response = await axios.post(
    'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/set-gameover',
      { email, isGameOver, userStatus: userStatus},
      { timeout: 200000 }
    );

    // ✅ LANGKAH 6: UPDATE LOCALSTORAGE DENGAN STATUS YANG BENAR
    if (response.data.success) {
      const userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
      userData.gameProgress = {
        ...userData.gameProgress,
        ...progress // ✅ UPDATE DENGAN PROGRESS TERBARU
      };
      userData.newUser = userStatus.newUser;
      userData.winUser = userStatus.winUser;
      userData.lossUser = userStatus.lossUser;
      userData.isGameOver = isGameOver;
      userData.lastGameOverSet = new Date().toISOString();
      localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));

      console.log('✅ Game over status set successfully with calculated user status');
    }
    return response.data.success || true;
  } catch (err) {
    console.error('Set game over error:', err);

    // ✅ FALLBACK: TETAP UPDATE LOCALSTORAGE MESKI BACKEND GAGAL
    try {
      const userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
      const localProgress = userData.gameProgress || {};
      const localTotalPlays = localProgress.totalPlays || 0;
      const localCurrentScore = localProgress.level01Score || 0;
      const localHighScore = localProgress.level01HighScore || 0;

      // Hitung status user dari data lokal
      const fallbackUserStatus = {
        newUser: localTotalPlays === 0,
        winUser: localTotalPlays > 0 && (localCurrentScore > 0 || localHighScore > 0),
        lossUser: localTotalPlays >= 3 && localCurrentScore === 0 && localHighScore === 0
      };

      userData.newUser = fallbackUserStatus.newUser;
      userData.winUser = fallbackUserStatus.winUser;
      userData.lossUser = fallbackUserStatus.lossUser;
      userData.isGameOver = isGameOver;
      userData.fallbackUpdate = true;
      localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));

      console.log('💾 Fallback: Game over status saved locally with calculated user status');
    } catch (fallbackErr) {
      console.error('❌ Fallback also failed:', fallbackErr);
    }
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
      { timeout: 200000 }  
    );

  // Ambil progress dan status user dengan variable yang benar
  const progress = response.data.progress || {};
  const unlocked = progress.level01Completed || false;
  const level01Score = progress.level01Score || 0;
  const level01HighScore = progress.level01HighScore || 0;
  const totalPlays = progress.totalPlays || 0;

  // ✅ DEFINISIKAN currentScore & highScore
  const currentScore = progress.level01Score || 0;  // API -> Frontend
  const highScore = progress.level01HighScore || 0; // API -> Frontend

  // Hitung status user berdasarkan progress
  const userStatus = {
   newUser: totalPlays === 0,
   winUser: totalPlays > 0 && (currentScore > 0 || highScore > 0),
   lossUser: totalPlays >= 3 && currentScore === 0 && highScore === 0
  };

    const data = response.data;
    if (data.isGameOver) {
      this.isGameOver = true;
       // Tampilkan pesan sesuai tipe user
      if (data.userStatus.lossUser) {
        this.showGameOverReturnMessage && this.showGameOverReturnMessage();
        this.lockAllGameplayButtons && this.lockAllGameplayButtons();
      } else if (data.userStatus.winUser) {
        // WIN USER: Sudah main >= 1x, score > 0
        this.isGameOver = false;
        this.unblur10PuzzleButton && this.unblur10PuzzleButton();
        // Bisa tambahkan pesan kemenangan jika perlu
      } else if (data.userStatus.newUser) {
        // NEW USER: Belum pernah main
        this.isGameOver = false;
        this.unblur10PuzzleButton && this.unblur10PuzzleButton();
        // Bisa tambahkan pesan selamat datang jika perlu  
      } 
      return;
    } else {
      // Jika tidak game over, pastikan tombol aktif
      this.isGameOver = false;
      this.unblur10PuzzleButton && this.unblur10PuzzleButton();  
    }
    } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      this.showGameOverReturnMessage();
      //this.lockAllGameplayButtons();
      //await this.lockLevel(email, 'Level01');
      return;
    }
    console.error('Error checking game over status:', err);
    }
}

// 6. LOCK LEVEL (mengunci akses level untuk user)
async lockLevel(email, level, userStatus = { newUser: false, winUser: false, lossUser: true }) {
  try {
    const progressRes = await this.getUserProgress(email);
    const progress = progressRes.progress || {};
    const unlocked = progress?.[`${level.toLowerCase()}Completed`] || false;
    const level01Score = progress.level01Score || 0;
    const level01HighScore = progress.level01HighScore || 0;
    const totalPlays = progress.totalPlays || 0;

    // ✅ DEFINISIKAN currentScore & highScore
    const currentScore = progress.level01Score || 0;  // API -> Frontend
    const highScore = progress.level01HighScore || 0; // API -> Frontend

    // Hitung status user berdasarkan progress
    const userStatus = {
    newUser: totalPlays === 0,
    winUser: totalPlays > 0 && (currentScore > 0 || highScore > 0),
    lossUser: totalPlays >= 3 && currentScore === 0 && highScore === 0
    };

    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/lock',
      { email, level, userStatus },
      { timeout: 200000 }
    );
    if (res.data.success) {
      this.isGameOver = true;
      this.blur10PuzzleButton && this.blur10PuzzleButton();
      this.lockAllGameplayButtons && this.lockAllGameplayButtons();
      this.showGameOverReturnMessage && this.showGameOverReturnMessage();
      return true;
    }
    return false;
  } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      this.isGameOver = true;
      this.blur10PuzzleButton && this.blur10PuzzleButton();
      this.lockAllGameplayButtons && this.lockAllGameplayButtons();
      this.showGameOverReturnMessage && this.showGameOverReturnMessage();
      return true;
    }
    // Jika tidak game over, tidak perlu lock
    console.error('Error checking game over status:', err);
    return false;
  }
}

// 7. UNLOCK LEVEL - DENGAN PERHITUNGAN USER STATUS
async unlockedLevels(email, level) {
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
   
    // ✅ KIRIM isPaid KE BACKEND (SESUAI PERBAIKAN userRoutes.js)
    const unlockRes = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/unlock',
      { 
        email, 
        level,
        isPaid: true // ✅ TAMBAHKAN PARAMETER isPaid
      },
      { timeout: 200000 }
    );

    console.log('🔓 Unlock level response:', unlockRes.data);

    // ✅ AMBIL RESPONSE LENGKAP DARI BACKEND (SESUAI PERBAIKAN userRoutes.js)
    if (unlockRes.data.success || unlockRes.data.unlocked === true) {
      
      // ✅ UPDATE USER STATUS DARI RESPONSE BACKEND
      const responseData = unlockRes.data;
      const { 
        newUser, 
        winUser, 
        lossUser, 
        progress, 
        level01Score, 
        isGameOver, 
      } = responseData;

      console.log('👤 User status from unlock response:', { newUser, winUser, lossUser });
      console.log('📊 Progress from unlock response:', progress);

      // ✅ UPDATE LOCALSTORAGE DENGAN DATA DARI BACKEND
      if (progress) {
        let userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
        userData.gameProgress = progress;
        userData.newUser = newUser;
        userData.winUser = winUser;
        userData.lossUser = lossUser;
        userData.isGameOver = false; // Always false after successful unlock
        userData.lastUnlocked = new Date().toISOString();
        localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));

        // Update individual score items
        localStorage.setItem(`score_${email}`, (level01Score || 100).toString());
        localStorage.setItem(`highScore_${email}`, (progress.level01HighScore || level01Score || 100).toString());
        
        console.log('💾 LocalStorage updated with unlock data');
      }

      // ✅ UPDATE SCENE PROPERTIES
      this.isGameOver = false;
      this.userType = newUser ? 'newUser' : (winUser ? 'winUser' : 'default');

      // ✅ UNLOCK UI ELEMENTS
      this.unblur10PuzzleButton(); // Hapus blur tombol 10 puzzle
      this.unlockGameAfterPurchase(); // Aktifkan tombol Play & Puzzle

      // ✅ UPDATE GLOBAL VARIABLES
      if (typeof window !== 'undefined') {
        window.level01Score = level01Score || 100;
        window.playerScore = level01Score || 100;
      }

      console.log('✅ Game unlocked successfully! User can now play.');
      console.log(`🎮 New user status: ${this.userType}`);
      console.log(`📊 New score: ${level01Score || 100}`);
      
      return true;
    } else {
      console.warn('❌ Unlock request failed:', unlockRes.data);
      return false;
    }
   
  } catch (err) {
    console.error('Unlock level error:', err);

    // ✅ NO ALERT - JUST LOG:
    console.log('❌ Unlock process failed - user should refresh page');
    return false;
  }
}

//======================================= BATAS 7 FUNGSI ========================================
// FUNGSI UNTUK SYNC DATA DARI BACKEND KE LOCAL STORAGE DAN WINDOW SETIAP KALI LOGIN ATAU RELOAD
  // ✅ PERBAIKAN LENGKAP: syncProgressFromBackend function sekitar line 265-320
async syncProgressFromBackend(email) {
  try {
    console.log('🔄 Syncing progress from backend for:', email);
    
    // ✅ STEP 1: Ambil data dari localStorage sebagai fallback
    const localData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
    const localProgress = localData.gameProgress || {};
    
    console.log('📱 Local data:', localProgress);
    
    // ✅ STEP 2: Kirim request ke backend dengan data lokal sebagai konteks
    const response = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/progress`,
      { 
        email, 
        level: 'Level01Scene',
        // Kirim data lokal untuk perbandingan
        localProgress: localProgress
      },
      { timeout: 200000 }
    );
    
    // ✅ STEP 3: Ambil data dari backend (PRIORITAS UTAMA)
    const backendData = response.data;
    const progress = backendData.progress || {};
    
    console.log('🌐 Backend data:', progress);

    // ✅ STEP 4: SELALU GUNAKAN DATA BACKEND sebagai sumber truth
    const finalData = {
      level01Score: progress.level01Score || 0,
      level01HighScore: progress.level01HighScore || 0,
      totalPlays: progress.totalPlays || 0,
      level01Completed: progress.level01Completed || false,
      bestTime: progress.bestTime || 0,
      averageTime: progress.averageTime || 0,
      completionRate: progress.completionRate || 0,
      perfectGames: progress.perfectGames || 0,
      totalAttempts: progress.totalAttempts || 0,
      gameOvers: progress.gameOvers || 0,
      favoriteGiven: progress.favoriteGiven || false,
      lastPlayedDate: progress.lastPlayedDate || new Date().toISOString()
    };
    
    // ✅ STEP 5: Hitung user classification berdasarkan data backend
    const newUser = finalData.totalPlays === 0;
    const winUser = finalData.totalPlays > 0 && (finalData.level01Score > 0 || finalData.level01HighScore > 0);
    const lossUser = finalData.totalPlays >= 3 && finalData.level01Score === 0 && finalData.level01HighScore === 0;

    console.log(`👤 Backend user classification: newUser=${newUser}, winUser=${winUser}, lossUser=${lossUser}`);
    
    // ✅ STEP 6: UPDATE localStorage dengan data backend (FORCE UPDATE)
    const updatedUserData = {
      gameProgress: finalData,
      newUser,
      winUser,
      lossUser,
      lastSyncTime: new Date().toISOString(),
      syncedFromBackend: true
    };

    // Update gameData
    localStorage.setItem(`gameData-${email}`, JSON.stringify(updatedUserData));
    
    // Update score
    localStorage.setItem(`score_${email}`, (finalData.level01Score || 0).toString());
    
    // Update game history
    localStorage.setItem(`gameHistory_${email}`, JSON.stringify({
      hasPlayedBefore: (finalData.totalPlays || 0) > 0,
      totalGamesPlayed: finalData.totalPlays || 0,
      highestScore: finalData.level01HighScore || 0,
      gameOvers: finalData.gameOvers || 0,
      lastPlayedDate: finalData.lastPlayedDate,
      favoriteGiven: finalData.favoriteGiven || false,
      newUser,
      winUser,
      lossUser
    }));
    
    // ✅ STEP 7: UPDATE global variables
    window.level01Score = finalData.level01Score || 0;
    window.playerScore = finalData.level01Score || 0;
    
    // ✅ STEP 8: UPDATE UI jika scene sudah aktif
    if (window.Phaser && window.game && window.game.scene) {
      const level01 = window.game.scene.getScene('Level01Scene');
      if (level01 && level01.scene && level01.scene.isActive()) {
        // Update score di scene
        if (level01.level01Score !== undefined) {
          level01.level01Score = finalData.level01Score || 0;
        }
        // Update scoreText
        if (level01.scoreText && typeof level01.scoreText.setText === 'function') {
          level01.scoreText.setText((finalData.level01Score || 0).toString().padStart(5, '0'));
        }
        console.log('🎮 Scene updated with backend data');
      }
    }

    console.log('✅ Synced progress from backend - Final data:', finalData);
    console.log('✅ User status:', { newUser, winUser, lossUser });
    
    return {
      progress: finalData,
      newUser,
      winUser,
      lossUser,
      success: true
    };
    
  } catch (err) {
    console.error('❌ Failed to sync progress from backend:', err);
    
    // ✅ FALLBACK: Jika backend gagal, gunakan data lokal
    const localData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
    const localProgress = localData.gameProgress || {};
    
    console.log('🔄 Using local fallback data:', localProgress);
    
    return {
      progress: localProgress,
      newUser: localData.newUser || false,
      winUser: localData.winUser || false,  
      lossUser: localData.lossUser || false,
      success: false,
      error: err.message
    };
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
    console.log('✅ updateGameScore dipanggil:', email,scoreStatus.currentScore);
    
    // Sembunyikan loginBox, tampilkan logoutBtn
    const loginBox = document.getElementById("loginBox");
    const logoutBtn = document.getElementById("logoutBtn");
    if (loginBox) loginBox.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  
    // Panggil sync progress dari backend di sini
    syncProgressFromBackend(email);
    } else {
    const loginBox = document.getElementById("loginBox");
    const logoutBtn = document.getElementById("logoutBtn");
    if (loginBox) loginBox.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
  
//======================================================================================
// HANDLE SEANDBEACON
// ✅ SEANDBEACON KIRIM DATA KE BACKEND
// ✅ BEFOREUNLOAD YANG BENAR DAN LENGKAP - PROTEKSI PENUH
window.addEventListener('beforeunload', (event) => {
  const email = localStorage.getItem('email');
  if (!email) {
    console.log('🚫 No email found - skipping beforeunload');
    return;
  }

  console.log('🔄 beforeunload triggered for:', email);

  try {
    // ✅ AMBIL CURRENT SCORE DAN HIGH SCORE YANG TERAKHIR
    let currentScore = 0;
    let highScore = 0;
    let timeElapsed = 0;
    let gameResult = 'unknown';
    let hasValidData = false;

    // 1. Dari scene yang aktif (PRIORITAS TERTINGGI)
    if (window.game && window.game.scene) {
      const level01 = window.game.scene.getScene('Level01Scene');
      if (level01) {
        // Ambil current score dari game (bisa lebih rendah dari high score)
        if (level01.level01Score !== undefined) {
          currentScore = level01.level01Score;
          hasValidData = true;
        }
        
        // Ambil high score
        if (level01.level01HighScore !== undefined) {
          highScore = Math.max(highScore, level01.level01HighScore);
        }
        
        timeElapsed = level01.timeElapsed || 0;
        gameResult = level01.gameWon ? 'won' : (level01.gameCompleted ? 'lost' : 'unknown');
        
        console.log(`🎮 Scene data: current=${currentScore}, high=${highScore}, result=${gameResult}`);
      }
    }

    // 2. Dari localStorage current score
    const localCurrentScore = parseInt(localStorage.getItem(`score_${email}`) || '0');
    if (localCurrentScore >= 0) {
      currentScore = Math.max(currentScore, localCurrentScore);
      hasValidData = true;
    }

    // 3. Dari localStorage high score
    const localHighScore = parseInt(localStorage.getItem(`highScore_${email}`) || '0');
    highScore = Math.max(highScore, localHighScore);

    // 4. Dari gameData
    const userData = JSON.parse(localStorage.getItem(`gameData-${email}`) || '{}');
    const gameProgress = userData.gameProgress || {};
    
    if (gameProgress.level01Score >= 0) {
      currentScore = Math.max(currentScore, gameProgress.level01Score);
      hasValidData = true;
    }

    if (gameProgress.level01HighScore > 0) {
      highScore = Math.max(highScore, gameProgress.level01HighScore);
    }

    // 5. ✅ PERBAIKAN: High score BISA SAMA dengan current score (jika current score adalah yang tertinggi)
    // TAPI high score TIDAK BOLEH lebih rendah dari current score
    highScore = Math.max(highScore, currentScore);

    console.log(`📊 Final beforeunload data: current=${currentScore}, high=${highScore}, valid=${hasValidData}`);

    // ✅ KIRIM DATA JIKA VALID (TERMASUK SCORE YANG TURUN)
    if (hasValidData || currentScore > 0) {
      // ✅ UPDATE localStorage dulu dengan logic yang benar
      localStorage.setItem(`score_${email}`, currentScore.toString());
      
      // ✅ HIGH SCORE: Hanya update jika lebih tinggi dari yang sudah ada
      const existingHighScore = parseInt(localStorage.getItem(`highScore_${email}`) || '0');
      const finalHighScore = Math.max(highScore, existingHighScore);
      if (finalHighScore > existingHighScore) {
        localStorage.setItem(`highScore_${email}`, finalHighScore.toString());
        console.log(`🏆 beforeunload: High score updated ${existingHighScore} → ${finalHighScore}`);
      }

     const dataToSend = {
        email,
        level01Completed: currentScore > 0,
        level01Score: currentScore, // ✅ Current score (terakhir yang diperoleh)
        level01HighScore: finalHighScore, // ✅ High score (tertinggi sepanjang masa)
        completionTime: timeElapsed,
        gameResult: gameResult,
        // ✅ FLAGS
        updateCurrentScore: true, // ✅ Selalu update current score
        updateHighScore: finalHighScore > existingHighScore, // ✅ Hanya update high score jika lebih tinggi
        preserveHighScore: true,
        allowScoreDecrease: true,
        isNewHighScore: finalHighScore > existingHighScore,
        source: 'beforeunload_fixed',
        timestamp: new Date().toISOString()
      };

      console.log('📤 Sending beforeunload data:', dataToSend);

      navigator.sendBeacon(
        `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
        new Blob([JSON.stringify(dataToSend)], { type: 'application/json' })
      );

      console.log('✅ sendBeacon sent - Current:', currentScore, 'High:', finalHighScore);
    }

  } catch (error) {
    console.error('❌ Error in beforeunload:', error);
  }
}); 

//========================================================================================================================
// ✅ JUGA TAMBAHKAN EVENT UNTUK VISIBILITYCHANGE (BACKUP)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    const email = localStorage.getItem('email');
    if (!email) return;

    console.log('👁️ Page hidden - quick save triggered');
    
    // Quick save tanpa validation ketat
    const quickScore = parseInt(localStorage.getItem(`score_${email}`) || '0');
    if (quickScore > 0) {
      const quickData = {
        email,
        level01Score: quickScore,
        level01HighScore: quickScore,
        source: 'visibilitychange',
        timestamp: new Date().toISOString(),
        preserveHighScore: true
      };
      
      navigator.sendBeacon(
        `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
        new Blob([JSON.stringify(quickData)], { type: 'application/json' })
      );
      
      console.log('📤 Quick save sent via visibilitychange');
    }
  }
});
//==================================================================================================================
// ✅ TAMBAHKAN FUNCTION UNTUK MANUAL SAVE (BISA DIPANGGIL DARI LEVEL01SCENE)
window.manualSaveProgress = function(email, gameData) {
  if (!email || !gameData) {
    console.log('🚫 Manual save skipped - invalid data');
    return false;
  }

  try {
    const dataToSend = {
      email,
      level01Completed: gameData.completed || false,
      level01Score: gameData.score || 0,
      level01HighScore: gameData.highScore || gameData.score || 0,
      completionTime: gameData.time || 0,
      gameResult: gameData.result || 'manual',
      source: 'manual_save',
      timestamp: new Date().toISOString(),
      preserveHighScore: true,
      onlyUpdateIfHigher: true
    };

    // Update localStorage
    localStorage.setItem(`score_${email}`, (gameData.score || 0).toString());
    
    const userData = JSON.parse(localStorage.getItem(`gameData-${email}`) || '{}');
    userData.gameProgress = {
      ...userData.gameProgress,
      level01Score: gameData.score || 0,
      level01HighScore: Math.max(gameData.highScore || 0, userData.gameProgress?.level01HighScore || 0),
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(`gameData-${email}`, JSON.stringify(userData));

    // Kirim ke backend
    navigator.sendBeacon(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
      new Blob([JSON.stringify(dataToSend)], { type: 'application/json' })
    );

    console.log('✅ Manual save completed:', dataToSend);
    return true;
  } catch (error) {
    console.error('❌ Manual save failed:', error);
    return false;
  }
}; 
//==========================================================================================================

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

  // ✅ TAMBAHKAN LOADING TEXT
  const loadingText = this.add.text(233, 350, 'Checking status...', {
    fontSize: '18px',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
  }).setOrigin(0.5).setDepth(30);  

  const email = localStorage.getItem("email");
  console.log('Email di localStorage:', email);

  if (!email) {
    // ✅ HIDE LOADING INDICATORS JIKA ERROR
    level1Glow.setVisible(false);
    btnBlue.setVisible(false);
    loadingText.destroy();
    document.getElementById("loginBox").style.display = "block";
    alert("Please Login with your email!");
    return;
  }
    
  try {
    // ✅ STEP 1: CEK PAYMENT STATUS DULU (PRIORITAS TERTINGGI)
    loadingText.setText('Checking payment status...');
    
     // ✅ TAMBAH AUTO PAYMENT CHECK DI SINI (line 437-438): tamabah 070825
    console.log('🔍 Auto checking payment status for:', email);
    try {
      // ✅ CEK PAYMENT STATUS SEBELUM LOCK
      const paymentData = await window.checkPaymentStatusFromBackend(email);
      if (paymentData && paymentData.isPaid === true) {
      console.log('✅ Payment detected! Auto-unlocking game...');
      loadingText.destroy();  
     
      this.scene.start("Level01Scene", { 
        isGameOver: false, 
        isPaid: true,
        userType: 'paidUser'
        //level01Score: userData.level01Score || 0 
      });
      return; // ✅ STOP EXECUTION DISINI
    }
    
    // ✅ STEP 2: AMBIL STATUS USER SEKALI SAJA
    loadingText.setText('Getting user data...');
  
    // Tambahkan timeout untuk memastikan backend response
    const status = await Promise.race([
      this.checkUserStatusAndGameOver(email),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 15000)
      )
    ]);

    if (!status) {
      // ✅ HIDE LOADING SEBELUM ALERT
      level1Glow.setVisible(false);
      btnBlue.setVisible(false);
      loadingText.destroy();
      alert("Failed to connect to server. Please try again.");
      return;
    }

    // ✅ STEP 3: KLASIFIKASI USER BERDASARKAN STATUS
    const progress = status.progress || {};
    const totalPlays = progress.totalPlays || 0;
    const currentScore = progress.level01Score || 0;
    
    const newUser = totalPlays === 0;
    const winUser = totalPlays >= 0 && currentScore > 0;
    const lossUser = totalPlays >= 3 && currentScore === 0;

    console.log(`👤 User: totalPlays=${totalPlays}, score=${currentScore}`);
    console.log(`👤 Classification: new=${newUser}, win=${winUser}, loss=${lossUser}`);

    // ✅ STEP 4: TENTUKAN AKSI BERDASARKAN KLASIFIKASI
    loadingText.setText('Starting game...');

     if (newUser) {
      console.log('🙂 New User - Welcome!');
      loadingText.destroy();
      this.scene.start("Level01Scene", { 
        isGameOver: false, 
        userType: 'newUser',
        level01Score: currentScore
      });
      return; // ✅ STOP EXECUTION
    }

    if (winUser) {
      console.log('😄 Win User - Game unlocked!');
      loadingText.destroy();
      this.scene.start("Level01Scene", { 
        isGameOver: false, 
        userType: 'winUser',
        level01Score: currentScore
      });
      return; // ✅ STOP EXECUTION
    }

    if (lossUser) {
      console.log('😔 Loss User - Need to purchase');
      loadingText.destroy();
      this.scene.start("Level01Scene", { 
        isGameOver: true, 
        userType: 'lossUser',
        level01Score: currentScore
      });
      return; // ✅ STOP EXECUTION
    }
   
    // ✅ FALLBACK - jika tidak masuk kategori manapun
     console.log('🎮 Default case - proceeding to game');
     loadingText.destroy();
     this.scene.start("Level01Scene", { 
        isGameOver: false, 
        userType: 'default',
        level01Score: currentScore
     });
    
     } catch (error) {
    console.error('❌ Error in level1 click handler:', error);
    level1Glow.setVisible(false);
    btnBlue.setVisible(false);
    loadingText.destroy();
    alert("Error: " + error.message);
  }

    // ✅ GUNAKAN loadingText YANG SUDAH ADA DARI LINE 746:
    
    loadingText.setPosition(960, 850); // Pindah posisi jika perlu
    if (loadingText && !loadingText.scene) {
  // Recreate loadingText if destroyed
      loadingText = this.add.text(960, 850, 'Loading assets...', {
      fontSize: '18px',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: { left: 10, right: 10, top: 5, bottom: 5 }
  }).setOrigin(0.5).setDepth(30);
} else if (loadingText) {
  loadingText.setText('Loading assets...');  
  }

    // ========== LAZY LOAD LEVEL01 ASSETS ==========
      console.log('🎵 Lazy loading Level01 assets...');
      this.lazyLoadLevel01Assets(async () => {
        // Setelah loading selesai, pindah ke Level01
        loadingText.destroy();
        level1Glow.setVisible(false);
        btnBlue.setVisible(false);
      });
    } catch (error) {
      // ✅ HIDE LOADING INDICATORS SAAT ERROR
    level1Glow.setVisible(false);
    btnBlue.setVisible(false);
    loadingText.destroy();

    console.error('❌ Critical error in user status check:', error);  
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
    //this.load.image("text2", "./Puzzle-AssetsUI/Text Level 02.webp");
    this.load.audio("music", "./Puzzle-Assets/Sfx/scenes/splash02_music_cowboy_western_background.mp3");
    this.load.audio("herdGallop", "./Puzzle-Assets/Sfx/sound/herd_gallop.mp3");
    this.load.image("flower", "./Puzzle-Assets/Splash/Flower orange red.webp");
    this.load.image("flowerR", "./Puzzle-Assets/Splash/Red Cactus Flower.webp");
    this.load.image("grass", "./Puzzle-Assets/Splash/Cutting Grass.webp");
    this.load.image("grass02", "./Puzzle-Assets/Splash/Grass02.webp");
    //this.load.image("text2glow", "./Puzzle-AssetsUI/Sp. Text Level 02 Glow.webp");
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
    console.log('🎵 Starting Level01 lazy loading assets...');

    // ✅ LOAD ESSENTIAL LEVEL01 ASSETS (UNCOMMENT YANG DIBUTUHKAN):
    // Music Level01
    //this.load.audio('introMusic', './Puzzle-Assets/Sfx/scenes/level01-1-herdhorses-guitar-intro-ident.mp3');
    //this.load.audio('mainMusic', './Puzzle-Assets/Sfx/scenes/level01-2 music-favorite-sunset-dreams.mp3');
    //this.load.audio('winMusic', './Puzzle-Assets/Sfx/scenes/win-in-the-video-game.mp3');
    //this.load.audio('horseNeigh', './Puzzle-Assets/Sfx/sound/horse-neigh.mp3');
    //this.load.audio('horseSnort', './Puzzle-Assets/Sfx/sound/horse-snort.mp3');
    //this.load.audio('horseHoof', './Puzzle-Assets/Sfx/sound/hoof-run.mp3');
    //this.load.audio('horsehoofstep', './Puzzle-Assets/Sfx/sound/hoof-step.mp3');
    //this.load.audio('horseGallop', './Puzzle-Assets/Sfx/sound/blackhorse-gallop.mp3');
    //this.load.audio('herdGallop', './Puzzle-Assets/Sfx/sound/herd-gallop.mp3');


    // Essential Level01 images
    //this.load.image('horse', './Puzzle-Assets/UI/GM. Black Horse Run Behind.webp');
    // this.load.image('paypalQR', './Puzzle-Assets/UI/paypal-qr.webp');

   // ✅ EVENT LISTENER UNTUK LOADING COMPLETE: 
   this.load.once('complete', () => {
    console.log('✅ Level01 audio assets loaded successfully!');

    // ✅ SAFETY CHECK CALLBACK:
    if (typeof callback === 'function') {
      console.log('🎯 Executing callback...');
      callback();
    } else {
      console.warn('⚠️ Callback is not a function:', typeof callback);
    }
  }); 
   
  // ✅ EVENT LISTENER UNTUK ERROR HANDLING:
  this.load.once('loaderror', (fileObj) => {
    console.error('❌ Error loading asset:', fileObj);
    
    // ✅ TETAP JALANKAN CALLBACK MESKI ADA ERROR:
    if (typeof callback === 'function') {
      console.log('🎯 Executing callback despite error...');
      callback();
    }
  });

  // ✅ TIMEOUT FALLBACK JIKA LOADING TERLALU LAMA:
  const loadingTimeout = setTimeout(() => {
    console.warn('⏰ Loading timeout - forcing callback execution');
    if (typeof callback === 'function') {
      callback();
    }
  }, 15000); // 15 detik timeout

  // ✅ CLEAR TIMEOUT SAAT LOADING SELESAI:
  this.load.once('complete', () => {
    clearTimeout(loadingTimeout);
  });

  // ✅ START LOADING:
  console.log('🚀 Starting Level01 audio assets load...');
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