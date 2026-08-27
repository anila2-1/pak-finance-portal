import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Client components icon imports', () => {
  it('should not import the server-only phosphor bundle from client components', () => {
    const root = join(process.cwd(), 'src')
    const errors: string[] = []

    function walk(dir: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const fullPath = join(dir, entry.name)

        if (entry.isDirectory()) {
          walk(fullPath)
          continue
        }

        if (!/\.(ts|tsx)$/.test(entry.name)) continue

        const fileText = readFileSync(fullPath, 'utf8')
        if (!fileText.includes("'use client'") && !fileText.includes('"use client"')) continue

        if (fileText.includes('@phosphor-icons/react/dist/ssr')) {
          errors.push(fullPath.replace(process.cwd() + '/', ''))
        }
      }
    }

    walk(root)

    assert.deepStrictEqual(errors, [])
  })
})
