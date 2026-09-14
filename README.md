# Pi Packages

A monorepo for independently installable [Pi](https://pi.dev) packages.

## Packages

- [`pi-session-name-prompt`](packages/pi-session-name-prompt) — prompts for an optional, human-entered session name when a new Pi session starts. It intentionally does not generate or refresh names automatically.

## Repository structure

Each directory under `packages/` is a standalone Pi package with its own `package.json`, extension entry points, tests, and publishing lifecycle.

The repository does not use npm workspaces. Pi packages are published and installed independently.

## Development

Run a package's tests from its directory:

```sh
cd packages/pi-session-name-prompt
npm test
```

Try an extension directly in Pi:

```sh
pi -e ./extensions/session-name-prompt.ts
```

## Publishing a package

From the package directory, inspect the tarball before publishing:

```sh
npm pack --dry-run
```

Then publish using that package's npm name and version:

```sh
npm publish --access public
```
