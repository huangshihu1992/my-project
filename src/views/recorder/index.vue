<template></template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { RecorderInterface } from "@/utils/Recorder";

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

const recorder = reactive<RecorderInterface>(new RecorderInterface());
const recorderHelper = reactive(recorder.recorderHelperGenerator());

watch(
  () => recorderHelper.duration,
  newVal => {}
);
</script>

<style lang="less" scoped></style>
