if ('SpeechRecognition' in window) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;

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

// var recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
// //recognition.continuous = false;
// recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// var diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

// recognition.onresult = function(event) {
//   var color = event.results[0][0].transcript;
//   diagnostic.textContent = 'Result received: ' + color;
//   bg.style.backgroundColor = color;
// }