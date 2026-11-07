const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./app");

test("health endpoint returns API status", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once("listening", resolve));

    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "MeetMind-AI API is running.");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

test("unknown API route returns 404", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once("listening", resolve));

    const address = server.address();
    const response = await fetch(
      `http://127.0.0.1:${address.port}/api/does-not-exist`
    );
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});