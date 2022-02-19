# Syncing with generator-jhipster

JHipster Registry is generated with generator-jhipster.
The following is a base workflow to regenerate JHipster Registry using a new generator-jhipster release.

Update JHipster:

```
npm install generator-jhipster@latest --save-exact
```

Regenerate non-customized files using latest jhipster check changes and commit:

```
jhipster --prefer-local --skip-install
git commit -a -m 'Sync with jhipster@vX.X.X'
```

Regenerate customized files and check for required changes (eg: package.json, pom.xml):

```
jhipster --prefer-local --skip-yo-resolve --skip-install
```

Manually commit required changes and then cleanup changes:

```
git add selected_files
git diff --cached
git commit -m 'Manual sync with jhipster@vX.X.X'
git reset --hard
git clean -fd
```

Regenerate dependencies:

```
rm -rf node_modules package-lock.json target
./npmw install
git add package-lock.json
git commit -m "Regenerate dependencies"
```
