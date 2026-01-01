import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const descPath = path.join(__dirname, '..', '..', '.papi', 'descriptors');
  
  console.log(chalk.cyan('\n🔍 Exploring PAPI Type Descriptors\n'));
  console.log(chalk.gray(`📂 Path: ${descPath}\n`));

  try {
    const files = await fs.readdir(descPath);
    
    if (files.length === 0) {
      console.log(chalk.yellow('⚠ No descriptor files found'));
      console.log(chalk.white('  Run: npm run setup\n'));
      return;
    }

    console.log(chalk.green(`✓ Found ${files.length} file(s):\n`));

    for (const file of files) {
      const filePath = path.join(descPath, file);
      const stats = await fs.stat(filePath);
      
      console.log(chalk.cyan(`📄 ${file}`));
      console.log(chalk.gray(`   Size: ${(stats.size / 1024).toFixed(2)} KB`));
      
      if (file.endsWith('.d.ts')) {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n').slice(0, 5);
        console.log(chalk.white('   Preview:'));
        lines.forEach(line => {
          if (line.trim()) console.log(chalk.gray(`   ${line.substring(0, 80)}`));
        });
      }
      console.log();
    }

    console.log(chalk.green('✨ Type exploration complete!\n'));
    console.log(chalk.white('💡 Import types in your code:'));
    console.log(chalk.cyan('   import { dot } from "@polkadot-api/descriptors"\n'));

  } catch (e) {
    console.log(chalk.red('✗ Error reading descriptors'));
    console.log(chalk.yellow('\n💡 Make sure to run: npm run setup'));
    console.log(chalk.gray(`   Error: ${(e as Error).message}\n`));
  }
}

main().catch(err => {
  console.error(chalk.red('\n❌ Fatal error:'), err);
  process.exit(1);
});