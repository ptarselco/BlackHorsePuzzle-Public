// Level02Scene.js
// Non-module version with CDN tanpa import Phaser from "phaser";

class Level02Scene extends Phaser.Scene {
  constructor() {
    super("Level02Scene");
  }

  preload() {
   // Loader untuk text saat loading --> please wait (Co)
   document.getElementById('loader').style.display = 'flex'; 

     
    // Load puzzle pieces dan background board
   //for (let i = 1; i <= 16; i++) {
     // this.load.image(`hex${i}`, "../Puzzle-Assets/Level02/Lv.02 Hex-" + i.toString().padStart(2, '0') + ".webp");
    //}
    this.load.image("board", "../Puzzle-Assets/Level02/Bord Game Puzzle Level-02.webp");
   // this.load.image("cowboyHat", "../Puzzle-Assets/Level02/cowboy-black-hat-win.webp");
     this.load.image('donationPanel', './Puzzle-Assets/UI/BLACK-HORSE-DONATION-PANEL.webp'); // Your donation image
      this.load.on('filecomplete-image-donationPanel', () => {
    console.log('✅ donationPanel loaded!');
    });

    
     // Load semua efek suara untuk Level 02
    this.load.audio("neigh", "../Puzzle-Assets/Sfx/sound/horse-neigh.mp3");
    this.load.audio("snort", "../Puzzle-Assets/Sfx/sound/horse-snort.mp3");
    this.load.audio("hoof", "../Puzzle-Assets/Sfx/sound/hoof-step.mp3");
    this.load.audio("gallop", "../Puzzle-Assets/Sfx/sound/blackhorse-gallop.mp3");
    this.load.audio("win", "../Puzzle-Assets/Sfx/scenes/win-in-the-video-game.mp3");
 

 // Sembunyikan loader please wait (dari Co)
  this.load.on('complete', () => {
    document.getElementById('loader').style.display = 'none';
  
  // Tampilkan loginBox jika user belum login
 if (!localStorage.getItem("email")) {
  document.getElementById("loginBox").style.display = "block";
   document.getElementById("logoutBtn").style.display = "none";
} else {
  document.getElementById("loginBox").style.display = "none";    document.getElementById("logoutBtn").style.display = "inline-block";
} 
}); 
} 

  create() {
    console.log("Level02 create, login:", localStorage.getItem("email"));
    if (!localStorage.getItem("email")) {
    console.log("Belum login, kembali ke SplashScene"); 
   this.scene.start('SplashScene');
    return;
  }

  const email = localStorage.getItem("email");
  if (!email) {
  this.scene.start('SplashScene');
  return;
}
  let playerScore = 0;
 // ✅ ENHANCED SAFETY CHECK in updateGameScore function:
    if (email) {
    const scoreStatus = checkPlayerScoreStatus(email); 
    updateGameScore(email, scoreStatus.currentScore);
    //updateGameScore(email,scoreStatus.currentScore);
    console.log('✅ updateGameScore dipanggil:', email,scoreStatus.currentScore);
    }

  // Panggil sync progress dari backend di sini
  if (email) {
    syncProgressFromBackend(email); // ← panggil di sini
  }
  
 

  // Update progress ke backend saat tab ditutup atau pindah

  // Tambahkan juga untuk visibilitychange (tab pindah/fokus hilang)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && email) {
      const progress = {
        level01Score: this.level01Score || 0,
        totalPlays: this.totalPlays || 0,
        isGameOver: this.isGameOver || false
      };
      const url = `https://backend-paypalblackhorsepuzzle.onrender.com/api/users/${encodeURIComponent(email)}/update-progress`;
      navigator.sendBeacon(url, JSON.stringify(progress));
    }
  });

  this.add.image(960, 640, "board");

  //if (data && data.showDonation) {
    //this.showDonationDisplay();
//}

  // ✅ CHECK IF COMING FROM DONATION CLICK
  //if (this.scene.settings.data && this.scene.settings.data.fromDonation) {
    //this.time.delayedCall(300, () => {
     // this.showDonationDisplay();
    //});
  //}

  this.add.text(960, 640, "Coming Soon", {
  font: "bold 80px Segoe UI",
  fill: "#fff",
  stroke: "#00eaff",
  strokeThickness: 8,
  align: "center"
}).setOrigin(0.5).setDepth(2000);

