import { type BuildConfig, build } from 'bun'

const cfg: BuildConfig = {
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'node',
	splitting: false,
	packages: 'external',
	minify: true,
}

await build(cfg)
