# pi-session-name-prompt

Prompt for an optional, human-entered name when a new Pi session starts. The extension stores the name in Pi's native session metadata, using the same behavior as the built-in `/name` command.

This package is intentionally a **manual naming prompt**, not an automatic session namer.

## Install

From the parent directory containing `pi-session-name-prompt`, install from a local checkout:

```sh
pi install ./pi-session-name-prompt
```

Install the published package:

```sh
pi install npm:@niklasfyi/pi-session-name-prompt
```

## What it does

The extension prompts for a session name in these cases:

- when Pi starts an initially unnamed session;
- after `/new`;
- after `/fork`;
- after `/clone`.

Pi reports both `/fork` and `/clone` as a forked session-start event, so they use the same handling path.

It does not prompt when resuming or reloading a session. An existing `--name` value is preserved and is not replaced by the prompt.

The prompt is optional:

- Canceling or pressing Escape leaves the session unnamed.
- An empty or whitespace-only response leaves the session unnamed.
- Leading and trailing whitespace is removed before the name is stored.

The extension does not prompt in print mode or JSON mode. It also works with Pi's RPC UI support.

## What it deliberately does not do

This package does not:

- call an LLM or consume model tokens;
- generate a name from the first prompt or conversation;
- rename or refresh sessions automatically later;
- add a `/rename` command, session search, or terminal-title integration;
- overwrite names chosen by you or supplied with `--name`.

If you want automatic or model-generated session names, use a package designed for that purpose instead. This package is for deciding the name yourself at the session boundary.

## Local testing

From inside the `pi-session-name-prompt` package directory, load the extension directly while running Pi:

```sh
pi -e ./extensions/session-name-prompt.ts
```

From the package directory, run the test suite:

```sh
npm test
```
