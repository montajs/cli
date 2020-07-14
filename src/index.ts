#!/usr/bin/env node

import normalise from 'normalize-path';
import minimist from 'minimist';
import chokidar from 'chokidar';
import fs from 'fs-extra';

import { configure } from '@montajs/compiler';

import { compileAll } from './compileAll';
import { Config } from './Config';

async function main() : Promise<void> {
	let cliArguments = minimist(process.argv.slice(2));

	if (cliArguments.h || cliArguments.help) {
		console.log('monta');
		console.log('  --root    Sets the root directory (default: ./views)');
		console.log('  --out     Sets the output directory (default: ./dist)');
		console.log('  --watch   Watches the root directory for changes');
		process.exit(0);
	}

	let config : Config = {
		templateRoot: normalise(cliArguments.root ?? cliArguments.templateRoot ?? './views'),
		outDir: normalise(cliArguments.out ?? cliArguments.outDir ?? './dist'),
	};

	if (!fs.pathExistsSync(config.templateRoot)) {
		console.error('Root path does not exist: %s', config.templateRoot);
		process.exit(1);
	}

	await fs.ensureDir(config.outDir);

	configure({
		templateRoot: config.templateRoot,
	});

	await compileAll(config);

	if (cliArguments.watch) {
		let ready = false;
		let watcher = chokidar.watch(config.templateRoot + '/**/*', { cwd: process.cwd() });
		watcher.on('ready', () => ready = true);
		watcher.on('all', async () => {
			if (ready) {
				await compileAll(config);
			}
		});

		console.log('Watching %s', config.templateRoot);
		console.log('Press <enter> to terminate');

		process.stdin.on('data', async () => {
			await watcher.close();
			console.log('Watched stopped');
			process.exit(0);
		});
	}
}

void main();
