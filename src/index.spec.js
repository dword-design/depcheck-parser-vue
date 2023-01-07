import { endent } from '@dword-design/functions'
import depcheck from 'depcheck'
import { outputFile } from 'fs-extra'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from '.'

export default {
  error: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.vue',
        endent`
          <template>
            <foo>
          </template>
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
      expect(result.dependencies).toEqual(['foo'])
      expect(result.invalidFiles[P.resolve('pages', 'index.vue')]).toEqual(
        new Error('SyntaxError: Element is missing end tag.')
      )
    }),
  'script and setup': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.vue',
        endent`
        <script>
        import 'foo'
        </script>

        <script setup>
        import 'bar'
        </script>
      `
      )

      const result = await depcheck('.', {
        package: {
          dependencies: {
            bar: '^1.0.0',
            foo: '^1.0.0',
          },
        },
        parsers: {
          '**/*.vue': self,
        },
      })
      expect(result.dependencies).toEqual([])
    }),
  setup: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'pages/index.vue',
        endent`
        <script setup>
        import 'foo'
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
