import * as babel from '@babel/core'
import { readFile } from 'fs-extra'
import { parseComponent } from 'vue-template-compiler'

export default async filename => {
  const content = await readFile(filename, 'utf8')

  const parsed = parseComponent(content)
  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0])
  }

  return babel.parse(parsed.script.content, { filename })
}
