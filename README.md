
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/wrhs.svg)](https://npmjs.org/package/wrhs)
[![Downloads/week](https://img.shields.io/npm/dw/wrhs.svg)](https://npmjs.org/package/wrhs)
[![License](https://img.shields.io/npm/l/wrhs.svg)](https://github.com/godaddy/wrhs/wrhs/blob/main/package.json)
[![npm Downloads](https://img.shields.io/npm/dm/wrhs.svg?style=flat-square)](https://npmcharts.com/compare/wrhs?minimal=true)

# Warehouse CLI

Robust CLI for the next generation of Object ledger and CDN.

<!-- toc -->
* [Warehouse CLI](#warehouse-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wrhs
$ wrhs COMMAND
running command...
$ wrhs (--version)
wrhs/1.3.1 darwin-arm64 node-v20.11.0
$ wrhs --help [COMMAND]
USAGE
  $ wrhs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wrhs cdn:upload FILEPATH`](#wrhs-cdnupload-filepath)
* [`wrhs env`](#wrhs-env)
* [`wrhs env:create NAME`](#wrhs-envcreate-name)
* [`wrhs env:get NAME`](#wrhs-envget-name)
* [`wrhs env:list NAME`](#wrhs-envlist-name)
* [`wrhs help [COMMANDS]`](#wrhs-help-commands)
* [`wrhs hook:create NAME`](#wrhs-hookcreate-name)
* [`wrhs hook:delete NAME`](#wrhs-hookdelete-name)
* [`wrhs hook:get NAME`](#wrhs-hookget-name)
* [`wrhs hook:list NAME`](#wrhs-hooklist-name)
* [`wrhs object:create NAME`](#wrhs-objectcreate-name)
* [`wrhs object:get NAME`](#wrhs-objectget-name)
* [`wrhs object:get-head NAME`](#wrhs-objectget-head-name)
* [`wrhs object:history NAME`](#wrhs-objecthistory-name)
* [`wrhs object:list-versions NAME`](#wrhs-objectlist-versions-name)
* [`wrhs object:set-head NAME`](#wrhs-objectset-head-name)
* [`wrhs upload FILEPATH NAME`](#wrhs-upload-filepath-name)

## `wrhs cdn:upload FILEPATH`

Upload a file to the Warehouse CDN

```
USAGE
  $ wrhs cdn:upload FILEPATH [-x <value>] [-u <value>] [-s]

FLAGS
  -s, --use_single_fingerprint  use a single fingerprint for all the files in a package
  -u, --cdn_base_url=<value>    cdn base url value that overrides default one configued in the server
  -x, --expiration=<value>      object expiration in human readable format or milliseconds (e.g., 365d, 48h,
                                1607973280797)

DESCRIPTION
  Upload a file to the Warehouse CDN
```

_See code: [src/commands/cdn/upload.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/cdn/upload.js)_

## `wrhs env`

```
USAGE
  $ wrhs env [--build] [--option] [--enum] [--string] [--version] [--help] [--boolean] [--integer]

FLAGS
  --boolean
  --build
  --enum
  --help
  --integer
  --option
  --string
  --version
```

_See code: [src/commands/env/index.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/env/index.js)_

## `wrhs env:create NAME`

Create an object environment

```
USAGE
  $ wrhs env:create NAME -e <value>

FLAGS
  -e, --env=<value>  (required) object environment (e.g., production, test)

DESCRIPTION
  Create an object environment
```

_See code: [src/commands/env/create.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/env/create.js)_

## `wrhs env:get NAME`

Describe an object enviroment

```
USAGE
  $ wrhs env:get NAME -e <value>

FLAGS
  -e, --env=<value>  (required) object environment (e.g., production, test)

DESCRIPTION
  Describe an object enviroment
```

_See code: [src/commands/env/get.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/env/get.js)_

## `wrhs env:list NAME`

List all object enviroments

```
USAGE
  $ wrhs env:list NAME

DESCRIPTION
  List all object enviroments
```

_See code: [src/commands/env/list.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/env/list.js)_

## `wrhs help [COMMANDS]`

Display help for wrhs.

```
USAGE
  $ wrhs help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for wrhs.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

## `wrhs hook:create NAME`

Create an object hook

```
USAGE
  $ wrhs hook:create NAME -u <value>

FLAGS
  -u, --url=<value>  (required) hook url

DESCRIPTION
  Create an object hook
```

_See code: [src/commands/hook/create.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/hook/create.js)_

## `wrhs hook:delete NAME`

Delete an object hook

```
USAGE
  $ wrhs hook:delete NAME -i <value>

FLAGS
  -i, --id=<value>  (required) hook id

DESCRIPTION
  Delete an object hook
```

_See code: [src/commands/hook/delete.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/hook/delete.js)_

## `wrhs hook:get NAME`

Get an object hook

```
USAGE
  $ wrhs hook:get NAME -i <value>

FLAGS
  -i, --id=<value>  (required) hook id

DESCRIPTION
  Get an object hook
```

_See code: [src/commands/hook/get.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/hook/get.js)_

## `wrhs hook:list NAME`

List all object hooks

```
USAGE
  $ wrhs hook:list NAME

DESCRIPTION
  List all object hooks
```

_See code: [src/commands/hook/list.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/hook/list.js)_

## `wrhs object:create NAME`

Create an object in the Warehouse ledger

```
USAGE
  $ wrhs object:create NAME -v <value> [-e <value>] [-a <value>] [-x <value>] [-d <value>]

FLAGS
  -a, --variant=<value>     object variant (e.g., en_US)
  -d, --data=<value>        object data (e.g., '{ "foo": "bar" }')
  -e, --env=<value>         object environment (e.g., production, test)
  -v, --version=<value>     (required) object version (e.g., v1.2.1)
  -x, --expiration=<value>  object expiration in human readable format or milliseconds (e.g., 365d, 48h, 1607973280797)

DESCRIPTION
  Create an object in the Warehouse ledger

EXAMPLES
  $ echo '{"foo": "bar"}' | wrhs object:create my-object --version v1.0.0

  $ wrhs object:create my-object --version v1.0.0 --data '{"foo": "bar"}'
```

_See code: [src/commands/object/create.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/create.js)_

## `wrhs object:get NAME`

Get an object from the Warehouse ledger

```
USAGE
  $ wrhs object:get NAME [-e <value>] [-v <value>] [-a <value>]

FLAGS
  -a, --accepted-variants=<value>  accepted object variants (e.g., en_US,fr_CA)
  -e, --env=<value>                object environment (e.g., production, test)
  -v, --version=<value>            object version (e.g., v1.2.1)

DESCRIPTION
  Get an object from the Warehouse ledger
```

_See code: [src/commands/object/get.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/get.js)_

## `wrhs object:get-head NAME`

Get the head object from the Warehouse ledger by environment

```
USAGE
  $ wrhs object:get-head NAME [-e <value>]

FLAGS
  -e, --env=<value>  object environment (e.g., production, test)

DESCRIPTION
  Get the head object from the Warehouse ledger by environment
```

_See code: [src/commands/object/get-head.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/get-head.js)_

## `wrhs object:history NAME`

Get object history

```
USAGE
  $ wrhs object:history NAME -e <value>

FLAGS
  -e, --env=<value>  (required) object environment (e.g., production, test)

DESCRIPTION
  Get object history
```

_See code: [src/commands/object/history.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/history.js)_

## `wrhs object:list-versions NAME`

List all the object versions

```
USAGE
  $ wrhs object:list-versions NAME

DESCRIPTION
  List all the object versions
```

_See code: [src/commands/object/list-versions.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/list-versions.js)_

## `wrhs object:set-head NAME`

Set the object head to a specific version

```
USAGE
  $ wrhs object:set-head NAME [-e <value>] [-v <value>] [-f <value>]

FLAGS
  -e, --env=<value>      [default: production] object environment (e.g., production, test)
  -f, --fromEnv=<value>  use head version for env
  -v, --version=<value>  object head version (e.g., v1.2.1)

DESCRIPTION
  Set the object head to a specific version
```

_See code: [src/commands/object/set-head.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/set-head.js)_

## `wrhs upload FILEPATH NAME`

Upload a file to the CDN and create an object in the Warehouse ledger

```
USAGE
  $ wrhs upload FILEPATH NAME -v <value> [-e <value>] [-a <value>] [-x <value>] [-u <value>] [-s]

FLAGS
  -a, --variant=<value>         object variant (e.g., en_US)
  -e, --env=<value>             object environment (e.g., production, test)
  -s, --use_single_fingerprint  use a single fingerprint for all the files in a package
  -u, --cdn_base_url=<value>    cdn base url value that overrides default one configued in the server
  -v, --version=<value>         (required) object version (e.g., v1.2.1)
  -x, --expiration=<value>      object expiration in human readable format or milliseconds (e.g., 365d, 48h,
                                1607973280797)

DESCRIPTION
  Upload a file to the CDN and create an object in the Warehouse ledger
```

_See code: [src/commands/upload.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/upload.js)_
<!-- commandsstop -->
