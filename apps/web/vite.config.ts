import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		houdini(),
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'nexo-labs',
				project: 'escohotado'
			}
		}),
		sveltekit()
	],
	server: {
		cors: false,
		host: true,
		fs: {
			allow: ["../.."]
		},
		proxy: {
			'/api': {
				target: `http://localhost:3000`,
				changeOrigin: true,
				secure: false,
				ws: true,
				xfwd: true,
				configure: (proxy, _options) => {
					proxy.on('proxyReq', (proxyReq, req, _res) => {
					  proxyReq.setHeader('host', 'localhost:3000');
					  proxyReq.setHeader('x-forwarded-host', 'localhost:3000');
					  proxyReq.setHeader('origin', 'http://localhost:3000');
				})}
			},
			'/admin': {
				target: `http://localhost:3000`,
				changeOrigin: true,
				secure: false,
				ws: true,
				configure: (proxy, _options) => {
					proxy.on('proxyReq', (proxyReq, req, _res) => {
					  proxyReq.setHeader('host', 'localhost:3000');
					  proxyReq.setHeader('x-forwarded-host', 'localhost:3000');
					  proxyReq.setHeader('origin', 'http://localhost:3000');
				})}
			},
			'/_next': {
				target: `http://localhost:3000`,
				changeOrigin: true,
				secure: false,
				ws: true
			}

		}
	}
});

