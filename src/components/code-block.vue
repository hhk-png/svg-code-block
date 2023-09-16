<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RenderData } from './code-block.types.ts'
import { getRenderData } from './code-block.ts'

// 传递进来的数据
const props = defineProps<{
  content: string
  width: number
  x?: number
  y?: number
}>()

// 
const emits = defineEmits(['copy'])

// 渲染数据
const renderData: RenderData = getRenderData({
  content: props.content,
  width: props.width,
})
// 渲染后元素的高度
const height = renderData.height
// 所用与渲染的数据结构
const renderContent = renderData.renderContent
const decodeChar = (char: string) => {
  if (char === ' ') {
    // 空格
    return '\u00A0'
  }
  if (char === '') {
    // 换行符
    return '\u21B5'
  }
  return char
}

// svg dom 对象
const svgElement = ref<SVGElement | null>(null)
onMounted(() => {
  // console.log(svgElement.value?.parentNode)
  // console.log((svgElement.value as any).getBBox())
  // 在svg 内部时，需要传入 x 和 y
  if (svgElement.value?.parentNode?.nodeName === 'svg' && !props.x && !props.y) {
    console.warn('Please pass the x and y parameters.')
  }
})

// 点击复制
const copyContent = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  await navigator.clipboard.writeText(props.content)
  emits('copy', props.content)
}

// ctrl + c
document.addEventListener('copy', async () => {
  const copiedContent = await navigator.clipboard.readText()
  const content = copiedContent.split('\n').join('')
  console.log(content.replace(/\u21B5/g, '\n'))
})


</script>

<template>
  <svg @click="copyContent" :x="x" :y="y" :width="width" :height="height" ref="svgElement">
    <rect x="0" y="0" :width="width" :height="height" fill="#eee"></rect>
    <text class="monospace" :x="item.x" :y="item.y" v-for="item in renderContent"
      :key="item.char + item.x + item.y">
      {{ decodeChar(item.char) }}
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
