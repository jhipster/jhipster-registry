# Synching with generator-jhipster

JHipster Registry is generated with generator-jhipster.
The following is a base workflow to regenerate JHisper Registry using a new generator-jhipster release.

Update JHipster:

```
npm install generator-jhipster@latest
```

Regenerate non-customized files using latest jhipster:

```
jhipster --prefer-local --skip-install
```

Regenerate customized files and check for required changes (eg: package.json, pom.xml):

```
jhipster --prefer-local --skip-yo-resolve --skip-install
```

Manually commit required change and then cleanup changes:

```
git reset --hard
git clean -fd
```

Regenerate dependencies:

```
rm -rf node_modules package-lock.json
./npmw install
git add package-lock.json
git commit -m "Regenerate dependencies"
```
