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

// 渲染数据
const renderData: RenderData = getRenderData({
  content: props.content,
  width: props.width,
})
// 渲染后元素的高度
const height = renderData.height
// 所用与渲染的数据结构
const renderContent = renderData.renderContent

// svg dom 对象
const svgElement = ref<SVGElement | null>(null)
onMounted(() => {
  // console.log(svgElement.value?.parentNode)
  console.log((svgElement.value as any).getBBox())
  if (svgElement.value?.parentNode?.nodeName === 'svg' && !props.x && !props.y) {
    throw new Error('Please pass the x and y parameters.')
  }
})

</script>

<template>
  <svg :width="width" :height="height" ref="svgElement">
    <rect x="0" y="0" :width="width" :height="height" fill="#eee"></rect>
    <text class="monospace userSelectNone" :x="item.x" :y="item.y" v-for="item in renderContent"
      :key="item.char + item.x + item.y">
      {{ item.char }}
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
