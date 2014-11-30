var metronome = {
    thisTap : 0,
    lastTap : 0,
    avgBPM : 0,
    savedBPMs : new Array(10)
};


$(document).ready(function() {
    // metronome.previousTaps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $("button#tap").click(function() {
        metronome.thisTap = Date.now();
        if (metronome.lastTap == 0) {
            metronome.lastTap = metronome.thisTap;
        } else {
            console.log('A new tap was recorded at ' + metronome.thisTap);
            metronome.avgBPM = averageArr(appendDropLast(calculateBPM(metronome.lastTap, metronome.thisTap), metronome.savedBPMs));
            console.log('Stored BPMs are ' + metronome.savedBPMs);
            console.log('New BPM calculated to be ' + metronome.avgBPM);
            metronome.lastTap = metronome.thisTap;
        }
    });

    function calculateBPM(previous, recent) {
        console.log('Received times ' + previous + ' & ' + recent);
        console.log('Calculated BPM to be ' + 60000 / (recent - previous));
        return Math.round(600 / (recent - previous) * 100);
    }

    function averageArr(arr) {
        arr = cleanArray(arr);
        var sum = arr.reduce(function(a, b) { return a + b });
        var avg = sum / arr.length;
        return Math.round(avg);
    }

    function appendDropLast(newValue, valueSet) {
        valueSet.pop();
        valueSet.unshift(newValue);
        return valueSet;
    }

    function cleanArray(actual){
      var newArray = new Array();
      for(var i = 0; i<actual.length; i++){
          if (actual[i]){
            newArray.push(actual[i]);
        }
      }
      return newArray;
    }
});