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
function Heart(){
 const heart=document.createElement("div");
 heart.classList.add("heart");
 heart.style.left=Math.random()*100+"vw";
 document.querySelector(".hearts").appendChild(heart);
 setTimeout(()=>heart.remove(),4000);
}
setInterval(Heart,300);

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
