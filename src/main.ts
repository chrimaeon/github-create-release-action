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
import { createRelease } from './create_release'

enum ActionInputs {
  TAG_NAME = 'tag_name',
  BODY = 'body',
  BODY_FILE = 'body_file',
  PUBLISH = 'publish',
}

enum ActionOutputs {
  ID = 'id',
  HTML_URL = 'html_url',
  UPLOAD_URL = 'upload_url',
}

export type Outputs = {
  id: number
  htmlUrl: string
  uploadUrl: string
}

async function run(): Promise<void> {
  try {
    const tagName = core.getInput(ActionInputs.TAG_NAME, { required: true }).replace('refs/tags/', '')

    const github = getOctokit(process.env.GITHUB_TOKEN as string)
    const { owner, repo } = context.repo
    const { id, htmlUrl, uploadUrl } = await createRelease(
      github,
      owner,
      repo,
      tagName,
      core.getBooleanInput(ActionInputs.PUBLISH),
      core.getInput(ActionInputs.BODY),
      core.getInput(ActionInputs.BODY_FILE),
    )

    core.setOutput(ActionOutputs.ID, id)
    core.setOutput(ActionOutputs.HTML_URL, htmlUrl)
    core.setOutput(ActionOutputs.UPLOAD_URL, uploadUrl)
  } catch (e) {
    core.setFailed(e as Error)
  }
}

run()
