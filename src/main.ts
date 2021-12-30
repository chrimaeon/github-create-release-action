/*
 * Copyright (c) 2021. Christian Grach <christian.grach@cmgapps.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { readFile } from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)

enum ActionInputs {
  TAG_NAME = 'tag_name',
  BODY = 'body',
  BODY_FILE = 'body_file',
  DRAFT = 'draft',
}

enum ActionOutputs {
  ID = 'id',
  HTML_URL = 'html_url',
  UPLOAD_URL = 'upload_url',
}

async function run(): Promise<void> {
  try {
    const tag_name = core.getInput(ActionInputs.TAG_NAME, { required: true }).replace('refs/tags/', '')
    const body = core.getInput(ActionInputs.BODY)
    const bodyFile = core.getInput(ActionInputs.BODY_FILE)
    const draft = core.getInput(ActionInputs.DRAFT) === 'true'
    const github = getOctokit(process.env.GITHUB_TOKEN as string).rest
    const { owner, repo } = context.repo

    let bodyFileContent: string | null = null
    if (bodyFile) {
      try {
        bodyFileContent = await readFileAsync(bodyFile, { encoding: 'utf-8' })
      } catch (e) {
        return core.setFailed(e as Error)
      }
    }

    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl },
    } = await github.repos.createRelease({
      owner,
      repo,
      tag_name,
      name: tag_name,
      body: bodyFileContent || body,
      draft,
    })
    core.setOutput(ActionOutputs.ID, releaseId)
    core.setOutput(ActionOutputs.HTML_URL, htmlUrl)
    core.setOutput(ActionOutputs.UPLOAD_URL, uploadUrl)
  } catch (e) {
    core.setFailed(e as Error)
  }
}

run()
