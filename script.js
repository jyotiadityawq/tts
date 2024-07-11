let voices = [];
const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const speakBtn = document.getElementById('speakBtn');
const downloadBtn = document.getElementById('downloadBtn');
let mediaRecorder;
let audioChunks = [];

function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged!== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(textInput.value);
    const selectedVoice = voices[voiceSelect.value];
    utterance.voice = selectedVoice;

    utterance.onstart = () => {
        startRecording();
    };

    utterance.onend = () => {
        stopRecording();
    };

    speechSynthesis.speak(utterance);
});

function startRecording() {
    audioChunks = [];
    const stream = new MediaStream();
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text-to-speech.wav';
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a); // remove the anchor element after download
    };
}