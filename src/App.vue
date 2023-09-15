<template>
  <div>
      <code-block :content="content" :width="500"></code-block>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import CodeBlock from "./components/code-block.vue";
// 代码
const content = ref<string>(`const show = console.log

async function fact(n) {
  return n === 0 ? 1 : n * (await fact (n - 1))
}

fact(4).then(show)
fact(5).then(show)
fact(2).then(show)
fact(3).then(show)
fact(1).then(show)`)
</script>

<style scoped>

</style>