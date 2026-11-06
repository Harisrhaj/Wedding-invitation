/* ========================================================
   NICHAYATHARTHAM (ENGAGEMENT) INVITATION JAVASCRIPT
   Features:
   1. Two Separate Visual Experiences (Page 1 & Page 2)
   2. Smooth 3D Envelope Opening & Soft Crossfade Transition
   3. "Back to Envelope" Navigation
   4. Functional English / தமிழ் Language Toggle
   5. Subtle Falling Flower Petals Layer
   6. Live Countdown Timer (Editable Date)
   7. RSVP Form Feedback (No Backend)
   ======================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ======================================================
     1. TWO-PAGE NAVIGATION & ENVELOPE TRANSITION
     ====================================================== */
  const page1 = document.getElementById("page-1");
  const page2 = document.getElementById("page-2");
  const envelope = document.getElementById("envelope");
  const openBtn = document.getElementById("open-envelope-btn");
  const backToEnvelopeBtn = document.getElementById("back-to-envelope-btn");

  let isEnvelopeOpened = false;
  let isEnvelopeOpening = false;

  /* ======================================================
     BACKGROUND MUSIC (HTML Audio API)
     - Source: ./music.mp3 (Root directory)
     - Starts ONLY when envelope is clicked
     - Never plays on initial load
     - Continuous loop
     - Does not restart if envelope is clicked again
     - Resilient: if audio fails, envelope animation proceeds
     ====================================================== */
  let bgMusic = null;
  let isMusicStarted = false;
  let isMusicPlaying = false;

  const musicToggleBtn = document.getElementById("music-toggle-btn");
  const musicIcon = document.getElementById("music-icon");
  const musicStateText = document.getElementById("music-state-text");

  function startBackgroundMusic() {
    // Do not restart if user clicks the envelope again
    if (isMusicStarted) return;

    try {
      if (!bgMusic) {
        bgMusic = new Audio("./music.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.7; // Gentle ambient volume
      }

      // Start audio directly inside user gesture click event
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            isMusicStarted = true;
            isMusicPlaying = true;
            updateMusicButtonUI();
          })
          .catch(function (error) {
            console.log("Audio notice: playback postponed or unavailable:", error);
            // Website and envelope animations continue normally
            isMusicStarted = true;
            isMusicPlaying = false;
            updateMusicButtonUI();
          });
      } else {
        isMusicStarted = true;
        isMusicPlaying = true;
        updateMusicButtonUI();
      }
    } catch (err) {
      console.log("Audio initialization safe catch:", err);
      isMusicStarted = true;
      isMusicPlaying = false;
    }
  }

  function toggleMusic() {
    if (!bgMusic) {
      try {
        bgMusic = new Audio("./music.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.7;
      } catch (e) {
        return;
      }
    }

    if (bgMusic.paused) {
      bgMusic.play()
        .then(function () {
          isMusicPlaying = true;
          updateMusicButtonUI();
        })
        .catch(function (err) {
          console.log("Audio resume error:", err);
        });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      updateMusicButtonUI();
    }
  }

  function updateMusicButtonUI() {
    if (!musicToggleBtn) return;

    if (isMusicPlaying) {
      musicToggleBtn.classList.remove("is-muted");
      musicToggleBtn.classList.add("is-playing");
      musicToggleBtn.setAttribute(
        "aria-label",
        currentLang === "en" ? "Mute background music" : "இசையை நிறுத்தவும்"
      );
      musicToggleBtn.setAttribute(
        "title",
        currentLang === "en" ? "Click to mute music" : "இசையை முடக்க அழுத்தவும்"
      );
      if (musicIcon) musicIcon.textContent = "🎵";
      if (musicStateText) {
        musicStateText.setAttribute("data-en", "Music");
        musicStateText.setAttribute("data-ta", "இசை");
        musicStateText.textContent = currentLang === "en" ? "Music" : "இசை";
      }
    } else {
      musicToggleBtn.classList.remove("is-playing");
      musicToggleBtn.classList.add("is-muted");
      musicToggleBtn.setAttribute(
        "aria-label",
        currentLang === "en" ? "Play background music" : "இசையை இயக்கவும்"
      );
      musicToggleBtn.setAttribute(
        "title",
        currentLang === "en" ? "Click to play music" : "இசையை ஒலிக்க அழுத்தவும்"
      );
      if (musicIcon) musicIcon.textContent = "🔇";
      if (musicStateText) {
        musicStateText.setAttribute("data-en", "Muted");
        musicStateText.setAttribute("data-ta", "நிறுத்தம்");
        musicStateText.textContent = currentLang === "en" ? "Muted" : "நிறுத்தம்";
      }
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", toggleMusic);
  }

  function openEnvelopeAndTransition() {
    if (isEnvelopeOpening) return;

    // Start background music immediately along with the envelope opening animation
    startBackgroundMusic();

    isEnvelopeOpening = true;

    // 1. Trigger flap 3D fold & inner card slide-up
    envelope.classList.add("open");

    // 2. Update button label
    const openingText = currentLang === "en" ? "Opening Invitation..." : "திறக்கப்படுகிறது...";
    openBtn.innerHTML = '<span class="open-btn-icon">✨</span><span class="open-btn-text">' + openingText + '</span>';

    // 3. Soft Crossfade: Page 1 fades out, Page 2 fades in
    // Allows full completion of:
    // Step 1: 800ms flap rotation
    // Step 2: 1250ms card upward extraction from inside the pocket (finishes at 2100ms)
    // Step 3: resting display in center (2100ms - 2700ms)
    // Followed by soft crossfade to inside invitation page (Page 2)
    setTimeout(function () {
      if (page1) {
        page1.classList.add("fade-out");
      }
    }, 2700);

    setTimeout(function () {
      // Hide Page 1 completely
      if (page1) {
        page1.classList.add("hidden");
        page1.classList.remove("fade-out");
      }

      // Reveal Page 2 with its dedicated cream & antique-gold CSS background
      if (page2) {
        page2.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(initScratchCard, 80);
      }

      isEnvelopeOpening = false;
      isEnvelopeOpened = true;

      // Reset button text for next time
      const viewText = currentLang === "en" ? "Click to Open Invitation" : "அழைப்பிதழைத் திறக்க அழுத்தவும்";
      openBtn.innerHTML = '<span class="open-btn-icon">✉</span><span class="open-btn-text">' + viewText + '</span>';
    }, 3400);
  }

// Open on clicking the button
if (openBtn) {
  openBtn.addEventListener("click", openEnvelopeAndTransition);
}

// Also open on tapping the envelope directly
if (envelope) {
  envelope.addEventListener("click", openEnvelopeAndTransition);
}

// Back to Envelope Navigation Button on Page 2
if (backToEnvelopeBtn) {
  backToEnvelopeBtn.addEventListener("click", function () {
    if (page2) {
      page2.classList.add("hidden");
    }

    if (page1) {
      page1.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Reset envelope to closed state so the user can open it again
    if (envelope) {
      envelope.classList.remove("open");
    }
    isEnvelopeOpened = false;
    isEnvelopeOpening = false;
  });
}


/* ======================================================
   2. FUNCTIONAL LANGUAGE TOGGLE: "English | தமிழ்"
   ====================================================== */
const langToggleBtn = document.getElementById("lang-toggle-btn");
const optEn = document.getElementById("opt-en");
const optTa = document.getElementById("opt-ta");

// Default language is Tamil ('ta')
let currentLang = document.body.dataset.lang || "ta";

function setLanguage(lang) {
  currentLang = lang;
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang;

  // Update active highlight on the "English | தமிழ்" toggle button
  if (optEn && optTa) {
    if (lang === "en") {
      optEn.classList.add("active");
      optTa.classList.remove("active");
    } else {
      optTa.classList.add("active");
      optEn.classList.remove("active");
    }
  }

  // Update all elements with data-en and data-ta attributes
  const translatableElements = document.querySelectorAll("[data-en][data-ta]");
  translatableElements.forEach(function (el) {
    if (lang === "en") {
      el.innerHTML = el.getAttribute("data-en");
    } else {
      el.innerHTML = el.getAttribute("data-ta");
    }
  });

  // Update envelope button text
  if (openBtn) {
    if (isEnvelopeOpening) {
      openBtn.innerHTML = '<span class="open-btn-icon">✨</span><span class="open-btn-text">' +
        (lang === "en" ? "Opening Invitation..." : "திறக்கப்படுகிறது...") + '</span>';
    } else {
      openBtn.innerHTML = '<span class="open-btn-icon">✉</span><span class="open-btn-text">' +
        (lang === "en" ? "Click to Open Invitation" : "அழைப்பிதழைத் திறக்க அழுத்தவும்") + '</span>';
    }
  }

  // Refresh countdown labels and status banner immediately
  updateCountdown(true);

  // Refresh scratch card language
  if (typeof updateScratchCardLanguage === "function") {
    updateScratchCardLanguage(lang);
  }

  // Refresh background music button text and labels
  updateMusicButtonUI();
}

// Handle language toggle interactions
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", function (event) {
    if (event.target === optEn || optEn.contains(event.target)) {
      setLanguage("en");
      return;
    }
    if (event.target === optTa || optTa.contains(event.target)) {
      setLanguage("ta");
      return;
    }
    const nextLang = currentLang === "ta" ? "en" : "ta";
    setLanguage(nextLang);
  });
}


