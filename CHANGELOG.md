# Changelog

## [2.0.1](https://github.com/OctopusDeploy/push-package-action/compare/v2.0.0...v2.0.1) (2022-07-19)


### Bug Fixes

* Environment variables from the GitHub action context were not passed through to the underlying Octopus CLI ([54192af](https://github.com/OctopusDeploy/push-package-action/commit/54192af3e733e94e49e7498c37000c8b01572e52))
* StdError and the process exit code returned by the CLI are now shown in Github Action runs ([54192af](https://github.com/OctopusDeploy/push-package-action/commit/54192af3e733e94e49e7498c37000c8b01572e52))

## [2.0.0](https://github.com/OctopusDeploy/push-package-action/compare/v1.2.1...v2.0.0) (2022-07-14)


### ⚠ BREAKING CHANGES

* remove unused inputs

### Features

* Added build summary with list of packages that were pushed ([#253](https://github.com/OctopusDeploy/push-package-action/issues/253)) ([5409834](https://github.com/OctopusDeploy/push-package-action/commit/54098349935277c044f57f16750bd2fa3fb7e395))
* release 2.0.0 ([#248](https://github.com/OctopusDeploy/push-package-action/issues/248)) ([ba24ea6](https://github.com/OctopusDeploy/push-package-action/commit/ba24ea6be13e5e89c2e0faa4f3d29f7fade95ed1))


### Bug Fixes

* fix bug where we'd add the wrong parameter when a log level has been specified ([68b5334](https://github.com/OctopusDeploy/push-package-action/commit/68b5334348cdc49750f5f0bc6ce6a41df04b61ab))


### Code Refactoring

* remove unused inputs ([68b5334](https://github.com/OctopusDeploy/push-package-action/commit/68b5334348cdc49750f5f0bc6ce6a41df04b61ab))

## [1.2.1](https://github.com/OctopusDeploy/push-package-action/compare/v1.2.0...v1.2.1) (2022-06-27)


### Bug Fixes

* updated README ([8026f99](https://github.com/OctopusDeploy/push-package-action/commit/8026f99cf977bd6c24395d27ab245dbdac24781f))

## [1.2.0](https://github.com/OctopusDeploy/push-package-action/compare/v1.1.2...v1.2.0) (2022-06-27)


### Features

* Updated build pipeline and process ([0423898](https://github.com/OctopusDeploy/push-package-action/commit/0423898b33e11eed09eea039292e7189cd133105))

### [1.1.2](https://www.github.com/OctopusDeploy/push-package-action/compare/v1.1.1...v1.1.2) (2022-04-11)


### Bug Fixes

* updated logic to fix use_delta_compression bug ([b40ba56](https://www.github.com/OctopusDeploy/push-package-action/commit/b40ba56f58a70b8a2aea302ab6c2aebb793cfb3a))

### [1.1.1](https://www.github.com/OctopusDeploy/push-package-action/compare/v1.1.0...v1.1.1) (2021-09-17)


### Bug Fixes

* updated action YAML configuration ([ac96b74](https://www.github.com/OctopusDeploy/push-package-action/commit/ac96b7434354b159fe078b2d85333e1e6fb8e5cd))

## [1.1.0](https://www.github.com/OctopusDeploy/push-package-action/compare/v1.0.2...v1.1.0) (2021-09-15)


### Features

* added multiline support for packages ([1134249](https://www.github.com/OctopusDeploy/push-package-action/commit/11342498f4ff8c63384fcee80b8a3b3a712b8a3d))


### Bug Fixes

* added boolean defaults for testing ([e6be1ed](https://www.github.com/OctopusDeploy/push-package-action/commit/e6be1edb6c92ad7ba6e06f092ff8835b7d726f4e))
* replaced use of forEach ([b549384](https://www.github.com/OctopusDeploy/push-package-action/commit/b54938442c3b9c1355b32288a8a0c3bcaa5a632a))

### [1.0.2](https://www.github.com/OctopusDeploy/push-package-action/compare/v1.0.1...v1.0.2) (2021-07-16)


### Miscellaneous Chores

* release 1.0.2 ([efb8af5](https://www.github.com/OctopusDeploy/push-package-action/commit/efb8af54e31e03fc01d4e98772aee914bd67e307))
