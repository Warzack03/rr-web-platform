import "dotenv/config";
import { logDatabaseConnectionDiagnostic } from "../server/db/connection-diagnostic";

async function main() {
  await logDatabaseConnectionDiagnostic(
    undefined,
    "[db-deploy-connection]",
  );
}

void main();
