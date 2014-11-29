$(document).ready(function() {
    var metronome = {
        thisTap: 0,
        previousTaps: new Array(10),
        bpm: 0
    };

    // metronome.previousTaps = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    $("button#tap").click(function() {
        metronome.thisTap = Date.now();
        console.log('A new tap was recorded at ' + metronome.thisTap);
        metronome.previousTaps = dropOldAddNew(metronome.thisTap, metronome.previousTaps);
        console.log('Stored times are ' + metronome.previousTaps);
        metronome.bpm = calculateBPM(metronome.previousTaps);
        console.log('New BPM calculated to be ' + metronome.bpm);
    });

    function calculateBPM(allTimes) {
        var bpm = [];
        for (var i = 0; allTimes.length - 2; i++) {
            console.log('Iterator is set to ' + i);
            if (allTimes[i] != undefined || allTimes[i + 1] != undefined) {
                console.log('Instance BPM is being calculated');
                bpm[i] = (allTimes[i + 1] - allTimes[i]) / 60000;
                console.log('BPM has been stored - ' + bpm);
            } else {

                // WORKING ON CALCULATING THE AVERAGE BPM

                var avgBPM = 0;
                for (var j in bpm) {
                    avgBPM = bpm[j] + avgBPM;
                }
                return avgBPM / j;
            };
        }
    }

    function dropOldAddNew(newValue, valueSet) {
        valueSet.shift();
        valueSet.push(newValue);
        return valueSet;
    }
});