function tempoTiming(current, previous, avg, saved) {
    this.currentTap = current;
    this.previousTap = previous;
    this.avgBPM = avg;
    this.savedBPMs = saved;
    this.calculateNewBPM = function() {
        var sum = 0;
        var newArray = new Array();
        var instanceBPM = Math.max(Math.min(Math.round(600 / (this.currentTap - this.previousTap) * 100), 240), 40);
        console.log('Instance BPM calculated to be ' + instanceBPM);
        this.previousTap = this.currentTap;
        this.savedBPMs.pop();
        this.savedBPMs.unshift(instanceBPM);
        for(var i = 0; i<this.savedBPMs.length; i++){
            if (this.savedBPMs[i]){
                newArray.push(this.savedBPMs[i]);
            }
        }
        sum = newArray.reduce(function(a, b) { return a + b });
        this.avgBPM = sum / newArray.length;
        this.avgBPM = Math.round(this.avgBPM);
    };
}

var flashBPM = false;
function flashBPMthruDIV() {
	rgbString = calculateBPMColor(metronome.avgBPM);
	$("body").css("background-color", rgbString);
	//conversion from bpm to ms
	var ms = Math.round((60 * 1000) / metronome.avgBPM);
	$("#flashlayer").removeClass("pulse-beat");
	setTimeout(function () {
		$("#flashlayer").addClass("pulse-beat");
	}, 2); //2ms buffer to make sure it happens after 'removeClass'
	if (flashBPM == true) { //Only continue to do this if this is true.
		setTimeout(flashBPMthruDIV, ms);
	}
}

function calculateBPMColor(bpm) {
	//Given a bpm, interpret into rgb space, blue=slow, red=fast
	
	//Array to be returned containing rgb
	var rgb = new Array(3);
	//Fine tune the color mappings here
	var floorBPM = 50;
	var ceilingBPM = 150;
	var maxColorIntensity = 233;
	var minColorIntensity = 5;

	//The rest is the algorithm
	bpm = Math.max(bpm, floorBPM);
	bpm = Math.min(bpm, ceilingBPM);
	var colorIntensityDelta = maxColorIntensity - minColorIntensity;
	var quartileInterval = (ceilingBPM - floorBPM) / 4;
	var percentageFill = ((bpm - floorBPM) % quartileInterval) / quartileInterval;
	if (bpm < (floorBPM + 1 * quartileInterval)) {
		//First quartiles
		rgb[0] = minColorIntensity;
		rgb[1] = minColorIntensity + percentageFill * colorIntensityDelta;
		rgb[2] = maxColorIntensity;
	} else if (bpm < (floorBPM + 2 * quartileInterval)) {
		//Second quartiles
		rgb[0] = minColorIntensity;
		rgb[1] = maxColorIntensity;
		rgb[2] = maxColorIntensity - percentageFill * colorIntensityDelta;
	} else if (bpm < (floorBPM + 3 * quartileInterval)) {
		//Third quartiles
		rgb[0] = minColorIntensity + percentageFill * colorIntensityDelta;
		rgb[1] = maxColorIntensity;
		rgb[2] = minColorIntensity;
	} else if (bpm < (floorBPM + 4 * quartileInterval)) {
		//Fourth quartiles
		rgb[0] = maxColorIntensity;
		rgb[1] = maxColorIntensity - percentageFill * colorIntensityDelta;
		rgb[2] = minColorIntensity;
	} else {
		//Anything faster
		rgb[0] = maxColorIntensity;
		rgb[1] = minColorIntensity;
		rgb[2] = minColorIntensity;
	}
	return "rgb(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + ")"
}

var metronome = new tempoTiming(0, 0, 0, new Array(6));
$(document).ready(function() {
    $("button#tap").click(function() {
        metronome.currentTap = Date.now();
        if (metronome.previousTap == 0) {
            metronome.previousTap = metronome.currentTap;
        } else {
            metronome.calculateNewBPM();
            $("button#tap").text(metronome.avgBPM);
			if (flashBPM == false) {
				flashBPM = true;
				flashBPMthruDIV();
			}
        }
    });
});