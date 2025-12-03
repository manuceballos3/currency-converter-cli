import readline from "readline";
import fetch from "node-fetch";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function convert() {
  console.log("=== Currency Converter CLI ===");

  const amount = parseFloat(await ask("Amount to convert: "));
  
    let from;
while (true) {
  from = (await ask("Convert from (or type LIST to show currencies): ")).toUpperCase();

  if (from === "LIST") {
    console.log("\nAvailable currencies:\n");

    const listRes = await fetch("https://api.frankfurter.app/latest");
    const listData = await listRes.json();

    console.log(Object.keys(listData.rates).join(", "));
    console.log("\n");
    continue;
  }

  if (from.length === 3) break;
  console.log("Invalid currency format. Use 3 letters like USD, EUR, ARS.\n");
}

  const to = (await ask("Convert to: ")).toUpperCase();

  console.log("\nObtaining exchange rates...\n");

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error("Invalid response from API");
    }

    const data = await res.json();

    if (!data || !data.rates || !data.rates[to]) {
      console.error("Error: invalid currency or no result returned.");
      rl.close();
      return;
    }

    const result = data.rates[to];

    console.log(`Result: ${amount} ${from} = ${result} ${to}`);
  } catch (error) {
    console.error("Error: Unable to complete the conversion.");
    console.error(error.message);
  }

  rl.close();
}

convert();
