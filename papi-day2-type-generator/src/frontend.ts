// src/frontend.ts
import "./styles/styles.scss"; //import for  styles
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec as polkadotChainSpec } from "polkadot-api/chains/polkadot";
import { start } from "polkadot-api/smoldot";

const consoleEl = document.getElementById("console") as HTMLElement;
const statusText = document.getElementById("status-text") as HTMLElement;
const blockNumberEl = document.getElementById("block-number") as HTMLElement;
const typesStatus = document.getElementById("types-status") as HTMLElement;

function log(line: string, type: "output" | "warning" | "error" = "output") {
  const div = document.createElement("div");
  div.className = `console-line console-${type}`;
  div.textContent = line;
  consoleEl.appendChild(div);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

async function main() {
  log("🌐 Starting Smoldot light client in browser...", "output");

  try {
    const smoldot = start();
    log("🔄 Adding Polkadot chain spec...", "output");
    const chain = await smoldot.addChain({ chainSpec: polkadotChainSpec });

    log("✅ Chain added – connecting client...", "output");
    const client = createClient(getSmProvider(chain));

    statusText.textContent = "Connected!";
    statusText.style.color = "#00ff88";

    log("📦 Fetching latest finalized block...", "output");
    const finalizedHash = await client._request<string, []>("chain_getFinalizedHead", []);
    const header = await client._request<{ number: number }, [string]>("chain_getHeader", [finalizedHash]);

    blockNumberEl.textContent = `#${header.number}`;
    log(`🎉 Latest finalized block: #${header.number}`, "output");

    // Note about types (generated on Node side)
    typesStatus.textContent = "Available via Node setup (.papi/descriptors)";
    typesStatus.style.color = "#ffb74d";
    log("🛈 Types are generated server-side – import { dot } from '@polkadot-api/descriptors' in your code", "warning");

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`❌ Error: ${msg}`, "error");
    statusText.textContent = "Failed";
    statusText.style.color = "#ff5252";
  }
}

main();