import { dot } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/polkadot";
import { start } from "polkadot-api/smoldot";

console.log("🚀 Kicking off PAPI Day 1 - Hello World");
console.log("=".repeat(50));

async function main() {
  try {
    console.log("🔍 Firing up Smoldot light client...");
    const smoldot = start();
    const chain = await smoldot.addChain({ chainSpec });
    console.log("🔄 Smoldot syncing... (may take 30-60s first time)");

    console.log("🌐 Connecting to Polkadot...");
    const client = createClient(getSmProvider(chain));
    console.log("🛡️ Descriptors loaded:", !!dot);  

    console.log("✅ Connection solid! Grabbing latest block...");
    const finalizedHash = await client._request<string, []>("chain_getFinalizedHead", []);
    const blockHeader = await client._request<{ number: number }, [string]>("chain_getHeader", [finalizedHash]);
    console.log(`📦 Latest finalized block: #${blockHeader.number}`);

    displaySuccess();
  } catch (error) {
    console.log("❌ Whoops, something went wrong!");
    console.log("Error details:", error.message);
    console.log("Stack:", error.stack);
    troubleshootingTips();
  }
}

function displaySuccess() {
  console.log("\n");
  console.log("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨");
  console.log("✨                                ✨");
  console.log("✨      PAPI READY! 🎉            ✨");
  console.log("✨                                ✨");
  console.log("✨  Light-Client Power Unlocked   ✨");
  console.log("✨     Modular & Blazing Fast     ✨");
  console.log("✨   TypeScript Superpowers       ✨");
  console.log("✨                                ✨");
  console.log("✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n");

  console.log("🎯 Roadmap for the 30 days:");
  console.log("   Week 1: Basics & Connections");
  console.log("   Week 2: Data Queries & Subs");
  console.log("   Week 3: Tx & Wallet Integrations");
  console.log("   Week 4: Real dApp Builds");
}

function troubleshootingTips() {
  console.log("\n🛠️ Quick fixes:");
  console.log("   1. Reinstall deps: npm install (restores CLI bin)");
  console.log("   2. Re-run CLI: npx papi add dot -n polkadot && npx papi");
  console.log("   3. Check .papi/descriptors/index.ts exports 'dot'");
  console.log("   4. WSS fallback if sync fails: import { getWsProvider } from 'polkadot-api/ws-provider'; const client = createClient(getWsProvider('wss://rpc.polkadot.io'));");
  console.log("   5. Node upgrade: Use v20+ for better perf.");
  console.log("   6. Logs: npm-cache/_logs/ or package.json for file: dep.");
}

main().catch(console.error);