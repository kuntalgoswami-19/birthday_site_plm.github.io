// ------------ force-unmute background music after first gesture -------------
document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");

  // If autoplay with sound is allowed (desktop sites you've interacted with before),
  // browser will ignore 'muted' and we can unmute right away.
  bgm.muted = false;

  // Otherwise wait for the first user gesture, then unmute & play.
  const unlock = () => {
    bgm.muted = false;
    bgm.play().catch(() => {});   // ignore promise error if already playing
    window.removeEventListener("click", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
});

// countdown
function updateCountdown(){
 const birthday=new Date(new Date().getFullYear()+1,6,23);
 const now=new Date();
 const diff=birthday-now;
 const days=Math.floor(diff/86400000);
 document.getElementById("timer").textContent=days+" days left!";
}
window.onload=updateCountdown;

// falling hearts
function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart';

  // choose a lobe diameter between 16 and 32 pixels
  const d = 16 + Math.random() * 16;
  h.style.setProperty('--d', d);                    // 💡 pass to CSS
  h.style.left = Math.random() * 100 + 'vw';

  document.body.appendChild(h);
  setTimeout(() => h.remove(), 6000);
}
setInterval(spawnHeart, 400);


// cake‑cutting & selfie
const cutBtn=document.getElementById("cutBtn");
const preview=document.getElementById("preview");
const canvas=document.getElementById("snapshot");
let stream=null,cakeTrack=null;

async function startCeremony(){
 document.getElementById("bgm").pause();
 cakeTrack=new Audio("static/music/cake_cut.mp3"); cakeTrack.play();
 try{
   stream=await navigator.mediaDevices.getUserMedia({video:true});
   preview.srcObject=stream; preview.hidden=false;
   cutBtn.textContent="📸 Take a selfie"; cutBtn.onclick=takeSelfie;
 }catch(e){alert("Camera blocked 😢");restore();}
}

function takeSelfie(){
 canvas.width=preview.videoWidth; canvas.height=preview.videoHeight;
 canvas.getContext("2d").drawImage(preview,0,0);
 canvas.hidden=false;
 const link=document.createElement("a");
 link.download="BirthdaySelfie.png"; link.href=canvas.toDataURL("image/png"); link.click();
 restore();
}
function restore(){
 if(stream) stream.getTracks().forEach(t=>t.stop());
 preview.hidden=true; canvas.hidden=true;
 cutBtn.textContent="Take Selfie"; cutBtn.onclick=startCeremony;
 document.getElementById("bgm").play(); if(cakeTrack) cakeTrack.pause();
}
if(cutBtn) cutBtn.onclick=startCeremony;


// --- Confetti animation ---
function showConfetti() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = "hsl(" + Math.random() * 360 + ",100%,70%)";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}
// Real cake-cutting animation + voice
document.addEventListener("DOMContentLoaded", () => {
  const box   = document.getElementById("cake-box");
  const voice = document.getElementById("cakeVoice");
  const bgm   = document.getElementById("bgm");   // NEW

  if (box && voice) {
    box.addEventListener("click", () => {
      box.classList.add("cutting");

      // Play voice after knife finishes cutting
      setTimeout(() => {
        if (bgm) bgm.pause();                     // NEW
        voice.play().catch(e => console.log("Voice blocked:", e));

        // Resume bgm when voice ends            // NEW
        voice.onended = () => { if (bgm) bgm.play().catch(()=>{}); };
      }, 1000);

      box.style.pointerEvents = "none"; // Disable repeat click
    }, { once: true });
  }
});

/* -----------------------------------------------------------------
   Pause BGM while the birthday video plays, then resume afterwards
   -----------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const bgm   = document.getElementById('bgm');               // your looping music
  const video = document.querySelector('section.video video'); // the special video

  if (!bgm || !video) return;  // safety check

  // Whenever the video starts or resumes
  video.addEventListener('play', () => {
    if (!bgm.paused) bgm.pause();
  });

  // When the video is paused, ended, or user leaves it
  const resumeBGM = () => {
    if (bgm.paused) bgm.play().catch(() => {});
  };
  video.addEventListener('pause',  resumeBGM);
  video.addEventListener('ended',  resumeBGM);
});
/* ---------- Knife slice + photo-swap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const cakeBox  = document.getElementById('cakeBox');
  const cakeImg  = document.getElementById('cakeWhole');
  const bgm      = document.getElementById('bgm');
  const voice    = document.getElementById('cakeVoice');

  if (!cakeBox) return;

  cakeBox.addEventListener('click', () => {
    cakeBox.classList.add('cut');            // knife + slice CSS
    cakeBox.style.pointerEvents = 'none';

    /* 0.6 s later, swap main cake photo */
    setTimeout(() => {
      const cur = cakeImg.getAttribute('src');
      const alt = cakeImg.getAttribute('data-alt');
      cakeImg.setAttribute('src', alt);
      cakeImg.setAttribute('data-alt', cur);

      // pause BGM, play voice, resume at end
      bgm?.pause();
      voice?.play().catch(()=>{});
      voice.onended = () => bgm?.play().catch(()=>{});
    }, 600);
  }, { once:true });
});


// -------- glitter cracker intro -------------
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glitterCanvas');
  const ctx    = canvas.getContext('2d');
  const title  = document.getElementById('bigTitle');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  function spawn(n = 120) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: W/2,  y: H/2,
        vx: (Math.random() - .5) * 6,
        vy: (Math.random() - .5) * 6,
        size: 3 + Math.random() * 3,
        life: 60 + Math.random() * 30,
        hue: Math.random() * 360
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.life/90})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length) requestAnimationFrame(animate);
    else {
      canvas.remove(); // cleanup
      title.classList.remove('hidden'); // reveal title
      title.classList.add('reveal');
    }
  }

  // Start 0.3s after load
  setTimeout(() => { spawn(); animate(); }, 300);
});
