// This is a custom class to handle audio files and multiple streams.
export class Sound {
  constructor(src, maxStreams = 1, vol = 1) {
    this.streamNum = 0;
    this.streams = [];

    //Iterating through the streams array, adding audio, and setting volume.
    for (let i = 0; i < maxStreams; i++) {
      this.streams.push(new Audio(src));
      this.streams[i].volume = vol;
    }

    //Playing the audio if it does not exceed the maxStreams of the instance.
    // The modular arithmetic allows accessing the next item in the array if there is one.
    this.play = function () {
      this.streamNum = (this.streamNum + 1) % maxStreams;
      this.streams[this.streamNum].play();
    };

    // This simply stops the current instance of the audio
    this.stop = function () {
      this.streams[this.streamNum].pause();
      this.streams[this.streamNum].currentTime = 0;
    };
  }
}
