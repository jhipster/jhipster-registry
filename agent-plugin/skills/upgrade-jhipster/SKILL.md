---
name: upgrade-jhipster
description: Moves the JHipster Registry to a new generator-jhipster version by regenerating on the jhipster_upgrade branch, merging it, and checking that nothing the registry does was lost. Use when asked to upgrade, update, sync, or regenerate the registry with a newer JHipster, Spring Boot, or Angular version.
license: Apache-2.0
compatibility: Needs git, Java 21 or 25, Node.js 24, and Docker. Run it from the root of a clone of jhipster/jhipster-registry.
---

# Upgrade the JHipster Registry to a new JHipster version

The registry is a generated JHipster application with its own code on top. Upgrading means taking what changed in the generator without losing what the registry changed. The commands are in `DEVELOPMENT.md`, which is the source of truth for them. This skill is about the order and about the judgment calls.

The risk in an upgrade is not a build that fails. It is generated code that quietly replaces something the registry relied on, while the build stays green. Three regressions of that kind were only found by running the registry: Eureka answering 403 where clients need a 404, the registry not starting with the default production configuration, and tokens of the previous release being rejected.

## Before you start

1. Work on a clean checkout of `main`, and read the "Syncing with generator-jhipster" and "End-to-end tests" sections of `DEVELOPMENT.md`.
2. Check that the generated output is an ancestor of `main`. `DEVELOPMENT.md` has the command and says what to do when it is not. Without that ancestry, every file the registry changed conflicts.
3. Find the version to move to (`npm view generator-jhipster version`) and read its release notes for changes to security, the client build, and Docker images.

## Steps

1. **Regenerate on `jhipster_upgrade`** with the commands in `DEVELOPMENT.md`. That branch must only ever hold unmodified generator output. Do not fix or format anything there.
2. **Merge it on a new branch from `main`.** Resolve each conflict by keeping both intents: the generator's change and the registry's reason for differing. [references/kept-behavior.md](references/kept-behavior.md) lists the differences that are deliberate and why. Do not resolve a conflict by taking one whole side unless that list says the file is entirely one side's.
3. **Read the merge beyond the conflicts.** A file that merged cleanly can still change behavior. Read the diff of the security configurations, `SpaWebFilter`, `application*.yml`, `bootstrap*.yml`, `logback-spring.xml`, `pom.xml`, `package.json`, the dev-server proxy, the interceptors, and the files in `src/main/docker`. Check each item of `references/kept-behavior.md` against the merged code.
4. **Regenerate the dependencies** as `DEVELOPMENT.md` describes, then run the build: `./mvnw verify` and `./npmw test`.
5. **Run every end-to-end suite** in `DEVELOPMENT.md` against the new build: JWT, OAuth2 with Keycloak, peer replication, the Git and Vault config backends in both Vault modes, and the default production configuration. These are what catch the regressions the build does not.
6. **Run the same suites against the last released image**, `jhipster/jhipster-registry:<previous version>`, and compare. A test that passes on the release and fails on the new build is a regression. A test that fails on both is a test problem or an old bug. Say which in the pull request.
7. **Update what describes the code.** Add files the registry now changes to `.yo-resolve`, and remove ones it no longer changes. Update `references/kept-behavior.md` for every difference you added, removed, or found. Add anything users must do to the README's upgrade section.
8. **Open a pull request** that says what the generator changed, which differences the registry kept, what was tested against which versions, and what was not tested. Ask for it to be merged with a merge commit: squashing drops the ancestry of `jhipster_upgrade`.

## Rules for the judgment calls

- When the generator changes how something behaves for a user or for a registered application, keep the behavior of the last release unless there is a reason to change it, and write the reason down. Record it in `references/kept-behavior.md`.
- A new default that weakens security (an endpoint that becomes public, a check that disappears) is a regression, not a new feature.
- Prefer small, commented edits in generated files, and the registry's own files for everything else. The less the registry touches a generated file, the easier the next upgrade.
- Version bumps of Docker images in `src/main/docker` come from the generator. For images the generator does not ship (Keycloak, Vault), take what a JHipster application generated with the matching options uses, and start them once, since a major version can change how they run.
- Report what you verified and what you did not. "The build passes" does not mean the registry works.

## When something fails

- The registry does not start: read its log first. Missing configuration usually means a property the generated code now requires that the registry gets from its config server.
- An end-to-end test fails only on the new build: find what changed with `git diff jhipster_upgrade...HEAD -- <file>` for the files involved, and compare with the same diff before the upgrade.
- An end-to-end test fails on the released image too: check whether it depends on timing or on state another test left behind before calling it a bug.
