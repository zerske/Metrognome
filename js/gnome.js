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
var metronome = new tempoTiming(0, 0, 0, new Array(6));
$(document).ready(function() {
    $("button#tap").click(function() {
        metronome.currentTap = Date.now();
        if (metronome.previousTap == 0) {
            metronome.previousTap = metronome.currentTap;
        } else {
            metronome.calculateNewBPM();
            $("button#tap span").text(metronome.avgBPM);
        }
    });
});