/* ======================================================
   3. SUBTLE FALLING FLOWER PETALS ANIMATION
   ====================================================== */
const petalsContainer = document.getElementById("petals-container");

if (petalsContainer) {
  const flowerSymbols = ["🌸", "🌼", "🌺", "🏵️", "🌸"];
  const totalPetals = 16;

  for (let i = 0; i < totalPetals; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.innerText = flowerSymbols[i % flowerSymbols.length];

    const leftPos = Math.random() * 100;
    const animDuration = 7 + Math.random() * 7;
    const animDelay = Math.random() * 8;
    const fontSize = 1 + Math.random() * 0.6;
    const opacity = 0.5 + Math.random() * 0.4;

    petal.style.left = leftPos + "%";
    petal.style.animationDuration = animDuration + "s";
    petal.style.animationDelay = animDelay + "s";
    petal.style.fontSize = fontSize + "rem";
    petal.style.opacity = opacity;

    petalsContainer.appendChild(petal);
  }
}


/* ======================================================
   4. LIVE COUNTDOWN TIMER & CEREMONY STATUS
   - Target Date: Sunday, 29 November 2026
   - Start Time: 10:30 AM IST (2026-11-29T10:30:00+05:30)
   - End Time: 12:30 PM IST (2026-11-29T12:30:00+05:30)
   - Timezone: Asia/Kolkata (+05:30)
   ====================================================== */
