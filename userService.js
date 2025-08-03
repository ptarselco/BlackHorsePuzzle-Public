import axios from 'axios';

// 1. Fungsi GET user progress
export async function  getUserProgress(email) {
  try {
    const res = await axios.post(
    `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/progress`,
    //'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/progress', {
      {}, // body kosong, karena email sudah di URL param
    { timeout: 20000 }
    );
    // Response: { success, progress, user }  
    return res.data; // progress: { level01Score, level01HighScore, totalPlays, ... }
  } catch (err) {
    console.error('❌ Get user progress error:', err);
    return null;
  }
}

// 2. UPDATE FUNCTION FOR USER PROGRESS
export async function updateUserProgress(email, progress) {
 try {
    const res = await axios.post(
      `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`,
      { ...progress },
      { timeout: 20000 }
    );
    return res.data.success === true;
  } catch (err) {
    console.error('❌ Update user progress error:', err);
    return false;
  }
}
// 3. GET USER STATUS DARI BACKEND (POST)
export async function getUserStatus(email, level = 'Level01, Level01Scene') {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/status',
      { email: email.toLowerCase().trim(), level },
      { timeout: 20000 }
    );
    return res.data;
  } catch (error) {
    console.error('❌ Error getUserStatus:', error);
    return null;
  }
}

//  GABUNGKAN CHECK USER STATUS DAN GAME OVER
export async function checkUserStatusAndGameOver(email) {
  // Ambil status user dari backend (POST)
  const status = await this.getUserStatus(email, 'Level01, Level01Scene');
  if (!status) {
    console.error('Gagal ambil status user');
    return null;
  }

  // Cek status user lama/baru
  const isUserBaru = !status.totalPlays || status.totalPlays === 0;

  // Jika user baru, aktifkan tombol Play & Puzzle
  if (isUserBaru) {
    this.isGameOver = false;
    this.unblur10PuzzleButton && this.unblur10PuzzleButton();
    console.log('✅ User baru - tombol Play & Puzzle diaktifkan');
    return status;
  }

  // Cek status game over untuk user lama
  if (status.isGameOver) {
    if (status.score > 0) {
      status.isGameOver = false;
      localStorage.setItem(`gameData-${email}`, JSON.stringify(status));
      this.isGameOver = false;
      // Lanjutkan main
      return status;
    } else {
      this.isGameOver = true;
      this.showGameOverReturnMessage();
      this.lockAllGameplayButtons();
      return status;
    }
  }

// Tambah totalPlays setiap kali fungsi ini dipanggil (untuk user lama)
  status.totalPlays = (status.totalPlays || 0) + 1;

  // Jika totalPlays >= 3 dan score masih 0, set game over
  if (status.totalPlays >= 3 && (status.score || 0) === 0) {
    await this.setGameOver(email, true); // gunakan fungsi async
    status.isGameOver = true;
    localStorage.setItem(`gameData-${email}`, JSON.stringify(status));
    this.isGameOver = true;
    this.showGameOverReturnMessage();
    this.lockAllGameplayButtons();
    return status;
  }

  // Simpan totalPlays terbaru ke localStorage
  localStorage.setItem(`gameData-${email}`, JSON.stringify(status));

  // Jika lolos semua, aktifkan tombol Play & Puzzle
  this.isGameOver = false;
  this.unblur10PuzzleButton && this.unblur10PuzzleButton();
  return status;
}

// 4. Fungsi SET GAME OVER (async)
export async function setGameOver(email, isGameOver = true) {
  try {
    await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/set-gameover',
      { email, isGameOver },
      { timeout: 20000 }
    );
    return true;
  } catch (err) {
    console.error('Set game over error:', err);
    return false;
  }
}

// 5. CHECK GAME OVER STATUS DARI SERVER
export async function checkGameOverStatusFromServer() {
  const email = localStorage.getItem('playerEmail');
  if (!email) return;

  try {
    const response = await axios.post('https://backend-paypalblackhorsepuzzle.onrender.com/api/users/gameover', 
      { email },
      { timeout: 20000 }  
    );
    const data = response.data;
    if (data.isGameOver) {
      this.isGameOver = true;
      this.showGameOverReturnMessage();
      await this.lockLevel(email, 'Level01');
      //this.lockAllGameplayButtons();
      return;
    }
    } catch (err) {
    // Fallback ke localStorage jika backend gagal
    const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
    if (isLocked) {
      this.showGameOverReturnMessage();
      this.lockAllGameplayButtons();
      await this.lockLevel(email, 'Level01');
      return;
    }
    console.error('Error checking game over status:', err);
    }
}

// 6. LOCK LEVEL (mengunci akses level untuk user)
export async function lockLevel(email, level) {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/lock',
      { email, level },
      { timeout: 20000 }
    );
    // Tambahkan blur tombol di sini
    if (this.isGameOver) {
    this.blur10PuzzleButton();
    }
    return res.data.success === true;
  } catch (err) {
    // Fallback ke localStorage jika backend gagal
  const isLocked = localStorage.getItem(`gameOver_${email}`) === 'true';
  if (isLocked) {
    this.isGameOver = true;
    this.showGameOverReturnMessage();
    await this.lockLevel(email, 'level01'); // Lock backend & frontend jika game over
    return;
  }
  // Jika tidak game over, tidak perlu lock
  console.error('Error checking game over status:', err);
  return false;
  }
}

// 7. UNLOCK LEVEL
export async function  unlockedLevels(email, level) {
  try {
    const res = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/unlock',
      { email, level: 'Level01Scene' },
      { timeout: 20000 }
    );
   const hasPaid = statusRes.data.isPaid === true;

    if (!hasPaid) {
      console.warn('User belum melakukan pembayaran.');
      return false;
    } 

    // Jika sudah bayar, lanjut unlock level
    const unlockRes = await axios.post(
      'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/unlock',
      { email, level },
      { timeout: 20000 }
    );
    this.unblur10PuzzleButton(); // Hapus blur tombol 10 puzzle
    return unlockRes.data.success || unlockRes.data.unlocked === true;
    // Response backend bisa { success: true, unlocked: true }
    //return res.data.success || res.data.unlocked === true;
  } catch (err) {
    console.error('Unlock level error:', err);
    return false;
  }
}

// Fungsi SAVE SCORE KE BACKEND
//export async function saveScoreToBackend(email, score) {
  //try {
    //await axios.post(
      //'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/score',
      //{ email, score }
    //);
    //return true;
  //} catch (err) {
    //console.error('❌ Error saveScoreToBackend:', err);
    //return false;
  //}
//}

// SEND SCORE TO BACKEND (KIRIM SKOR KE BACKEND SETELAH USER SELESAI LEVEL)
// export async function updateScoreLevel01(email, score) {
 // Ambil score dari localStorage jika ada
  //let userData = JSON.parse(localStorage.getItem(`gameData-${email}`)) || {};
  //userData.gameProgress = userData.gameProgress || {};
  
  // Simpan score terbaru ke localStorage
  //userData.gameProgress.level01Score = this.score;
  //localStorage.setItem(`gameData-${email}`, JSON.stringify(userData)); 
  //try {
    //const res = await axios.post(
      //'https://backend-paypalblackhorsepuzzle.onrender.com/api/users/update-score',
      //{ email, score },
      //{ timeout: 20000 }
    //);
    //const data = res.data;
    //if (data.success) {
      //console.log('Score updated:', data.level01Score, 'High Score:', data.level01HighScore);
    //}
  //} catch (err) {
    //console.error('Failed to save score:', err);
  //}
//}
