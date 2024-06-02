// This is a custom class to handle audio files and multiple streams.
// This is necessary as Audio objects do not seem to be passable between files
export class Sound {
  constructor(src, maxStreams = 1, vol = 1) {
    this.streamNum = 0;
    this.streams = [];
    for (let i = 0; i < maxStreams; i++) {
      this.streams.push(new Audio(src));
      this.streams[i].volume = vol;
    }

    this.play = function () {
      this.streamNum = (this.streamNum + 1) % maxStreams;
      this.streams[this.streamNum].play();
    };

    this.stop = function () {
      this.streams[this.streamNum].pause();
      this.streams[this.streamNum].currentTime = 0;
    };
  }
}
