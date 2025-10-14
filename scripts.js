const msgEl = document.getElementById('msg');

const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.fftSize = 256;

  const data = new Uint8Array(analyser.fftSize);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';

    let x = 0;
    const slice = canvas.width / data.length;

    for (let i = 0; i < data.length; i++) {
      const y = (data[i] / 128.0) * (canvas.height / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += slice;
    }

    ctx.stroke();
  }

  draw();
}).catch(err => console.error(err));



// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}
// can be get
const randomNum = getRandomNumber();
console.log('Number:', randomNum);

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();

// Start recognition and game
recognition.start();

// Capture user speak
function onSpeak(event) {
  const msg = event.results[0][0].transcript;  // You can log the event to view the structure of the data
// console.log(msg);
msgEl.innerHTML = '';
  writeMessage(msg);
  checkNumber(msg);
}
// Listen to and handle the speech event
// Speak result
recognition.addEventListener('result', onSpeak);

//See in the DOM what the user has spoken
// Write what user speaks
function writeMessage(msg) {



  const div = document.createElement('div');
  div.textContent = 'You said: ';
  const span = document.createElement('span');
  span.classList.add('box');
  span.textContent = msg;

  msgEl.append(div, span);
}

// Check msg against the secret number
function checkNumber(msg) {
  let num = Number(msg);  // 👈 This is now a let instead of const since I reassign the value below (msg = "hello world")


  // Edge Cases
  // Update the value of num if it's a single-digit number
  if (msg === 'one' || msg === 'won') {
    num = 1;
  } else if (msg === 'two') {
    num = 2;
  } else if (msg === 'three') {
    num = 3;
  } else if (msg === 'four') {
    num = 4;
  } else if (msg === 'five') {
    num = 5;
  } else if (msg === 'six') {
    num = 6;
  } else if (msg === 'seven') {
    num = 7;
  } else if (msg === 'eight') {
    num = 8;
  } else if (msg === 'nine') {
    num = 9;
  }

  // Check if the spoken content is a valid number
  if (Number.isNaN(num)) {
    const div = document.createElement('div');
    div.textContent = 'That is not a valid number';

    msgEl.innerHTML = '';
    msgEl.append(div);

    return;
  }


  //Check for range

  if (num < 1 || num > 100) {
    const div = document.createElement('div');
    div.textContent = 'Number must be between 1 and 100';

    msgEl.innerHTML = '';
    msgEl.append(div);
  }

  // Check the number and provide feedback
  if (num === randomNum) {
    const h2 = document.createElement('h2');
    h2.textContent = `Congrats! You have guessed the number! It was ${num}`;

    const button = document.createElement('button');
    button.classList.add('play-again');
    button.id = 'play-again';
    button.textContent = 'Play Again';
    // Add listener and handler to button
    button.addEventListener('click', () => window.location.reload());

    //Clear out innerHTML of msgEL
msgEl.innerHTML = '';
    msgEl.append(h2, button);
  } else if (num > randomNum) {
    const div = document.createElement('div');
    div.textContent = 'GO LOWER';
    msgEl.append(div);
  } else {
    // if (num < randomNum)
    const div = document.createElement('div');
    div.textContent = 'GO HIGHER'; 
    msgEl.append(div);
  }
}

// At the end of the SPeechRecognition Sevrice, start it again 
recognition.addEventListener('end', () => recognition.start());

// Add listener and handler to button




