interface CharLocation {
  char: string
  x: number
  y: number
}

export type RenderContent = CharLocation[]

export interface RenderData {
  renderContent: RenderContent
  height: number
}

export interface RenderConfig {
  content: string
  width: number
}