const eventStartISO = "2026-11-29T10:30:00+05:30";
const eventEndISO = "2026-11-29T12:30:00+05:30";
const eventStartTime = new Date(eventStartISO).getTime();
const eventEndTime = new Date(eventEndISO).getTime();

const countdownGrid = document.getElementById("countdown-timer");
const countdownIntro = document.querySelector(".countdown-intro-text");
let countdownInterval = null;

function getCountdownBoxesHTML() {
  return `
      <div class="countdown-box">
        <span class="countdown-number" id="days">00</span>
        <span class="countdown-label" data-en="Days" data-ta="நாட்கள்">${currentLang === "en" ? "Days" : "நாட்கள்"}</span>
      </div>
      <div class="countdown-box">
        <span class="countdown-number" id="hours">00</span>
        <span class="countdown-label" data-en="Hours" data-ta="மணி">${currentLang === "en" ? "Hours" : "மணி"}</span>
      </div>
      <div class="countdown-box">
        <span class="countdown-number" id="minutes">00</span>
        <span class="countdown-label" data-en="Minutes" data-ta="நிமிடம்">${currentLang === "en" ? "Minutes" : "நிமிடம்"}</span>
      </div>
      <div class="countdown-box">
        <span class="countdown-number" id="seconds">00</span>
        <span class="countdown-label" data-en="Seconds" data-ta="விநாடிகள்">${currentLang === "en" ? "Seconds" : "விநாடிகள்"}</span>
      </div>
    `;
}

let currentStatusState = null; // 'countdown' | 'started' | 'completed'

