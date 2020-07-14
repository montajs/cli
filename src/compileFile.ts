import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';

import { render } from '@montajs/compiler';
import { Config } from './Config';

const CWD = process.cwd();

export async function compileFile(file : string, config : Config) : Promise<void> {
	let spinner = ora(path.relative(CWD, file)).start();

	let filename = path.basename(file, '.mt') + '.html';
	let relativeDirectory = path.relative(config.templateRoot, path.dirname(file));

	try {
		await fs.ensureDir(path.join(config.outDir, relativeDirectory));

		let output = await render(file, { });

		await fs.writeFile(path.join(config.outDir, relativeDirectory, filename), output);
	} catch (error) {
		spinner.fail();
		throw error;
	}

	spinner.succeed();
}
