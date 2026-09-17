import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  getRuntimeDatabaseConfig,
  getRuntimeDatabaseConfigSource,
} from "@/server/db/runtime-config";

const originalNextPhase = process.env.NEXT_PHASE;
const originalConnectionLimit = process.env.DB_CONNECTION_LIMIT;
const originalDatabasePort = process.env.DB_PORT;
const originalDatabaseUrl = process.env.DATABASE_URL;
const originalRuntimeVariables = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

afterEach(() => {
  if (originalNextPhase === undefined) {
    delete process.env.NEXT_PHASE;
  } else {
    process.env.NEXT_PHASE = originalNextPhase;
  }

  if (originalConnectionLimit === undefined) {
    delete process.env.DB_CONNECTION_LIMIT;
  } else {
    process.env.DB_CONNECTION_LIMIT = originalConnectionLimit;
  }

  if (originalDatabasePort === undefined) {
    delete process.env.DB_PORT;
  } else {
    process.env.DB_PORT = originalDatabasePort;
  }

  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }

  for (const [key, value] of Object.entries(originalRuntimeVariables)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("runtime database pool configuration", () => {
  it("keeps the configured pool limit during normal runtime", () => {
    delete process.env.NEXT_PHASE;
    process.env.DB_CONNECTION_LIMIT = "5";

    assert.equal(getRuntimeDatabaseConfig().connectionLimit, 5);
  });

  it("limits every Next.js build worker to one connection", () => {
    process.env.NEXT_PHASE = "phase-production-build";
    process.env.DB_CONNECTION_LIMIT = "5";

    assert.equal(getRuntimeDatabaseConfig().connectionLimit, 1);
  });

  it("uses DATABASE_URL atomically when DB variables are incomplete", () => {
    process.env.DATABASE_URL =
      "mysql://url-user:url-password@url-host:3307/url-database?connection_limit=4";
    process.env.DB_HOST = "stale-host";
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;
    delete process.env.NEXT_PHASE;

    const config = getRuntimeDatabaseConfig();

    assert.equal(
      getRuntimeDatabaseConfigSource(),
      "DATABASE_URL_WITH_PARTIAL_DB_VARIABLES_IGNORED",
    );
    assert.equal(config.host, "url-host");
    assert.equal(config.port, 3307);
    assert.equal(config.user, "url-user");
    assert.equal(config.password, "url-password");
    assert.equal(config.database, "url-database");
    assert.equal(config.connectionLimit, 4);
  });

  it("normalizes quoted non-secret DB variables when the complete set exists", () => {
    process.env.DATABASE_URL =
      "mysql://url-user:url-password@url-host:3307/url-database";
    process.env.DB_HOST = '"localhost"';
    process.env.DB_USER = '"hostinger-user"';
    process.env.DB_PASSWORD = "exact-password";
    process.env.DB_NAME = '"hostinger-db"';
    process.env.DB_PORT = "3306";
    delete process.env.NEXT_PHASE;

    const config = getRuntimeDatabaseConfig();

    assert.equal(getRuntimeDatabaseConfigSource(), "DB_VARIABLES");
    assert.equal(config.host, "localhost");
    assert.equal(config.user, "hostinger-user");
    assert.equal(config.password, "exact-password");
    assert.equal(config.database, "hostinger-db");
  });
});
