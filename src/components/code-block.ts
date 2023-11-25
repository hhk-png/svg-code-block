
import { getHighlighter, setCDN } from 'shiki'

// set shiki config
setCDN('/node_modules/shiki')

const shikiTokens = async (str: string) => {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'nord'],
    langs: ['javascript', 'python']
  });
  const output = highlighter.codeToThemedTokens(str, 'javascript');

  return output;
}



export const getRenderData = async (content: string)=> {
  
  const lineTokens = await shikiTokens(content)
  
  for (const lineToken of lineTokens) {
    for (const token of lineToken) {
      for (const char of token.content) {
        console.log(char)
      }
    } 
    // end line
  }
}



