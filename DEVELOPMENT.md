# Syncing with generator-jhipster

JHipster Registry is generated with generator-jhipster, and then changed: it has its own screens and endpoints, and it changes some of the generated files.

The `jhipster_upgrade` branch holds the unmodified output of JHipster for the configuration in `.yo-rc.json`. To move to a new generator-jhipster release, regenerate on that branch and merge it into `main`. Git then merges what changed in the generator with what the registry changed, and only reports a conflict where both changed the same lines.

Regenerate on the `jhipster_upgrade` branch, where `X.X.X` is the new version:

```
git checkout jhipster_upgrade
git rm -rq .
git checkout HEAD -- .yo-rc.json
npx generator-jhipster@X.X.X --force --skip-install --skip-git
git checkout HEAD -- src/main/resources/config/tls/keystore.p12
git add --all
git commit -m "Generated with JHipster X.X.X"
```

The generator creates a new TLS keystore on every run, which is why the steps above keep the previous one.

Merge it on a branch from `main`, resolve the conflicts, and open a pull request:

```
git checkout -b jhipster-X.X.X main
git merge jhipster_upgrade
```

Then regenerate the dependencies, and run the build and the end-to-end tests described below:

```
rm -rf node_modules package-lock.json target
./npmw install
./mvnw verify
```

This only works while `jhipster_upgrade` is an ancestor of `main`, which is what tells Git which generated version the registry's code is based on. Check it with the following command, which prints nothing when all is well:

```
git merge-base --is-ancestor jhipster_upgrade main || echo "jhipster_upgrade is not an ancestor of main"
```

It stops being an ancestor when a pull request that merged it was squashed or rebased. To record it again without changing any file, run `git merge -s ours jhipster_upgrade` on `main` once the files on `main` are up to date with that generated version.

`.yo-resolve` lists the generated files the registry has changed. It only matters when JHipster runs directly in a checkout of `main`, where it leaves those files alone.
