const synth = window.speechSynthesis;

const sound1 = document.querySelector('.sound1');
const sound2 = document.querySelector('.sound2');

 const speak = (event) =>{
     utterThis = new SpeechSynthesisUtterance(event);
     synth.speak(utterThis);
 };


//Using speech recognition
if ('SpeechRecognition' in window) {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1000;

    recognition.onresult = function (e) {
        speechText = e.results[0][0].transcript;
        document.getElementById('input-speak').value = speechText;
    };

    recognition.onspeechend = function (e) {
        setTimeout(function(){ recognition.stop();}, 1000);
        sound2.play();
        setTimeout(function(){ document.getElementById('speak').submit(); }, 1000);

    };
    recognition.onerror = function (event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    };
    recognition.onnomatch = function (event) {
        diagnostic.textContent = 'I didnt recognise.';
    };
    $('.btn-speak').click(function () {
        sound1.play();
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
        });
});

$('.mic-hover').hover(function(){
    $('.mic-hover div div i').removeClass('text-dark');
    $('.mic-hover div div i').addClass('text-light');
},function(){
    $('.mic-hover div div i').removeClass('text-light');
    $('.mic-hover div div i').addClass('text-dark');
});

