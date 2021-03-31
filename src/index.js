import * as babel from '@babel/core'
import { readFile } from 'fs-extra'
import { parseComponent } from 'vue-template-compiler'

export default async filename => {
  const content = await readFile(filename, 'utf8')

  const parsed = parseComponent(content)
  if (!parsed.script) {
    return []
  }

  return babel.parse(parsed.script.content, { filename })
}
