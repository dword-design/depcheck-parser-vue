import { endent } from '@dword-design/functions'
import depcheck from 'depcheck'
import { outputFile } from 'fs-extra'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from '.'

export default {
  'unused dependency': () =>
    withLocalTmpDir(async () => {
      const result = await depcheck('.', {
        package: {
          dependencies: {
            foo: '^1.0.0',
          },
        },
        parsers: {
          '**/*.vue': self,
        },
      })
      expect(result.dependencies).toEqual(['foo'])
    }),
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.vue',
        endent`
        <script>
        import foo from 'foo'
        export default {
          computed: {
            foo: () => 1 |> (x => x * 2),
          },
        }
        </script>
      `
      )

      const result = await depcheck('.', {
        package: {
          dependencies: {
            foo: '^1.0.0',
          },
        },
        parsers: {
          '**/*.vue': self,
        },
      })
      expect(result.dependencies).toEqual([])
    }),
}
