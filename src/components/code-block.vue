<script setup lang="ts">
import { onMounted, ref, withDefaults } from 'vue';
import { getFontWidthAndHeight, shikiTokens, getAdaptiveWidthAndHeight, decodeContent } from './code-block.ts'

// 传递进来的数据
const props = withDefaults(defineProps<{
  content: string
  fontSize?: number
  x?: number
  y?: number
}>(), {
  fontSize: 20,
  x: 0,
  y: 0,
})
const emits = defineEmits(['copy']);


const fontFamily = '"Comic sans MS", Courier, monospace';
const [ HINTERVAL, VINTERVAL ] = getFontWidthAndHeight(props.fontSize, fontFamily);

const adaptiveWidth = ref<number>(0);
const adaptiveHeight = ref<number>(0);
const [aWidth, aHeight] = getAdaptiveWidthAndHeight(props.content, HINTERVAL, VINTERVAL);
adaptiveWidth.value = aWidth;
adaptiveHeight.value = aHeight;


const tokenLines = await shikiTokens(props.content);

console.log(tokenLines)

// svg dom 对象
const svgElement = ref<SVGElement | null>(null)
// onMounted(() => {
//   // console.log(svgElement.value?.parentNode)
//   // console.log((svgElement.value as any).getBBox())
//   // 在svg 内部时，需要传入 x 和 y
//   if (svgElement.value?.parentNode?.nodeName === 'svg' && !props.x && !props.y) {
//     console.warn('Please pass the x and y parameters.')
//   }
// })

// click to copy
const copyContent = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  await navigator.clipboard.writeText(props.content)
  emits('copy', props.content)
}

</script>

<template>
  <svg @click="copyContent" :width="adaptiveWidth" :height="adaptiveHeight" 
    :fontFamily="fontFamily" class="backgroundGray" ref="svgElement">
    <text class="userSelectNone" :x="0.5 * HINTERVAL" :y="(index + 1) * VINTERVAL + 0.25 * fontSize" v-for="(tokenLine, index) in tokenLines" :key="index">
      <tspan :font-size="fontSize" :fill="token.color" v-for="(token, index) in tokenLine" :key="index">
        {{ decodeContent(token.content) }}
      </tspan>
    </text>
  </svg>
</template>

<style scoped>
.userSelectNone {
  user-select: text;
  cursor: default;
}

.backgroundGray {
  background-color: #eee;
}

/* 
  备选字体
    font-family="Comic sans MS"
    Lucida Console
*/
</style>
./types.ts