function updateCountdown(forceRefresh = false) {
  const now = new Date().getTime();

  // 1. State: Event Completed (at or after 12:30 PM on 29 Nov 2026)
  if (now >= eventEndTime) {
    if (currentStatusState !== 'completed' || forceRefresh) {
      if (countdownIntro) {
        countdownIntro.innerText = currentLang === "en"
          ? "The auspicious ceremony has concluded:"
          : "நிச்சயதார்த்த வைபவம் இனிதே நிறைவடைந்தது:";
      }

      if (countdownGrid) {
        const titleText = currentLang === "en"
          ? "🌸 The Nichayathartham Ceremony Has Been Successfully Completed! 🌸"
          : "🌸 நிச்சயதார்த்த வைபவம் இனிதே நிறைவடைந்தது! 🌸";
        const subText = currentLang === "en"
          ? "Thank you for all your heartfelt blessings, love and warm wishes!"
          : "தங்கள் பொன்னான ஆசிகளுக்கும் நல்வாழ்த்துகளுக்கும் மனமார்ந்த நன்றி!";

        countdownGrid.innerHTML = `
            <div class="event-status-banner">
              <div class="event-status-title">${titleText}</div>
              <div class="event-status-sub">${subText}</div>
            </div>
          `;
      }
      currentStatusState = 'completed';
    }

    // Clear the interval when the event is completed
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    return;
  }

  // 2. State: Event Started (between 10:30 AM and 12:30 PM on 29 Nov 2026)
  if (now >= eventStartTime) {
    if (currentStatusState !== 'started' || forceRefresh) {
      if (countdownIntro) {
        countdownIntro.innerText = currentLang === "en"
          ? "Auspicious Nichayathartham is now in progress:"
          : "சுப முகூர்த்த வைபவம் நடைபெற்றுக்கொண்டிருக்கிறது:";
      }

      if (countdownGrid) {
        const titleText = currentLang === "en"
          ? "🌸 The Auspicious Nichayathartham Ceremony Has Begun! 🌸"
          : "🌸 நிச்சயதார்த்த சுப முகூர்த்த வைபவம் இனிதே துவங்கியுள்ளது! 🌸";
        const subText = currentLang === "en"
          ? "Muhurtham: 10:30 AM – 12:30 PM • Bless the Couple!"
          : "சுப முகூர்த்தம்: காலை 10:30 – 12:30 மணி • மணமக்களை வாழ்த்துங்கள்!";

        countdownGrid.innerHTML = `
            <div class="event-status-banner">
              <div class="event-status-title">${titleText}</div>
              <div class="event-status-sub">${subText}</div>
            </div>
          `;
      }
      currentStatusState = 'started';
    }
    return;
  }

  // 3. State: Countdown Active (before 10:30 AM on 29 Nov 2026)
  if (currentStatusState !== 'countdown' || forceRefresh) {
    if (countdownIntro) {
      countdownIntro.innerText = currentLang === "en"
        ? "Counting down to the auspicious Nichayathartham celebration:"
        : "நிச்சயதார்த்த நன்னாளுக்கான இனிய தருணங்கள்:";
    }

    if (countdownGrid && (!document.getElementById("days") || forceRefresh)) {
      countdownGrid.innerHTML = getCountdownBoxesHTML();
    }
    currentStatusState = 'countdown';
  }

  // Dynamic calculations for days, hours, minutes and seconds
  const distance = Math.max(0, eventStartTime - now);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Format with leading zeros
  if (daysEl) daysEl.innerText = days < 10 ? "0" + days : String(days);
  if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : String(hours);
  if (minutesEl) minutesEl.innerText = minutes < 10 ? "0" + minutes : String(minutes);
  if (secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : String(seconds);
}

// Run update immediately upon loading
updateCountdown(true);

// Update dynamically every second
countdownInterval = setInterval(function () {
  updateCountdown(false);
}, 1000);


/* ======================================================
   5. INTERACTIVE SCRATCH-TO-REVEAL DATE CARD
   ====================================================== */
const scratchCanvas = document.getElementById("scratch-canvas");
const scratchCard = document.getElementById("scratch-card");
const scratchContainer = document.getElementById("scratch-card-container");
const scratchHintText = document.querySelector(".scratch-hint-text");
const scratchHandIcon = document.querySelector(".scratch-hand-icon");

let isScratching = false;
let isDateRevealed = false;
let hasScratchedSomething = false;
let scratchCtx = null;
let lastScratchPos = { x: 0, y: 0 };
let scratchCheckThrottle = 0;

function drawGoldScratchLayer() {
  if (!scratchCanvas || isDateRevealed) return;
  const rect = scratchCard ? scratchCard.getBoundingClientRect() : scratchCanvas.getBoundingClientRect();
  const width = rect.width || 340;
  const height = rect.height || 180;
  if (width <= 0 || height <= 0) return;

  const dpr = window.devicePixelRatio || 1;
  scratchCanvas.width = Math.floor(width * dpr);
  scratchCanvas.height = Math.floor(height * dpr);
  scratchCanvas.style.width = width + "px";
  scratchCanvas.style.height = height + "px";

  scratchCtx = scratchCanvas.getContext("2d");
  scratchCtx.scale(dpr, dpr);

  // 1. Rich South Indian Gold Metallic Gradient
  const goldGrad = scratchCtx.createLinearGradient(0, 0, width, height);
  goldGrad.addColorStop(0, "#e8c86d");
  goldGrad.addColorStop(0.2, "#fbedb9");
  goldGrad.addColorStop(0.4, "#c59728");
  goldGrad.addColorStop(0.65, "#fdf3cf");
  goldGrad.addColorStop(0.85, "#b98822");
  goldGrad.addColorStop(1, "#8e1529");
  scratchCtx.fillStyle = goldGrad;
  scratchCtx.fillRect(0, 0, width, height);

  // 2. Subtle Golden Hatching / Luster Pattern
  scratchCtx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  scratchCtx.lineWidth = 1;
  for (let i = -height; i < width + height; i += 18) {
    scratchCtx.beginPath();
    scratchCtx.moveTo(i, 0);
    scratchCtx.lineTo(i + height, height);
    scratchCtx.stroke();
  }

  // 3. Elegant Dashed Border
  scratchCtx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  scratchCtx.lineWidth = 1.5;
  scratchCtx.setLineDash([6, 4]);
  scratchCtx.strokeRect(10, 10, width - 20, height - 20);
  scratchCtx.setLineDash([]);

  // 4. Corner Auspicious Symbols
  scratchCtx.fillStyle = "#580816";
  scratchCtx.font = "bold 13px 'Noto Serif Tamil', Cinzel, serif";
  scratchCtx.textAlign = "center";
  scratchCtx.textBaseline = "middle";
  scratchCtx.fillText("❖", 20, 20);
  scratchCtx.fillText("❖", width - 20, 20);
  scratchCtx.fillText("❖", 20, height - 20);
  scratchCtx.fillText("❖", width - 20, height - 20);

  // 5. Center Traditional Emblem
  scratchCtx.font = "bold 24px serif";
  scratchCtx.fillStyle = "#6e0c1c";
  scratchCtx.shadowColor = "rgba(255, 255, 255, 0.6)";
  scratchCtx.shadowBlur = 4;
  scratchCtx.fillText("⚜", width / 2, height / 2 - 20);

  // 6. Center Instruction
  scratchCtx.shadowBlur = 0;
  scratchCtx.font = "bold 15px 'Noto Serif Tamil', Cinzel, serif";
  scratchCtx.fillStyle = "#450611";
  const titleText = currentLang === "en" ? "SCRATCH TO REVEAL DATE" : "தேதியை அறிய தேய்க்கவும்";
  scratchCtx.fillText(titleText, width / 2, height / 2 + 10);

  scratchCtx.font = "600 11px 'Noto Serif Tamil', sans-serif";
  scratchCtx.fillStyle = "#580816";
  const subHint = currentLang === "en" ? "Swipe with mouse or finger" : "விரலால் அல்லது மவுஸால் தேய்க்கவும்";
  scratchCtx.fillText(subHint, width / 2, height / 2 + 30);
}

function getScratchPos(e) {
  if (!scratchCanvas) return { x: 0, y: 0 };
  const rect = scratchCanvas.getBoundingClientRect();
  let clientX = 0;
  let clientY = 0;

  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function scratchAt(pos) {
  if (!scratchCtx || isDateRevealed) return;
  const rect = scratchCanvas.getBoundingClientRect();
  const brushRadius = Math.max(22, Math.min(rect.width, rect.height) * 0.12);

  scratchCtx.save();
  scratchCtx.globalCompositeOperation = "destination-out";

  scratchCtx.beginPath();
  scratchCtx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2);
  scratchCtx.fill();

  if (hasScratchedSomething) {
    scratchCtx.beginPath();
    scratchCtx.moveTo(lastScratchPos.x, lastScratchPos.y);
    scratchCtx.lineTo(pos.x, pos.y);
    scratchCtx.lineWidth = brushRadius * 2;
    scratchCtx.lineCap = "round";
    scratchCtx.lineJoin = "round";
    scratchCtx.stroke();
  }

  scratchCtx.restore();
  lastScratchPos = pos;
  hasScratchedSomething = true;

  // Check percentage cleared periodically (every 6 moves)
  scratchCheckThrottle++;
  if (scratchCheckThrottle % 6 === 0) {
    checkScratchPercentage();
  }
}

function checkScratchPercentage() {
  if (!scratchCanvas || !scratchCtx || isDateRevealed) return;

  try {
    const w = Math.floor(scratchCanvas.width);
    const h = Math.floor(scratchCanvas.height);
    const imageData = scratchCtx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const step = 28; // Sample pixels for fast 60fps responsiveness
    let transparentCount = 0;
    let totalSampled = 0;

    for (let i = 3; i < data.length; i += step * 4) {
      totalSampled++;
      if (data[i] < 128) {
        transparentCount++;
      }
    }

    if (totalSampled > 0) {
      const clearedRatio = transparentCount / totalSampled;
      // User Requirement: "Reveal the complete date when approximately 50% of the scratch area has been cleared"
      if (clearedRatio >= 0.5) {
        revealDateCard();
      }
    }
  } catch (e) {
    console.warn("Scratch check:", e);
  }
}

function revealDateCard() {
  if (isDateRevealed) return;
  isDateRevealed = true;

  if (scratchContainer) scratchContainer.classList.add("revealed");
  if (scratchCard) scratchCard.classList.add("revealed");

  if (scratchHintText) {
    scratchHintText.innerHTML = currentLang === "en"
      ? "✨ Date Revealed! ✨"
      : "✨ தேதி உறுதியானது! ✨";
  }

  if (scratchHandIcon) {
    scratchHandIcon.textContent = "🌸";
  }

  setTimeout(function () {
    if (scratchCanvas) {
      scratchCanvas.style.display = "none";
    }
  }, 650);
}

function handleScratchStart(e) {
  if (isDateRevealed) return;
  isScratching = true;
  const pos = getScratchPos(e);
  lastScratchPos = pos;
  hasScratchedSomething = false;
  scratchAt(pos);
}

function handleScratchMove(e) {
  if (!isScratching || isDateRevealed) return;
  // User Requirement: "Prevent page scrolling while scratching on mobile"
  if (e.cancelable) {
    e.preventDefault();
  }
  const pos = getScratchPos(e);
  scratchAt(pos);
}

function handleScratchEnd() {
  if (!isScratching) return;
  isScratching = false;
  hasScratchedSomething = false;
  checkScratchPercentage();
}

function initScratchCard() {
  if (!scratchCanvas || isDateRevealed) return;
  drawGoldScratchLayer();
}

// Bind mouse and touch events
if (scratchCanvas) {
  // Mouse Events (Desktop)
  scratchCanvas.addEventListener("mousedown", handleScratchStart);
  window.addEventListener("mousemove", function (e) {
    if (isScratching) {
      handleScratchMove(e);
    }
  });
  window.addEventListener("mouseup", handleScratchEnd);

  // Touch Events (Mobile) - { passive: false } ensures preventDefault stops scroll
  scratchCanvas.addEventListener("touchstart", handleScratchStart, { passive: false });
  scratchCanvas.addEventListener("touchmove", handleScratchMove, { passive: false });
  scratchCanvas.addEventListener("touchend", handleScratchEnd);
  scratchCanvas.addEventListener("touchcancel", handleScratchEnd);
}

// Handle window resize
window.addEventListener("resize", function () {
  if (!isDateRevealed && !hasScratchedSomething) {
    drawGoldScratchLayer();
  }
});

function updateScratchCardLanguage(lang) {
  if (!scratchHintText) return;
  if (isDateRevealed) {
    scratchHintText.innerHTML = lang === "en"
      ? "✨ Date Revealed! ✨"
      : "✨ தேதி உறுதியானது! ✨";
  } else {
    scratchHintText.innerHTML = lang === "en"
      ? "Scratch here to reveal the date"
      : "தேதியை அறிய இங்கே தேய்க்கவும்";
    // If user hasn't scratched yet, update canvas text too
    if (!hasScratchedSomething) {
      drawGoldScratchLayer();
    }
  }
}

// Initialize scratch card if Page 2 is already visible on load
if (page2 && !page2.classList.contains("hidden")) {
  setTimeout(initScratchCard, 100);
}

});
