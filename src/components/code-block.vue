<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

getRenderData(props.content)

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

// click to copy
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
  <svg @click="copyContent" ref="svgElement">
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