<template>
  <div v-cloak>
    <div class="barrage">
      <div v-if="loading" style="padding: 20px 0">
        <van-loading color="#0094ff" size="24px" vertical
          >加载中...</van-loading
        >
      </div>
      <div :style="{ opacity: loading ? 0 : 1 }">
        <div ref="dplayer"></div>
        <img v-if="maskOpen && maskImageUrl" :src="maskImageUrl" width="100%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showLoadingToast } from "vant";
import { onMounted, ref } from "vue";
// static
import { videoList as videos } from "./static";

import bodySegmentation, {
  BodySegmenter,
  MediaPipeSelfieSegmentationMediaPipeModelConfig,
} from "@tensorflow-models/body-segmentation";
import DPlayer from "dplayer";

interface VideoListItem {
  name: string;
  subname: string;
  url: string;
  barrage: string[];
}

const currentVideoUrl = ref("");
const loading = ref(false);
const maskOpen = ref(false);
const maskImageUrl = ref("");
const modelType = ref("landscape");
const videoList = ref<VideoListItem[]>(videos());

const dp = ref<DPlayer | null>(null);
const dplayer = ref(null);
const segmenter = ref<BodySegmenter | null>(null);

const bodySegmentationInit = async () => {
  try {
    const toast = showLoadingToast({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: "模型加载中...",
    });
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: "mediapipe",
      modelType: modelType.value, //general  landscape
      solutionPath: "https://unpkg.com/@mediapipe/selfie_segmentation",
    } as MediaPipeSelfieSegmentationMediaPipeModelConfig;
    segmenter.value = await bodySegmentation.createSegmenter(
      model,
      segmenterConfig
    );
    toast.close()
    dp.value && dp.value.notice('模型加载完成', 1000, 0.5)
    dp.value && dp.value.play()
  } catch (err) {}
};

const dpInit = () => {
  dp.value = new DPlayer({
    container: dplayer.value,
    loop: true,
    volume: 0,
    video: {
      url: currentVideoUrl.value,
    },
    danmaku: {
      id: "9E2E3368B56CDBB4",
      api: "/dplayer/",
      bottom: "10%",
      unlimited: false,
    },
  });
};

const playViedo = async (video: VideoListItem) => {
  // loading
  const toast = showLoadingToast({
    duration: 0, // 持续展示 toast
    forbidClick: true,
    message: "loading",
  });
  if (dp.value) {
    dp.value.pause();
    dp.value.danmaku.clear();
  } else {
    toast.close();
    loading.value = true;
  }

  if (dp.value) {
    dp.value.switchVideo(
      { url: video.url },
      {
        id: "9E2E3368B56CDBB4",
        api: "/dplayer/",
        bottom: "10%",
        unlimited: false,
      }
    );
  } else {
    dpInit();
  }
  loading.value = false;
  await segmenter.value && segmenter.value?.dispose()
  toast.close()
  await bodySegmentationInit()
};

const recognition = async () => {
  const danmaku = dplayer.value && dplayer.value.querySelector('.dplayer-danmaku')
  try {} catch(err) {}
}

onMounted(() => {
  playViedo(videoList.value[0]);
});
</script>

<style lang="less" scoped>
[v-cloak] {
  opacity: 0 !important;
}
.barrage {
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  .dplayer-controller .dplayer-icons .dplayer-full {
    display: none;
  }
  .dplayer-danmaku {
    font-size: 13px !important;
  }
  .van-radio:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
