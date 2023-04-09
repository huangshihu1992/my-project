<template>
  <div class="audio-maker-container">
    <svg-icon className="default-icon" :name="computedRecorderIcon" @click="recorderVoice"></svg-icon>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RecorderInterface } from "@/utils/Recorder";
//@ts-ignore
import SvgIcon from "@/components/SvgIcon.vue";

const props = withDefaults(
  defineProps<{
    audioType: string;
    iconSize: number;
    maxDuration: number;
    maxSize: number;
    numChannels: number;
    sampleBits: number;
    sampleRate: number;
    sizeUnit: "Byte" | "MB" | "KB";
    startIcon: string;
    stopIcon: string;
  }>(),
  {
    audioType: "audio/wav",
    iconSize: 30,
    maxDuration: 10 * 60,
    maxSize: 1,
    numChannels: 1,
    sampleBits: 16,
    sizeUnit: "MB",
    startIcon: "",
    stopIcon: "",
  }
);

const emit = defineEmits<{
  (e: "on-recorder-duration-change", value: number): void;
  (
    e: "on-recorder-finish",
    value: { blob: Blob; size: number; unit: string }
  ): void;
}>();

const recorder = ref<RecorderInterface | null>(null);
const recorderHelper = ref(recorder.value!.recorderHelperGenerator());

watch(
  () => recorderHelper.value.duration,
  (newVal) => {
    if (newVal > props.maxDuration) {
      stopRecord();
    }
  }
);
watch(
  () => recorderHelper.value.size,
  (newVal) => {
    if (newVal >= computedMaxSize.value) {
      stopRecord();
    }
  }
);

const computedSampleRate = computed({
  get() {
    const audioContext = new (window.AudioContext ||
      // @ts-ignore
      window.webkitAudioContext)();
    const defaultSampleRate = audioContext.sampleRate;
    return props.sampleRate || defaultSampleRate;
  },
  set() {},
});
const computedRecorderIcon = computed({
  get() {
    return recorderHelper.value.hearing ? props.stopIcon : props.startIcon;
  },
  set() {},
});
const computedUnitDividend = computed({
  get() {
    const sizeUnit = props.sizeUnit;
    let unitDividend = 1024 * 1024;
    switch (sizeUnit) {
      case "Byte":
        unitDividend = 1;
        break;
      case "KB":
        unitDividend = 1024;
        break;
      case "MB":
        unitDividend = 1024 * 1024;
        break;
      default:
        unitDividend = 1024 * 1024;
    }
    return unitDividend;
  },
  set() {},
});
const computedMaxSize = computed({
  get() {
    return props.maxSize * computedUnitDividend.value;
  },
  set() {},
});

onMounted(() => {
  recorder.value = new RecorderInterface();
  recorder.value.init({
    sampleRate: computedSampleRate.value
  });
});

onBeforeUnmount(() => {
  recorder.value = null;
});

const recorderVoice = () => {
  if (recorderHelper.value.hearing) {
    reset();
    startRecord();
  } else {
    stopRecord();
  }
  recorderHelper.value.hearing = !recorderHelper.value.hearing;
};
const reset = () => {
  recorderHelper.value = recorder.value!.recorderHelperGenerator();
};
const startRecord = () => {
  recorder.value?.startRecord();
  recorder.value!.recorder.onprogress = ({ duration }) => {
    recorderHelper.value.duration = duration;
    emit(
      "on-recorder-duration-change",
      parseFloat(recorderHelper.value.duration.toFixed(2))
    );
  };
};
const stopRecord = () => {
  recorder.value?.stopRecord();
  const audioBlob = new Blob([recorder.value?.recorder.getWAVBlob()], {
    type: props.audioType,
  });
  recorderHelper.value.size = parseFloat(
    (audioBlob.size / computedUnitDividend.value).toFixed(2)
  );
  emit("on-recorder-finish", {
    blob: audioBlob,
    size: recorderHelper.value.size,
    unit: props.sizeUnit,
  });
};
</script>

<style lang="less" scoped>
.default-icon {
  width: 30px;
  height: 30px;
}
</style>
