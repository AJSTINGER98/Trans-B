//Using speech recognition
if ('SpeechRecognition' in window) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 20;

    recognition.onresult = function (e) {
        speechText = e.results[0][0].transcript;
        document.getElementById('input-speak').value = speechText;
    };

    recognition.onspeechend = function (e) {
        recognition.stop();
        document.getElementById('speak').submit();

    };
    recognition.onerror = function (event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    };
    recognition.onnomatch = function (event) {
        diagnostic.textContent = 'I didnt recognise.';
    };
    $('.btn-speak').click(function () {
        recognition.start();
    });
}
else {
    console.log("speech recognition API not supported");
}

