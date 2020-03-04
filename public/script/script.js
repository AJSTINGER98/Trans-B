const synth = window.speechSynthesis;

 const speak = (event) =>{
     utterThis = new SpeechSynthesisUtterance(event);
     synth.speak(utterThis);
 };

// function populateVoiceList() {
//   voices = synth.getVoices();

//   for(i = 0; i < voices.length ; i++) {
//     var option = document.createElement('option');
//     option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
//     if(voices[i].default) {
//       option.textContent += ' -- DEFAULT';
//     }

//     option.setAttribute('data-lang', voices[i].lang);
//     option.setAttribute('data-name', voices[i].name);
//     voiceSelect.appendChild(option);
//   }
// }


//Using speech recognition
if ('SpeechRecognition' in window) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 2;

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
    speak("speech recognition API is not supported by your Browser. Please switch to Chrome to use speech Recognition");
    console.logAJS("speech recognition API is not supported by your Browser. Please switch to Chrome to use speech Recognition");
}

$(document).ready(function(){
    $('#load').removeClass('loader');
    $('.speech input').attr("placeholder", "Click to Record");
        $('.btn-speak').click(function(){
            $('.speech input').attr("placeholder", "Listening...");
            $('#load').addClass('loader');
        });
});

$('.mic-hover').hover(function(){
    $('.mic-hover div div i').removeClass('text-dark');
    $('.mic-hover div div i').addClass('text-light');
},function(){
    $('.mic-hover div div i').removeClass('text-light');
    $('.mic-hover div div i').addClass('text-dark');
});

