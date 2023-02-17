# Building for testing

To test a branch in GitHub Actions, an updated `dist/index.js` file is required.

```
npm run build
git add dist/.
git commit -m "updating index.js"
git log -q -n 1 dist/index.js | less -F
```

From the log output take note of the commit hash and push to GitHub

In a test GitHub action you can use the branched build of the action by referencing the branch or commit hash, see [here](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses) for details on the `uses` syntax.

```yml
steps:
  - uses: actions/checkout@v3

  - name: Push a package to Octopus Deploy 🐙
    uses: OctopusDeploy/push-package-action@my-branch
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
