import { RenderData, RenderConfig, RenderContent } from "./types"

export const getRenderData = (renderConfig: RenderConfig): RenderData => {
  // 配置
  const { content, width } = renderConfig
  const dx = 10
  const dy = 24
  const paddingLeft = 5
  let x: number = paddingLeft
  let y: number = dy
  const renderContent: RenderContent = []
  for (let i = 0; i < content.length; i++) {
    // 检测时换行符
    if (content[i] === "\n") {
      renderContent.push({
        char: "",
        x,
        y
      })
      x = paddingLeft
      y += dy
    } else {
      // 其他字符
      renderContent.push({
        char: content[i],
        x,
        y
      })
      x += dx
      if (x > width) {
        x = 0
        y += dy
      }
    }
  }
  return {
    renderContent: renderContent,
    height: y + 12
  }
}