// Tombol BACK di Level02Scene
//const backBtn = this.add.image(100, 1010, 'back').setScale(0.9).setInteractive({ useHandCursor: true });
//backBtn.on('pointerdown', () => {
  //const currentData = this.scene.settings.data || {}; 
  //this.scene.start('Level01Scene', { // Atau SplashScene jika ingin langsung ke menu utama
  //preserveGameOver: currentData.preserveGameOver || false,
    //returnFromLevel02: true
//});
//}); 



// ✅ REPLACE with timer cleanup:
const backBtn = this.add.image(100, 1010, 'back').setScale(0.9).setDepth(6001).setInteractive({ useHandCursor: true });

backBtn.on('pointerdown', () => {
 // Bersihkan donasi jika sedang tampil
  if (this.donationTimer) {
    this.donationTimer.destroy();
    this.donationTimer = null;
  }
  if (this.donationOverlay) {
    this.closeDonationDisplay();
  }
  this.sound.stopAll();
  this.time.delayedCall(100, () => {
    const currentData = this.scene.settings.data || {};
    this.scene.start('Level01Scene', {
      preserveGameOver: currentData.preserveGameOver || false,
      returnFromLevel02: true
    });
  });

  console.log('⬅️ Back button clicked - stopping timers...');
  
  // ✅ STOP DONATION TIMER FIRST (critical!) bersihkan donasi sedang tampil
  if (this.donationTimer) {
    this.donationTimer.destroy();
    this.donationTimer = null;
    console.log('⏰ Donation timer stopped');
  }
  
  // ✅ CLEANUP ANY ACTIVE DONATION
  if (this.donationOverlay) {
    console.log('🧹 Cleaning donation display...');
    this.closeDonationDisplay();
  }
  

  // ✅ PREVENT DOUBLE CLICKS
  //backBtn.removeInteractive();
  
  // ✅ STOP ALL SOUNDS
  this.sound.stopAll();
  
  // ✅ SMALL DELAY FOR CLEANUP
  this.time.delayedCall(100, () => {
    const currentData = this.scene.settings.data || {};
    console.log('🔄 Transitioning to Level01Scene...');
    
    this.scene.start('Level01Scene', {
      preserveGameOver: currentData.preserveGameOver || false,
      returnFromLevel02: true
    });
  });
  });
// ...existing code in create()...

// PANGGIL INI DI DALAM create(data), SETELAH TOMBOL BACK DIBUAT
if (this.scene.settings.data && this.scene.settings.data.showDonation) {
  this.showDonationDisplay();
}

// ESC handler untuk panel EXIT
this.isExitPanelShown = false;
this.input.keyboard.on('keydown-ESC', () => {
  if (this.isExitPanelShown) {
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

 const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem('email');
      this.scene.start('SplashScene');
    };
  }

// Sound effects
    // Mainkan seluruh reaksi suara secara bertahap
   // this.time.addEvent({ delay: 3000, callback: () => this.sound.play("neigh"), loop: true });
   // this.time.addEvent({ delay: 6000, callback: () => this.sound.play("snort"), loop: true });
   // this.time.addEvent({ delay: 9000, callback: () => this.sound.play("hoof"), loop: true });
   // this.time.addEvent({ delay: 12000, callback: () => this.sound.play("gallop"), loop: true });
    // ✅ NEW (limited repeats):
    this.time.addEvent({ delay: 3000, callback: () => this.sound.play("neigh"), repeat: 3 });
    this.time.addEvent({ delay: 6000, callback: () => this.sound.play("snort"), repeat: 2 });
    this.time.addEvent({ delay: 9000, callback: () => this.sound.play("hoof"), repeat: 4 });
    this.time.addEvent({ delay: 12000, callback: () => this.sound.play("gallop"), repeat: 2 });
  }


  // ✅ DONATION DISPLAY FUNCTION dengan CLICKABLE PAYPAL LINK
