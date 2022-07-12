# push-package-action

<img alt= "" src="https://github.com/OctopusDeploy/push-package-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to pushes a package to [Octopus Deploy](https://octopus.com/). It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v3
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1
    with:
      version: latest
  - name: Push a package to Octopus Deploy 🐙
    uses: OctopusDeploy/push-package-action@v1
    env:
      OCTOPUS_API_KEY: ${{ secrets.API_KEY }}
      OCTOPUS_HOST: ${{ secrects.SERVER }}
      OCTOPUS_SPACE: 'Spaces-1'
    with:
      packages: |
        package1.tar.gz
        package2.zip
```

## 📥 Environment Variables

| Name                    | Description                                                                                                                                                                                                                                                                                                      |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_API_KEY`               | The API key used to access Octopus Deploy. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret.                                                |
| `OCTOPUS_HOST`                | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                                                                                |
| `OCTOPUS_PROXY`                 | The URL of a proxy to use (i.e. `https://proxy.example.com`). If `OCTOPUS_PROXY_USERNAME` and `OCTOPUS_PROXY_PASSWORD` are omitted, the default credentials are used. It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                                                                                                                                                                           |
| `OCTOPUS_PROXY_PASSWORD`        | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                        |
| `OCTOPUS_PROXY_USERNAME`        | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                                                                                 |
| `OCTOPUS_SPACE`                 | The ID of a space within which this command will be executed. If omitted, the default space will be used.                                                                                                                                                                                                |


## 📥 Inputs

The following inputs are required:

| Name                    | Description                                                                                                                                                                                                                                                                                                      |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages`              | A multi-line and/or comma-delimited list of packages to push to Octopus Deploy (i.e. package1,package2).                                                                                                                                                                                                         |

The following inputs are optional:

| Name                    | Description                                                                                                                                                                                                                                                                                                      |    Default     |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| `api_key`               | The API key used to access Octopus Deploy. `API-GUEST` may be used if the guest account is enabled. It is recommended to specify this value in the `OCTOPUS_API_KEY` environment variable.                                                |                |
| `debug`                 | Enable debug logging.                                                                                                                                                                                                                                                                                            |    `false`     |
| `ignore_ssl_errors`     | Ignore certificate errors when communicating with Octopus Deploy. Warning: enabling this option creates a security vulnerability.                                                                                                                                                                                |    `false`     |
| `log_level`             | The log level; valid options are `verbose`, `debug`, `information`, `warning`, `error`, and `fatal`.                                                                                                                                                                                                             |    `debug`     |
| `overwrite_mode`        | Determines the action to perform with package if it already exists in the repository. Valid input values are `FailIfExists`, `OverwriteExisting`, and `IgnoreIfExists`.                                                                                                                                          | `FailIfExists` |
| `proxy`                 | The URL of a proxy to use (i.e. `https://proxy.example.com`).  It is recommended to specify this value in the `OCTOPUS_PROXY` environment variable.                                                                                                                                                                                                                                                  |                |
| `proxy_password`        | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. If `proxy_username` and `proxy_password` are omitted and `proxy` is specified, the default credentials are used. It is recommended to specify this value in the `OCTOPUS_PROXY_PASSWORD` environment variable.                                                                              |                |
| `proxy_username`        | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. It is recommended to specify this value in the `OCTOPUS_PROXY_USERNAME` environment variable.                                                                                                                                                                                               |                |
| `server`                | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is recommended to retrieve this value from an environment variable. It is recommended to specify this value in the `OCTOPUS_HOST` environment variable.                                                                                                                                                                |                |
| `space`                 | The name or ID of a space within which this command will be executed. It is recommended to specify this value in the `OCTOPUS_SPACE` environment variable.                                                                                                                                                                                               |                |
| `timeout`               | A timeout value for network operations (in seconds).                                                                                                                                                                                                                                                             |     `600`      |
| `use_delta_compression` | Use delta compression when uploading packages to Octopus Deploy.                                                                                                                                                                                                                                                 |     `true`     |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](CONTRIBUTING.md) for information about how to get involved in this project.
