import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const descPath = path.join(__dirname, '..', '..', '.papi/descriptors');
  try {
    const files = await fs.readdir(descPath);
    console.log(chalk.green('Descriptors:'));
    for (const file of files) {
      if (file.endsWith('.js')) {
        const content = await fs.readFile(path.join(descPath, file), 'utf8');
        console.log(chalk.cyan(file + ': ' + content.slice(0, 100) + '...'));
      }
    }
  } catch (e: unknown) {
    console.log(chalk.red('No descriptors: Run setup'));
  }
}

main().catch(console.error);