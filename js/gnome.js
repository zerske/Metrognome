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

var metronome = new tempoTiming(0, 0, 0, new Array(10));

var batonSwing = false;

function batonSwingthruDIV() {
	//Display the bpm on the button
	$("#tap").html(metronome.avgBPM);
	
	//Color the background, restrict to 50:10:150 bins
	rgbString = Math.max(50,Math.min(150,10*Math.round(metronome.avgBPM/10)));
	rgbString = "bpmColor" + String(rgbString);
	console.log(rgbString);
	$("body").removeClass (function (index, css) {
		return (css.match (/(^|\s)bpmColor\S+/g) || []).join(' ');
	});
	$("body").addClass(rgbString);
	
	//conversion from bpm to ms, and apply timing for baton
	var ms = Math.round((60 * 1000) / metronome.avgBPM);
	console.log("Beat in ms: " + ms);
	batonMS = ms - 5; //Rest the baton for 15ms.
	$("#baton").css('animation-duration', String(batonMS) + 'ms');
	$("#baton").css('-webkit-animation-duration', String(batonMS) + 'ms');
	$("#baton").css('-moz-animation-duration', String(batonMS) + 'ms');
	
	newSwingClass = "";
	if ($("#baton").hasClass("spinbatton-right")) {
		newSwingClass = "spinbatton-left";
	} else {
		newSwingClass = "spinbatton-right";
	}
	$("#baton").removeClass("spinbatton-right");
	$("#baton").removeClass("spinbatton-left");

	setTimeout(function () {
		$("#baton").addClass(newSwingClass);
	}, 2); //Do 1ms to make sure it happens after 'removeClass'
	if (batonSwing == true) { //Only continue to do this if this is true.
		x = setTimeout(batonSwingthruDIV, ms);
	}
}



$(document).ready(function () {

	//Start with blue background
	$("body").addClass("bpmColor50");
	
	//Baton
	$("#baton").css('animation-duration', '1ms');
	$("#baton").css('-webkit-animation-duration', '1ms');
	$("#baton").css('-moz-animation-duration', '1ms');
	$("#baton").addClass("spinbatton-right");

	$("button#tap").click(function () {
	
		metronome.currentTap = Date.now();
        if (metronome.previousTap == 0) {
            metronome.previousTap = metronome.currentTap;
        } else {
            metronome.calculateNewBPM();
			
			if (batonSwing == false) {
				batonSwing = true;
				batonSwingthruDIV();
			}
        }

	});
});
