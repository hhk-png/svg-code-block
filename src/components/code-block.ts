
import { getHighlighter, setCDN } from 'shiki'
import type { IThemedToken } from 'shiki'

// set shiki config
setCDN('/node_modules/shiki')

// preprocess blank line
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

export const shikiTokens = async (str: string) => {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'nord'],
    langs: ['javascript', 'python']
  });
  const output = highlighter.codeToThemedTokens(str, 'javascript');

  return preprocessToken(output);
}