showDonationDisplay() {
  // Create donation overlay
  this.donationOverlay = this.add.rectangle(960, 640, 1920, 1280, 0x000000, 0.88)
    .setDepth(5000)
   // .setInteractive(); // Block clicks behind
  
  // Show donation image (clickable)
  this.donationImage = this.add.image(960, 640, 'donationPanel')
    //.setDisplaySize(900, 700) // Perfect barcode size
    .setScale(1)
    .setDepth(5001)
    .setInteractive({ useHandCursor: true }); // Make clickable
  
  // ✅ DONATION BUTTON WITH PROPER FUNCTION CALL:
  //this.donationButton = this.add.text(config.width - 20, 20, 'Donation', {
  this.donationButton = this.add.text(this.sys.game.config.width - 20, 20, 'Donation', {
    fontSize: '18px',
    fill: '#00eaff',
    backgroundColor: '#222',
    padding: { x: 12, y: 6 }
  })
  .setOrigin(1, 0)
  .setDepth(9999)
  .setInteractive()
  .on('pointerdown', () => {
    this.showDonationDisplay(); 
    console.log('🎁 Donation button clicked from Level02Scene');
    
    // ✅ CALL GLOBAL DONATION FUNCTION:
    if (window.showDonation && typeof window.showDonation === 'function') {
      window.showDonation();
    } else {
      console.error('❌ showDonation function not found');
      alert('Donation feature not available');
    }
  });

  // ✅ DONATION IMAGE CLICK - OPEN PAYPAL.ME
  this.donationImage.on('pointerdown', () => {
    // Replace with your actual PayPal.me link
    const paypalLink = 'https://paypal.me/lusibiz?country.x=ID&locale.x=en_US';
    window.open(paypalLink, '_blank');
    
    // Show thank you message
    this.showDonationThankYou();
  });
  // Hover effect on donation image
  this.donationImage.on('pointerover', () => {
   // this.donationImage.setDisplaySize(920, 720); // Slightly bigger on hover
    //this.donationImage.setScale(0.88);
    this.donationImage.setTint(0xdddddd); // Slight highlight
  });
  
  this.donationImage.on('pointerout', () => {
   // this.donationImage.setDisplaySize(900, 700); // Back to original size
    //this.donationImage.setScale(0.85);
    this.donationImage.clearTint();
  })
  
  // Welcome message
  const welcomeMsg = this.add.text(960, 110, 
    "🎉 WELCOME TO LEVEL 02! 🎉", {
    font: "bold 48px Segoe UI",
    fill: "#ffd700",
    align: "center",
    stroke: "#000",
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(5002);
  
  // Click instruction
  const clickInstruction = this.add.text(960, 200, 
    "👇 CLICK DONATION IMAGE BELOW TO SUPPORT US! 👇", {
    font: "bold 32px Segoe UI",
    fill: "#00eaff",
    align: "center",
    stroke: "#000",
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(5002);

  // Blinking arrow pointing to donation image
  const arrow = this.add.text(960, 1170, "👆", {
    font: "60px Arial",
    fill: "#ff6b6b"
  }).setOrigin(0.5).setDepth(5005);
  
  // Blinking animation for arrow
  this.tweens.add({
    targets: arrow,
    alpha: { from: 1, to: 0.3 },
    duration: 800,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1
  });
   // PayPal.me button (alternative click option)
  const paypalBtn = this.add.text(960, 1100, "💳 PAYPAL.ME - CLICK TO DONATE", {
    font: "bold 36px Segoe UI",
    fill: "#ffffff",
    backgroundColor: "#0070ba", // PayPal blue
    padding: { left: 30, right: 30, top: 12, bottom: 12 }
  })
    .setOrigin(0.5)
    .setDepth(5002)
    .setInteractive({ useHandCursor: true });
  
  // PayPal button hover effect
  paypalBtn.on('pointerover', () => {
    paypalBtn.setScale(1.05);
    paypalBtn.setBackgroundColor("#005ea6"); // Darker blue
  });
  
  paypalBtn.on('pointerout', () => {
    paypalBtn.setScale(1);
    paypalBtn.setBackgroundColor("#0070ba"); // Back to PayPal blue
  });
  
  // PayPal button click
  paypalBtn.on('pointerdown', () => {
    const paypalLink = 'https://paypal.me/lusibiz?country.x=ID&locale.x=en_US';

    window.open(paypalLink, '_blank');
    this.showDonationThankYou();
  }); 

  // Instructions
  const instructions = this.add.text(960, 1180, 
    "🚀 Your donations help us develop more amazing puzzle levels!", {
    font: "bold 24px Segoe UI",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: { left: 20, right: 20, top: 8, bottom: 8 }
  }).setOrigin(0.5).setDepth(5002);
  
  // Close button
  const closeBtn = this.add.text(1650, 120, "✕", {
    font: "bold 56px Arial",
    fill: "#fff",
    backgroundColor: "#e00",
    padding: { left: 12, right: 12, top: 4, bottom: 4 }
  }).setOrigin(0.5).setDepth(5002).setInteractive({ useHandCursor: true });
  

  // ✅ REPLACE with timer-safe version:
  closeBtn.on('pointerdown', () => {
    console.log('❌ Close button clicked');
    
    // ✅ PREVENT DOUBLE CLICKS
    closeBtn.removeInteractive();
    
    // ✅ STOP TIMER FIRST
    if (this.donationTimer) {
      this.donationTimer.destroy();
      this.donationTimer = null;
      console.log('⏰ Timer stopped by close button');
    }
    
    // ✅ CLEANUP FIRST
    this.closeDonationDisplay();
    
    // ✅ DELAY TRANSITION
    this.time.delayedCall(100, () => {
      const currentData = this.scene.settings.data || {};
      console.log('🔄 Transitioning from close button...');
      
      this.scene.start('Level01Scene', {
        preserveGameOver: currentData.preserveGameOver || false,
        returnFromLevel02: true
      });
    });
  });
  
  // Store elements for cleanup
  this.donationElements = [
    this.donationImage, welcomeMsg, clickInstruction, arrow, 
    paypalBtn, instructions, closeBtn
  ];

  // Auto close after 15 seconds
 // this.donationTimer = this.time.delayedCall(20000, () => {
    //this.closeDonationDisplay();
  //});

  // ✅ REPLACE with safer timer:
  // Auto close after 20 seconds (with safety check)
  this.donationTimer = this.time.delayedCall(20000, () => {
    console.log('⏰ Auto-close timer triggered');
    
    // ✅ CHECK IF STILL IN SAME SCENE
    if (this.scene.isActive('Level02Scene') && this.donationOverlay) {
      console.log('🧹 Auto-closing donation display...');
      this.closeDonationDisplay();
    } else {
      console.log('⚠️ Scene changed or donation already closed');
    }
  });
  
  // Animation entrance
  this.tweens.add({
    targets: this.donationElements,
    scale: { from: 0.1, to: 1 },
    alpha: { from: 0, to: 1 },
    duration: 800,
    ease: 'Back.easeOut'
  });
}

// ✅ THANK YOU MESSAGE
showDonationThankYou() {
  // Remove existing thank you message
  if (this.thankYouText) this.thankYouText.destroy();

  this.thankYouText = this.add.text(960, 400, 
    "🙏 THANK YOU FOR YOUR SUPPORT!\n" +
    "💰 Opening PayPal.me...\n" +
    "🚀 You're helping us create LEVEL 02!", {
    font: "bold 42px Segoe UI",
    fill: "#ffd700",
    align: "center",
    backgroundColor: "rgba(0,0,0,0.95)",
    padding: { left: 30, right: 30, top: 20, bottom: 20 },
    stroke: "#fff",
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(5010);
  // Animation
  this.tweens.add({
    targets: this.thankYouText,
    scale: { from: 0.1, to: 1 },
    alpha: { from: 0, to: 1 },
    duration: 600,
    ease: 'Back.easeOut'
  });
  
  // Auto-remove after 4 seconds
  this.time.delayedCall(5000, () => {
    if (this.thankYouText) {
      this.tweens.add({
        targets: this.thankYouText,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.thankYouText.destroy();
          this.thankYouText = null;
        }
      });
    }
  });
}
// ✅ CLOSE DONATION DISPLAY
closeDonationDisplay() {
  console.log('🧹 closeDonationDisplay() called');
  //if (this.donationOverlay) {
    //this.donationOverlay.destroy();
    
    // Destroy all donation elements
    //if (this.donationElements) {
      //this.donationElements.forEach(element => {
        //if (element) element.destroy();
      //});
    //}
    
    //if (this.donationTimer) this.donationTimer.destroy();
    //if (this.thankYouText) this.thankYouText.destroy();
    
    // Clear references
    //this.donationOverlay = null;
    //this.donationElements = null;
    //this.donationTimer = null;
    //this.thankYouText = null;
  
  // ✅ STOP TIMER FIRST (most important!)
  if (this.donationTimer) {
    this.donationTimer.destroy();
    this.donationTimer = null;
    console.log('⏰ Donation timer destroyed');
  }
  
  // ✅ DESTROY OVERLAY
  if (this.donationOverlay) {
    this.donationOverlay.removeInteractive(); // Remove blocking
    this.donationOverlay.destroy();
    this.donationOverlay = null;
    console.log('✅ Donation overlay destroyed');
  }
  
  // ✅ DESTROY DONATION IMAGE
  if (this.donationImage) {
    this.donationImage.removeAllListeners();
    this.donationImage.destroy();
    this.donationImage = null;
    console.log('✅ Donation image destroyed');
  }
  
  // ✅ DESTROY ALL ELEMENTS
  if (this.donationElements) {
    this.donationElements.forEach((element, index) => {
      if (element && element.destroy) {
        element.removeAllListeners();
        element.destroy();
        console.log(`✅ Element ${index} destroyed`);
      }
    });
    this.donationElements = null;
  }
    // ✅ DESTROY THANK YOU TEXT
  if (this.thankYouText) {
    this.thankYouText.destroy();
    this.thankYouText = null;
    console.log('✅ Thank you text destroyed');
  }
  
  // ✅ RE-ENABLE INPUT
  this.input.enabled = true;
  console.log('✅ All donation elements cleaned up');
  }

// ✅ SHUTDOWN METHOD
// ✅ ADD this method before the closing }:
shutdown() {
  console.log('🛑 Level02Scene shutting down...');
  
  // ✅ DESTROY TIMER FIRST
  if (this.donationTimer) {
    this.donationTimer.destroy();
    this.donationTimer = null;
    console.log('⏰ Timer destroyed on shutdown');
  }
  
  // ✅ CLEANUP DONATION
  this.closeDonationDisplay();
  
  // ✅ STOP ALL SOUNDS
  this.sound.stopAll();
  
  // ✅ CLEAR ALL EVENTS
  this.time.removeAllEvents();
  
  console.log('✅ Level02Scene shutdown complete');
}

showExitPanelOnly() {
  if (this.exitPanelGroup) {
    this.exitPanelGroup.clear(true, true);
    this.exitPanelGroup = null;
  }
  this.exitPanelGroup = this.add.group();

  // Panel background
  const panel = this.add.rectangle(960, 640, 400, 170, 0x023d3f, 0.98)
    .setStrokeStyle(4, 0xffffff)
    .setDepth(7000);
  this.exitPanelGroup.add(panel);

  // Judul
  const title = this.add.text(960, 600, "Exit Game?", {
    font: "bold 40px Segoe UI",
    fill: "#fff",
    align: "center"
  }).setOrigin(0.5).setDepth(7001);
  this.exitPanelGroup.add(title);

  //=== Tombol EXIT ===
  const exitBtn = this.add.text(960, 690, "EXIT", {
    font: "bold 36px Segoe UI",
    fill: "#fff",
    //backgroundColor: "#e00",
    padding: { left: 32, right: 32, top: 12, bottom: 12 }
  }).setOrigin(0.5).setDepth(7001).setInteractive({ useHandCursor: true });
  this.exitPanelGroup.add(exitBtn);

  exitBtn.on('pointerdown', () => {
    this.exitPanelGroup.clear(true, true);
    this.exitPanelGroup = null;
    this.isExitPanelShown = false;
    this.scene.stop('Level02Scene');
    this.scene.start('SplashScene');
  });
}
}
 // ✅ CLOSING for Level02Scene class
window.Level02Scene = Level02Scene;

