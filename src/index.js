import * as babel from '@babel/core'
import { compact, join } from '@dword-design/functions'
import { parse } from '@vue/compiler-sfc'
import { readFile } from 'fs-extra'

export default async filename => {
  const content = await readFile(filename, 'utf8')

  const parsed = parse(content)
  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0])
  }

  return babel.parse(
    [parsed.descriptor.scriptSetup?.content, parsed.descriptor.script?.content]
      |> compact
      |> join('\n'),
    { filename }
  )
}
