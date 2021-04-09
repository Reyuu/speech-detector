/*
Contains modified code from https://github.com/cwilso/volume-meter
License: MIT
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=500;
var rafID = null;

var open_mouth_image = null;
var closed_mouth_image = null;

window.onload = function (){
    open_mouth_image = document.getElementById("open_mouth");
    closed_mouth_image = document.getElementById("closed_mouth");
}

function start_app() {

    // grab our canvas
	canvasContext = document.getElementById( "meter" ).getContext("2d");
	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
    
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    if (meter.volume > 0.06){
        canvasContext.drawImage(open_mouth_image, 0, 0);
    } else {
        canvasContext.drawImage(closed_mouth_image, 0, 0);
    }
    rafID = window.requestAnimationFrame( drawLoop );
}