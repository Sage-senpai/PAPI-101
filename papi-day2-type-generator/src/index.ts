import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const banner = await new Promise<string>((resolve, reject) => {
    figlet.textSync('PAPI Day 2', { font: 'Big' }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  console.log(chalk.cyan(banner));

  console.log(chalk.yellow('Checking deps...'));
  try {
    await execAsync('node -v');
    console.log(chalk.green('Node good!'));
  } catch (e: unknown) {
    console.log(chalk.red('Need Node 18+'));
    return;
  }

  console.log(chalk.cyan('Setting up types...'));
  try {
    await execAsync('npx papi add dot -n polkadot');
    await execAsync('npx papi');
    console.log(chalk.green('Types generated!'));
    await exploreTypes();
  } catch (e: unknown) {
    console.log(chalk.red('Setup failed: ' + (e as Error).message));
    console.log(chalk.yellow('Try npm clean'));
  }

  console.log(chalk.green('Done! Check .papi/descriptors'));
}

async function exploreTypes() {
  const descPath = path.join(__dirname, '..', '.papi/descriptors');
  const files = await fs.readdir(descPath);
  console.log(chalk.magenta('Files: ' + files.join(', ')));
}

main().catch(console.error);