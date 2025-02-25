const recognition = new window.webkitSpeechRecognition();

recognition.interimResults = true;
recognition.maxAlternatives = 1;
recognition.continuous = true;

let running = false;

function startRecognition() {
  if (running) return;
  running = true;
  try {
    recognition.start();
  } catch (e) {
    console.log(e);
    running = false;
    setTimeout(startRecognition, 50);
  }
}

recognition.onresult = async (event) => {
  const text = event.results[event.results.length - 1][0].transcript.trim();
  onDetectSpeaking(text);
};

recognition.onerror = (event) => {
  console.log(event);
  setTimeout(startRecognition, 50);
};

recognition.onend = () => {
  setTimeout(startRecognition, 50);
};

const speakResultElm = document.querySelector(".speak-result");

async function onDetectSpeaking(text) {
  console.log(text);
  speakResultElm.textContent = text;

  await fetch("/api/speech-detected", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text })
  }).then((res) => res.json());
}

document.querySelector(".start-btn").addEventListener("click", (e) => {
  e.target.disabled = true;
  e.target.textContent = "Listening...";
  recognition.lang = document.querySelector(".detection-lang").value;
  startRecognition();
});

const volumeElm = document.querySelector(".volume");

const socket = io("http://localhost:3001");

socket.on("chat", (message) => {
  const audio = new Audio();
  audio.src = `https://edge-tts-api.armagan.rest/?text=${encodeURIComponent(message)}&name=tr-TR-EmelNeural`
  audio.volume = parseFloat(volumeElm.value);
  audio.play();
})

socket.on("connect", () => {
  console.log("Connected to server");
});