import glob from 'fast-glob';
import path from 'path';
import fs from 'fs-extra';

import { compileFile } from './compileFile';
import { Config } from './Config';

export async function compileAll(config : Config) : Promise<void> {
	let paths = await glob(config.templateRoot + '/**/*', {
		ignore: [
			config.templateRoot + '/components',
			config.templateRoot + '/layouts',
			config.templateRoot + '/partials',
		],
	})
		.then(paths => paths
			.filter(p => p.endsWith('.mt'))
			.map(p => path.resolve(p)));

	for (let file of paths) {
		await compileFile(file, config);
	}

	if (config.staticFiles !== undefined) {
		await fs.copy(config.staticFiles, config.outDir);
	}
}
