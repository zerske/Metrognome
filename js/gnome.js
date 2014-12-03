function tempo(current, previous, avg, saved) {
    this.currentTap = current;
    this.previousTap = previous;
    this.avgBPM = avg;
    this.savedBPMs = saved;
    this.cleanArray = function(actual) {
        var newArray = new Array();
        for(var i = 0; i<actual.length; i++){
            if (actual[i]){
                newArray.push(actual[i]);
        }
      }
      return newArray;
    };
    this.appendDropLast = function(newValue, valueSet) {
        valueSet.pop();
        valueSet.unshift(newValue);
        return valueSet;
    };
    this.averageArr = function(arr) {
        arr = this.cleanArray(arr);
        var sum = arr.reduce(function(a, b) { return a + b });
        var avg = sum / arr.length;
        return Math.round(avg);
    };
    this.calculateBPM = function(previous, recent) {
        var bpm = Math.max(Math.min(Math.round(600 / (recent - previous) * 100), 240), 40);
        console.log('Received times ' + previous + ' & ' + recent);
        console.log('Calculated BPM to be ' + bpm + ' (range restricted between 40-240)');
        return bpm;
    };
}
$(document).ready(function() {
    var metronome = new tempo(0, 0, 0, new Array(10));
    $("button#tap").click(function() {
        metronome.currentTap = Date.now();
        if (metronome.previousTap == 0) {
            metronome.previousTap = metronome.currentTap;
        } else {
            console.log('A new tap was recorded at ' + metronome.currentTap);
            var thisBPM = metronome.calculateBPM(metronome.previousTap, metronome.currentTap)
            metronome.savedBPMs = metronome.appendDropLast(thisBPM, metronome.savedBPMs);
            metronome.avgBPM = metronome.averageArr(metronome.savedBPMs);
            console.log('Stored BPMs are ' + metronome.savedBPMs);
            console.log('New BPM calculated to be ' + metronome.avgBPM);
            $("button#tap span").text(metronome.avgBPM);
            metronome.previousTap = metronome.currentTap;
        }
    });
});