# push-package-action

<img alt= "" src="https://github.com/OctopusDeploy/push-package-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to push a package to [Octopus Deploy](https://octopus.com/).

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v3

  - name: Push a package to Octopus Deploy 🐙
    uses: OctopusDeploy/push-package-action@v2
    env:
      OCTOPUS_URL: ${{ secrets.SERVER }}
      OCTOPUS_API_KEY: ${{ secrets.API_KEY }}
      OCTOPUS_SPACE: 'Default'
    with:
      packages: |
        package1.tar.gz
        package2.zip
        packages/**/*.zip
```

## 📥 Environment Variables

| Name              | Description                                                                                                                                          |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_URL`     | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret. |
| `OCTOPUS_API_KEY` | The API key used to access Octopus Deploy. It is strongly recommended that this value retrieved from a GitHub secret.                                |
| `OCTOPUS_SPACE`   | The Name of a space within which this command will be executed.                                                                                      |

## 📥 Inputs

| Name             | Description                                                                                                                                                                                                  |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages`       | **Required.** A multi-line and/or comma-delimited list of packages to push to Octopus Deploy (i.e. package1,package2).                                                                                       |
| `overwrite_mode` | Determines the action to perform with package if it already exists in the repository. Valid input values are `FailIfExists` (default), `OverwriteExisting`, and `IgnoreIfExists`.                            |
| `server`         | The instance URL hosting Octopus Deploy (i.e. "https://octopus.example.com/"). The instance URL is required, but you may also use the OCTOPUS_URL environment variable.                                      |
| `api_key`        | The API key used to access Octopus Deploy. An API key is required, but you may also use the OCTOPUS_API_KEY environment variable. It is strongly recommended that this value retrieved from a GitHub secret. |
| `space`          | The name of a space within which this command will be executed. The space name is required, but you may also use the OCTOPUS_SPACE environment variable.                                                     |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](CONTRIBUTING.md) for information about how to get involved in this project.
