# Github Release Action

This action creates a release from a provided git tag

## Inputs

### `tag_name` **Required**:

The name of the tag. This should come from the webhook payload, `github.GITHUB_REF` when a user pushes a new tag'

### `description`:

The release description (can be markdown)

### `draft`:

`true` to create a draft (unpublished) release, `false` to create a published one. Default: `true`'

## Env

### `GITHUB_TOKEN`:

Provide a environment variable with the access token. Can be `secrets.GITHUB_TOKEN`.

## Outputs

### `id`:

The ID of the created Release

### `html_url`:

The URL users can navigate to in order to view the release

### `upload_url`:

The URL for uploading assets to the release

## Example usage

```yaml
name: Create Github Release

on:
  push:
    tags:
      - '**'

jobs:
  create-github-release:
    runs-on: ubuntu-latest
    steps:
      - name: Create Release
        uses: chrimaeon/github-create-release-action@0.1.0
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          tag_name: ${{ github.ref }}
          description: "this is a sample description"
```