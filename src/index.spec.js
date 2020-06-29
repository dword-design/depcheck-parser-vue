import { endent } from '@dword-design/functions'
import execa from 'execa'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  'unused dependency': () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'depcheck.config.js': endent`
        const parser = require('../src')
        module.exports = {
          parser: {
            '*.vue': parser,
          },
        }
      `,
        'package.json': JSON.stringify(
          {
            dependencies: {
              foo: '^1.0.0',
            },
          },
          undefined,
          2
        ),
      })
      await expect(
        execa.command('depcheck --config depcheck.config.js')
      ).rejects.toThrow('Unused dependencies')
    }),
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'depcheck.config.js': endent`
          const parser = require('../src')
          module.exports = {
            parser: {
              '*.vue': parser,
            },
          }
        `,
        'package.json': JSON.stringify(
          {
            dependencies: {
              foo: '^1.0.0',
            },
          },
          undefined,
          2
        ),
        'pages/index.vue': endent`
          <script>
          import foo from 'foo'
          export default {
            computed: {
              foo: () => 1 |> (x => x * 2),
            },
          }
          </script>
        `,
      })
      await execa.command('depcheck --config depcheck.config.js')
    }),
}
