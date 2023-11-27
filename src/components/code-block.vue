<script setup lang="ts">
import { onMounted, ref, withDefaults } from 'vue';
import { shikiTokens } from './code-block.ts'

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
// const VINTERVAL = 1.5 * props.fontSize;
// const HINTERVAL = 0.6 * props.fontSize;
const getFontWidthAndHeight = (fontSize: number, fontFamily: string) => {
  const span = document.createElement('span');
  span.style.visibility = "hidden";
  span.style.fontSize = fontSize + 'px';
  span.style.fontFamily = fontFamily;
  span.style.display = "block";
  document.body.appendChild(span);
  if (typeof span.textContent != "undefined") {
    span.textContent = 'a';
  } else {
    span.innerText = 'a';
  }
  const spanComputedStyle = window.getComputedStyle(span);
  return [parseInt(spanComputedStyle.width), parseInt(spanComputedStyle.height)]
}

const fontFamily = '"Lucida Console", Courier, monospace';
const [ HINTERVAL, VINTERVAL ] = getFontWidthAndHeight(props.fontSize, fontFamily);

console.log(HINTERVAL, VINTERVAL)
// adaptive width and height
const getAdaptive = (str: string) => {
  const arr = str.split('\n');
  const len = arr.length;
  const maxHLen = Math.max(...arr.map((item) => item.length));
  return [(maxHLen + 1) * HINTERVAL, (len + 1) * VINTERVAL]
}




const adaptiveWidth = ref<number>(0);
const adaptiveHeight = ref<number>(0);
const [aWidth, aHeight] = getAdaptive(props.content);
adaptiveWidth.value = aWidth;
adaptiveHeight.value = aHeight;


const tokenLines = await shikiTokens(props.content);

// handle space
const decodeContent = (str: string) => {
  if (/^\s+$/.test(str)) {
    return '\u00A0'.repeat(str.length);
  }
  return str;
}

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