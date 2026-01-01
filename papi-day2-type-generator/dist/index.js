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
    // Fixed: figlet.textSync returns directly, doesn't use callback
    const banner = figlet.textSync('PAPI Day 2', { font: 'Big' });
    console.log(chalk.cyan(banner));
    console.log(chalk.yellow('\n📋 Checking dependencies...'));
    try {
        const { stdout } = await execAsync('node -v');
        console.log(chalk.green(`✓ Node version: ${stdout.trim()}`));
    }
    catch (e) {
        console.log(chalk.red('✗ Node 18+ required'));
        return;
    }
    console.log(chalk.cyan('\n🔧 Setting up PAPI types...'));
    try {
        console.log(chalk.yellow('  → Adding Polkadot chain...'));
        await execAsync('npx papi add dot -n polkadot');
        console.log(chalk.yellow('  → Generating types...'));
        await execAsync('npx papi');
        console.log(chalk.green('✓ Types generated successfully!\n'));
        await exploreTypes();
    }
    catch (e) {
        console.log(chalk.red(`✗ Setup failed: ${e.message}`));
        console.log(chalk.yellow('\n💡 Try running: npm run clean'));
    }
    console.log(chalk.green('\n✨ Done! Check .papi/descriptors for generated types'));
    console.log(chalk.cyan('   Run "npm run explore" to inspect type files\n'));
}
async function exploreTypes() {
    const descPath = path.join(__dirname, '..', '.papi', 'descriptors');
    try {
        const files = await fs.readdir(descPath);
        console.log(chalk.magenta('📦 Generated files:'));
        files.forEach(file => console.log(chalk.white(`   • ${file}`)));
    }
    catch (e) {
        console.log(chalk.yellow('   ⚠ Descriptors directory not found'));
    }
}
main().catch(err => {
    console.error(chalk.red('\n❌ Fatal error:'), err);
    process.exit(1);
});
