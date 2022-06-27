# push-package-action

<img alt= "" src="https://github.com/OctopusDeploy/push-package-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to pushes a package to [Octopus Deploy](https://octopus.com/). It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@<version>
    with:
      version: latest
  - name: Push a package to Octopus Deploy 🐙
    uses: OctopusDeploy/push-package-action@v1
    with:
      api_key: ${{ secrets.API_KEY }}
      packages: 'package1,package2'
      server: ${{ secrets.SERVER }}
```

Here's an example that provides a `username` and `password` to authenticate to Octopus Deploy:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@<version>
    with:
      version: latest
  - name: Push a package to Octopus Deploy 🐙
    uses: OctopusDeploy/push-package-action@v1
    with:
      password: ${{ secrets.PASSWORD }}
      packages: 'package1,package2'
      server: ${{ secrets.SERVER }}
      username: ${{ secrets.USERNAME }}
```

## 📥 Inputs

The following inputs are optional:

| Name                    | Description                                                                                                                                                                                                                                                                                                      |    Default     |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| `api_key`               | The API key used to access Octopus Deploy. This value is required if credentials (`username` and `password`) are unspecified. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret.                                                |                |
| `config_file`           | The path to a configuration file of default values with one `key=value` per line.                                                                                                                                                                                                                                |                |
| `debug`                 | Enable debug logging.                                                                                                                                                                                                                                                                                            |    `false`     |
| `ignore_ssl_errors`     | Ignore certificate errors when communicating with Octopus Deploy. Warning: enabling this option creates a security vulnerability.                                                                                                                                                                                |    `false`     |
| `log_level`             | The log level; valid options are `verbose`, `debug`, `information`, `warning`, `error`, and `fatal`.                                                                                                                                                                                                             |    `debug`     |
| `overwrite_mode`        | Determines the action to perform with package if it already exists in the repository. Valid input values are `FailIfExists`, `OverwriteExisting`, and `IgnoreIfExists`.                                                                                                                                          | `FailIfExists` |
| `packages`              | A multi-line and/or comma-delimited list of packages to push to Octopus Deploy (i.e. package1,package2).                                                                                                                                                                                                         |                |
| `password`              | The password to used to authenticate with Octopus Deploy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                                                                |                |
| `proxy`                 | The URL of a proxy to use (i.e. `https://proxy.example.com`).                                                                                                                                                                                                                                                    |                |
| `proxy_password`        | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. If `proxy_username` and `proxy_password` are omitted and `proxy` is specified, the default credentials are used.                                                                                |                |
| `proxy_username`        | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                                                                                 |                |
| `release_existing`      | If the package already exists in the repository, the default behavior is to reject the new package being pushed. You can pass this flag to overwrite the existing package. This flag may be deprecated in a future version; passing it is the same as using `OverwriteExisting` for the input, `overwrite_mode`. |                |
| `server`                | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is recommended to retrieve this value from an environment variable.                                                                                                                                                                 |                |
| `space`                 | The name or ID of a space within which this command will be executed. If omitted, the default space will be used.                                                                                                                                                                                                |                |
| `timeout`               | A timeout value for network operations (in seconds).                                                                                                                                                                                                                                                             |     `600`      |
| `use_delta_compression` | Use delta compression when uploading packages to Octopus Deploy.                                                                                                                                                                                                                                                 |     `true`     |
| `username`              | The username used to authenticate with Octopus Deploy. You must provide `api_key` or `username` and `password`. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                          |                |
