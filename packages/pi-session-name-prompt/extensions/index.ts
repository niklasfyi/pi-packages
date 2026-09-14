import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export type SessionStartReason = "startup" | "reload" | "new" | "resume" | "fork";

const PROMPT_REASONS = new Set<SessionStartReason>(["startup", "new", "fork"]);

export function shouldPromptForSessionStart(
  reason: SessionStartReason,
  currentName: string | undefined,
  hasUI: boolean,
): boolean {
  return hasUI && PROMPT_REASONS.has(reason) && !currentName?.trim();
}

export function normalizeSessionName(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

export default function sessionNamePrompt(pi: ExtensionAPI): void {
  pi.on("session_start", async (event, ctx) => {
    if (!shouldPromptForSessionStart(event.reason, pi.getSessionName(), ctx.hasUI)) {
      return;
    }

    const name = normalizeSessionName(await ctx.ui.input("Session name", "Optional"));
    if (name) {
      pi.setSessionName(name);
    }
  });
}
