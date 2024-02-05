
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
$ wrhs (-v|--version|version)
wrhs/1.3.1 darwin-arm64 node-v20.11.0
$ wrhs --help [COMMAND]
USAGE
  $ wrhs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [Warehouse CLI](#warehouse-cli)
* [Usage](#usage)
* [Commands](#commands)
  * [`wrhs cdn`](#wrhs-cdn)
  * [`wrhs cdn:upload FILEPATH`](#wrhs-cdnupload-filepath)
  * [`wrhs env:create NAME`](#wrhs-envcreate-name)
  * [`wrhs env:get NAME`](#wrhs-envget-name)
  * [`wrhs env:list NAME`](#wrhs-envlist-name)
  * [`wrhs help [COMMAND]`](#wrhs-help-command)
  * [`wrhs hook:create NAME`](#wrhs-hookcreate-name)
  * [`wrhs hook:delete NAME`](#wrhs-hookdelete-name)
  * [`wrhs hook:get NAME`](#wrhs-hookget-name)
  * [`wrhs hook:list NAME`](#wrhs-hooklist-name)
  * [`wrhs object`](#wrhs-object)
  * [`wrhs object:create NAME`](#wrhs-objectcreate-name)
  * [`wrhs object:get NAME`](#wrhs-objectget-name)
  * [`wrhs object:get-head NAME`](#wrhs-objectget-head-name)
  * [`wrhs object:history NAME`](#wrhs-objecthistory-name)
  * [`wrhs object:list-versions NAME`](#wrhs-objectlist-versions-name)
  * [`wrhs object:set-head NAME`](#wrhs-objectset-head-name)
  * [`wrhs upload FILEPATH NAME`](#wrhs-upload-filepath-name)

## `wrhs cdn`

```
USAGE
  $ wrhs cdn

OPTIONS
  --boolean
  --build
  --enum
  --help
  --integer
  --option
  --string
  --version
```

_See code: [src/commands/cdn/index.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/cdn/index.js)_

## `wrhs cdn:upload FILEPATH`

Upload a file to the Warehouse CDN

```
USAGE
  $ wrhs cdn:upload FILEPATH

OPTIONS
  -u, --cdn_base_url=cdn_base_url  cdn base url value that overrides default one configued in the server

  -x, --expiration=expiration      object expiration in human readable format or milliseconds (e.g., 365d, 48h,
                                   1607973280797)
```

_See code: [src/commands/cdn/upload.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/cdn/upload.js)_

## `wrhs env:create NAME`

Create an object enviroment

```
USAGE
  $ wrhs env:create NAME

OPTIONS
  -e, --env=env  (required) object environment (e.g., production, test)
```

_See code: [src/commands/env/create.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/env/create.js)_

## `wrhs env:get NAME`

Describe an object enviroment

```
USAGE
  $ wrhs env:get NAME

OPTIONS
  -e, --env=env  (required) object environment (e.g., production, test)
```

_See code: [src/commands/env/get.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/env/get.js)_

## `wrhs env:list NAME`

List all object enviroments

```
USAGE
  $ wrhs env:list NAME
```

_See code: [src/commands/env/list.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/env/list.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `wrhs hook:create NAME`

Create an object hook

```
USAGE
  $ wrhs hook:create NAME

OPTIONS
  -u, --url=url  (required) hook url
```

_See code: [src/commands/hook/create.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/hook/create.js)_

## `wrhs hook:delete NAME`

Delete an object hook

```
USAGE
  $ wrhs hook:delete NAME

OPTIONS
  -i, --id=id  (required) hook id
```

_See code: [src/commands/hook/delete.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/hook/delete.js)_

## `wrhs hook:get NAME`

Get an object hook

```
USAGE
  $ wrhs hook:get NAME

OPTIONS
  -i, --id=id  (required) hook id
```

_See code: [src/commands/hook/get.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/hook/get.js)_

## `wrhs hook:list NAME`

List all object hooks

```
USAGE
  $ wrhs hook:list NAME
```

_See code: [src/commands/hook/list.js](https://github.com/warehouseai/wrhs/blob/v1.3.1/src/commands/hook/list.js)_

## `wrhs object`

```
USAGE
  $ wrhs object

OPTIONS
  --boolean
  --build
  --enum
  --help
  --integer
  --option
  --string
  --version
```

_See code: [src/commands/object/index.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/index.js)_

## `wrhs object:create NAME`

Create an object in the Warehouse ledger

```
USAGE
  $ wrhs object:create NAME

OPTIONS
  -a, --variant=variant        object variant (e.g., en_US)
  -d, --data=data              (required) object data (e.g., '{ "foo": "bar" }')
  -e, --env=env                object environment (e.g., production, test)
  -v, --version=version        (required) object version (e.g., v1.2.1)

  -x, --expiration=expiration  object expiration in human readable format or milliseconds (e.g., 365d, 48h,
                               1607973280797)
```

_See code: [src/commands/object/create.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/create.js)_

## `wrhs object:get NAME`

Get an object from the Warehouse ledger

```
USAGE
  $ wrhs object:get NAME

OPTIONS
  -a, --accepted-variants=accepted-variants  accepted object variants (e.g., en_US,fr_CA)
  -e, --env=env                              object environment (e.g., production, test)
  -v, --version=version                      object version (e.g., v1.2.1)
```

_See code: [src/commands/object/get.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/get.js)_

## `wrhs object:get-head NAME`

Get the head object from the Warehouse ledger by environment

```
USAGE
  $ wrhs object:get-head NAME

OPTIONS
  -e, --env=env  object environment (e.g., production, test)
```

_See code: [src/commands/object/get-head.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/get-head.js)_

## `wrhs object:history NAME`

Get object history

```
USAGE
  $ wrhs object:history NAME

OPTIONS
  -e, --env=env  (required) object environment (e.g., production, test)
```

_See code: [src/commands/object/history.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/history.js)_

## `wrhs object:list-versions NAME`

List all the object versions

```
USAGE
  $ wrhs object:list-versions NAME
```

_See code: [src/commands/object/list-versions.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/list-versions.js)_

## `wrhs object:set-head NAME`

Set the object head to a specific version

```
USAGE
  $ wrhs object:set-head NAME

OPTIONS
  -e, --env=env          [default: production] object environment (e.g., production, test)
  -f, --fromEnv=fromEnv  use head version for env
  -v, --version=version  object head version (e.g., v1.2.1)
```

_See code: [src/commands/object/set-head.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/object/set-head.js)_

## `wrhs upload FILEPATH NAME`

Upload a file to the CDN and create an object in the Warehouse ledger

```
USAGE
  $ wrhs upload FILEPATH NAME

OPTIONS
  -a, --variant=variant            object variant (e.g., en_US)
  -e, --env=env                    object environment (e.g., production, test)
  -u, --cdn_base_url=cdn_base_url  cdn base url value that overrides default one configued in the server
  -v, --version=version            (required) object version (e.g., v1.2.1)

  -x, --expiration=expiration      object expiration in human readable format or milliseconds (e.g., 365d, 48h,
                                   1607973280797)
```

_See code: [src/commands/upload.js](https://github.com/godaddy/wrhs/blob/v1.3.1/src/commands/upload.js)_
<!-- commandsstop -->
