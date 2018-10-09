`wrhs` CLI for Warehouse.ai
====

Flawless CLI management of build pipelines & asset deployments for your front-end apps powered by [Warehouse.ai].

# Configuration
`wrhs` configuration can be passed in via CLI flags (more information on this below), or by creating a configuration file at `~/.wrhs`.
### Example `.wrhs` file:
```
{
  "hosts": {
    "wrhs": "warehouse.ai",
    "status": "warehouse-status.ai"
  },
  "auth": {
    "user": "username",
    "pass": "password"
  }
}
```


[![License](https://img.shields.io/npm/l/wrhs.svg)](https://github.com/warehouseai/wrhs/blob/master/package.json)

<!-- toc -->
* [Configuration](#configuration)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wrhs
$ wrhs COMMAND
running command...
$ wrhs (-v|--version|version)
wrhs/0.3.0 darwin-x64 node-v8.9.4
$ wrhs --help [COMMAND]
USAGE
  $ wrhs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wrhs get:build PACKAGE ENV [LOCALE]`](#wrhs-getbuild-package-env-locale)
* [`wrhs get:head PACKAGE ENV`](#wrhs-gethead-package-env)
* [`wrhs get:status PACKAGE ENV`](#wrhs-getstatus-package-env)
* [`wrhs help [COMMAND]`](#wrhs-help-command)

## `wrhs get:build PACKAGE ENV [LOCALE]`

Gets information about builds that exist in warehouse.

```
USAGE
  $ wrhs get:build PACKAGE ENV [LOCALE]

ARGUMENTS
  PACKAGE  The package to get builds for
  ENV      The environment to get builds for
  LOCALE   The specific locale to fetch. Defaults to en-US

OPTIONS
  -h, --host=host                The base url for the warehouse API
  -j, --json                     Output response data as JSON
  -p, --pass=pass                Password
  -s, --status-host=status-host  The base url for the warehouse status API
  -u, --user=user                Username

DESCRIPTION
  If no version is specified, the head version will be returned.
```

_See code: [src/commands/get/build.js](https://github.com/warehouseai/wrhs/blob/v0.3.0/src/commands/get/build.js)_

## `wrhs get:head PACKAGE ENV`

Shows information about the head build for the given package in the given environment.

```
USAGE
  $ wrhs get:head PACKAGE ENV

ARGUMENTS
  PACKAGE  The package to get the head build for
  ENV      The environment to get the head build for

OPTIONS
  -h, --host=host                The base url for the warehouse API
  -j, --json                     Output response data as JSON
  -p, --pass=pass                Password
  -s, --status-host=status-host  The base url for the warehouse status API
  -u, --user=user                Username

DESCRIPTION
  Accepts an optional locale.
```

_See code: [src/commands/get/head.js](https://github.com/warehouseai/wrhs/blob/v0.3.0/src/commands/get/head.js)_

## `wrhs get:status PACKAGE ENV`

Get information about the status of a build.

```
USAGE
  $ wrhs get:status PACKAGE ENV

ARGUMENTS
  PACKAGE  The package to get status information for
  ENV      The environment to get status information for

OPTIONS
  -e, --events                   Should status events be fetched. Defaults to false
  -h, --host=host                The base url for the warehouse API
  -j, --json                     Output response data as JSON
  -l, --locale=locale            Only get events for a specific locale
  -p, --pass=pass                Password
  -s, --status-host=status-host  The base url for the warehouse status API
  -u, --user=user                Username

DESCRIPTION
  -e can be used to get the more granular status events.
```

_See code: [src/commands/get/status.js](https://github.com/warehouseai/wrhs/blob/v0.3.0/src/commands/get/status.js)_

## `wrhs help [COMMAND]`

display help for wrhs

```
USAGE
  $ wrhs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.2/src/commands/help.ts)_
<!-- commandsstop -->


[Warehouse.ai]: https://github.com/godaddy/warehouse.ai
