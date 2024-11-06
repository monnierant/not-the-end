# MySyst - Foundry VTT System

## Purpose

This template is here to help you bootstrap quickly a foundry vtt system compatible foundry v12 using `typescript`.

It works thanks to [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-type)

## Install

## Usage

Go to `system.json`and edit the system `id`

Replace all ref to `MySyst` by your system name

## CI

You must create a secret in github action `GH_TOKEN` with a personal access token so `semantic-release` will be able to clone your code and make release

- contents: write to be able to publish a GitHub release
- issues: write to be able to comment on released issues
- pull-requests: write to be able to comment on released pull requests

You must create a secret in github action `FVTT_PUBLISH_TOKEN`with the `package Release Token`from foundry.

(cf [@semantic-release/github](https://github.com/semantic-release/github))

### Manual Deploy your system

[Latest Release](https://github.com/<group-user>/<repo>/releases/latest/download/system.json)
