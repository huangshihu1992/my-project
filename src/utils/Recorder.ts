import Recorder from "js-audio-recorder";

interface RecorderConfig {
  sampleBits?: number,        // 采样位数
  sampleRate?: number,        // 采样率
  numChannels?: number,       // 声道数
  compiling?: boolean,        // 是否边录边播
}

export class RecorderInterface {
  recorder!: Recorder;

  init(opts?: RecorderConfig) {
    this.recorder = new Recorder({
      sampleBits: opts!.sampleBits || 16,
      sampleRate: opts!.sampleRate,
      numChannels: opts!.numChannels || 1, // 声道 默认1
      compiling: opts!.compiling || true, // 是否边录边转换
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
