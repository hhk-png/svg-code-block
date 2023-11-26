<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { IThemedToken } from 'shiki'
import { shikiTokens } from './code-block.ts'

// 传递进来的数据
const props = defineProps<{
  content: string
  width: number
  height: number
  x?: number
  y?: number
}>()

const fontSize = ref<number>(20);

const preprocessToken = (arr: IThemedToken[][]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length === 0) {
      arr[i].push({
        content: ' ',
        color: '#000',
      });
    }
  }
  return arr;
};

// 
const emits = defineEmits(['copy']);


const tokenLines = preprocessToken(await shikiTokens(props.content));

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
  <svg @click="copyContent" :width="width" :height="height" ref="svgElement">
    <rect :width="width" :height="height" fill="#eee"></rect>
    <text :y="(index + 1) * fontSize" v-for="(tokenLine, index) in tokenLines" :key="index">
      <tspan :font-size="fontSize" :fill="token.color" class="monospace" v-for="(token, index) in tokenLine" :key="index">
        {{ decodeContent(token.content) }}
      </tspan>
    </text>
  </svg>
</template>

<style scoped>
.userSelectNone {
  user-select: none;
}

/* 
  备选字体
    font-family="Comic sans MS"
*/
.monospace {
  font-family: "Lucida Console", Courier, monospace;

}
</style>
./types.ts