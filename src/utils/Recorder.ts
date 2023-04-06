import Recorder from "js-audio-recorder";

export class RecorderInterface {
  recorder!: Recorder;

  init() {
    this.recorder = new Recorder({
      sampleBits: 16,
      numChannels: 1, // 声道 默认1
      compiling: true, // 是否边录边转换
    });
  }
  recorderHelperGenerator() {
    return {
      hearing: false,
      duration: 0,
      size: 0,
    };
  }
  /** 开始录音 */
  startRecord() {
    this.recorder.start();
  }
  /** 停止录音 */
  stopRecord() {
    this.recorder.stop();
  }
}
