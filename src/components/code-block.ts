
import { getHighlighter, setCDN } from 'shiki'

// set shiki config
setCDN('/node_modules/shiki')

export const shikiTokens = async (str: string) => {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'nord'],
    langs: ['javascript', 'python']
  });
  const output = highlighter.codeToThemedTokens(str, 'javascript');

  return output;
}





