import assert from "node:assert/strict";
import test from "node:test";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import extension, {
  normalizeSessionName,
  shouldPromptForSessionStart,
  type SessionStartReason,
} from "../extensions/session-name-prompt.ts";

type SessionStartHandler = (
  event: { reason: SessionStartReason },
  ctx: {
    hasUI: boolean;
    ui: {
      input(title: string, placeholder?: string): Promise<string | undefined>;
    };
  },
) => Promise<void>;

test("prompts for an unnamed startup session", () => {
  assert.equal(shouldPromptForSessionStart("startup", undefined, true), true);
});

test("prompts for new and forked sessions", () => {
  for (const reason of ["new", "fork"] as const) {
    assert.equal(shouldPromptForSessionStart(reason, undefined, true), true);
  }
});

test("does not prompt when resuming or reloading", () => {
  for (const reason of ["resume", "reload"] as const) {
    assert.equal(shouldPromptForSessionStart(reason, undefined, true), false);
  }
});

test("does not prompt an already named session", () => {
  assert.equal(shouldPromptForSessionStart("new", "Already named", true), false);
});

test("does not prompt without UI", () => {
  assert.equal(shouldPromptForSessionStart("new", undefined, false), false);
});

test("normalizes valid names and rejects blank input", () => {
  assert.equal(normalizeSessionName("  Refactor auth  "), "Refactor auth");
  assert.equal(normalizeSessionName(""), undefined);
  assert.equal(normalizeSessionName("   \t"), undefined);
  assert.equal(normalizeSessionName(undefined), undefined);
});

test("sets one trimmed name from the new-session prompt", async () => {
  let sessionStartHandler: SessionStartHandler | undefined;
  const setNameCalls: string[] = [];

  const pi = {
    on(event: string, handler: SessionStartHandler) {
      assert.equal(event, "session_start");
      sessionStartHandler = handler;
    },
    getSessionName() {
      return undefined;
    },
    setSessionName(name: string) {
      setNameCalls.push(name);
    },
  };

  extension(pi as unknown as ExtensionAPI);

  const handler = sessionStartHandler;
  assert.ok(handler);
  await handler({ reason: "new" }, {
    hasUI: true,
    ui: {
      input: async () => "  Plan migration  ",
    },
  });

  assert.deepEqual(setNameCalls, ["Plan migration"]);
});

test("continues without setting a name when input is cancelled", async () => {
  let sessionStartHandler: SessionStartHandler | undefined;
  let setNameCalls = 0;

  const pi = {
    on(_event: string, handler: SessionStartHandler) {
      sessionStartHandler = handler;
    },
    getSessionName() {
      return undefined;
    },
    setSessionName() {
      setNameCalls += 1;
    },
  };

  extension(pi as unknown as ExtensionAPI);

  const handler = sessionStartHandler;
  assert.ok(handler);
  await handler({ reason: "new" }, {
    hasUI: true,
    ui: {
      input: async () => undefined,
    },
  });

  assert.equal(setNameCalls, 0);
});
