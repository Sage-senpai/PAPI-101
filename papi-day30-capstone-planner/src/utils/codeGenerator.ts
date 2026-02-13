import { Skill, Chain, ProjectPlan } from '../types/plan.types';

export function generatePlan(
  skills: Skill[],
  chains: Chain[],
  projectName: string,
  projectDescription: string
): ProjectPlan {
  const features = skills.map(s => s.title);
  const hasTx = skills.some(s => s.category === 'tx');
  const hasMultiChain = chains.length > 1;
  const hasObservables = skills.some(s => s.day === 14);
  const hasEvents = skills.some(s => s.day === 16);
  const hasBatch = skills.some(s => s.day === 25);
  const hasTesting = skills.some(s => s.day === 27);
  const hasOptimization = skills.some(s => s.day === 28);

  const techStack = [
    'TypeScript',
    'React',
    ...chains.map(c => `${c.name} (PAPI)`),
    ...(hasMultiChain ? ['Multi‑chain'] : []),
    ...(hasTesting ? ['Jest', 'React Testing Library'] : []),
    ...(hasOptimization ? ['Vite', 'Code Splitting'] : []),
  ];

  const dependencies = [
    'polkadot-api',
    ...chains.map(c => `@polkadot-api/descriptors-${c.descriptor}`),
    ...(hasTx ? ['@polkadot/extension-dapp'] : []),
  ];

  const folderStructure = [
    'src/',
    '  ├── components/',
    '  ├── hooks/',
    '  ├── services/',
    '  ├── utils/',
    '  ├── types/',
    '  └── App.tsx',
    'public/',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    ...(hasTesting ? ['jest.config.js', 'src/__tests__/'] : []),
    ...(hasOptimization ? ['vercel.json', 'netlify.toml'] : []),
  ];

  const codeSnippets = [
    {
      title: '1. Setup & TypedApi',
      code: `import { createClient } from 'polkadot-api';\nimport { getSmProvider } from 'polkadot-api/sm-provider';\nimport { ${chains.map(c => c.descriptor).join(', ')} } from '@polkadot-api/descriptors';\n\nconst client = createClient(getSmProvider('${chains[0].wsUrl}'));\nconst api = client.getTypedApi(${chains[0].descriptor});`,
    },
  ];

  if (skills.some(s => s.day === 5)) {
    codeSnippets.push({
      title: '2. Read Constants',
      code: `const version = await api.constants.System.Version();\nconsole.log(\`Runtime: \${version.specVersion}\`);`,
    });
  }

  if (skills.some(s => s.day === 6)) {
    codeSnippets.push({
      title: '3. Query Storage',
      code: `const balance = await api.query.System.Account.getValue('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');\nconsole.log(\`Free balance: \${balance.data.free}\`);`,
    });
  }

  if (hasTx) {
    codeSnippets.push({
      title: '4. Build & Send Transaction',
      code: `const tx = api.tx.Balances.transfer_keep_alive({\n  dest: { Id: '5...' },\n  value: 10000000000n,\n});\nconst result = await tx.signAndSubmit(signer);`,
    });
  }

  if (hasObservables) {
    codeSnippets.push({
      title: '5. Real‑time Updates',
      code: `api.query.System.Number.watchValue().subscribe((blockNumber) => {\n  console.log('New block:', blockNumber);\n});`,
    });
  }

  if (hasEvents) {
    codeSnippets.push({
      title: '6. Event Subscription',
      code: `api.event.System.ExtrinsicSuccess.watch().subscribe((event) => {\n  console.log('Extrinsic succeeded:', event);\n});`,
    });
  }

  const nextSteps = [
    'Initialize project with Vite',
    'Install dependencies',
    'Generate chain descriptors',
    'Implement core features',
    'Add tests',
    'Optimize bundle',
    'Deploy to Vercel/Netlify',
    'Share on Twitter with #PAPI30Days',
  ];

  return {
    name: projectName,
    description: projectDescription,
    chains,
    features,
    techStack: Array.from(new Set(techStack)),
    dependencies: Array.from(new Set(dependencies)),
    folderStructure,
    codeSnippets,
    nextSteps,
  };
}