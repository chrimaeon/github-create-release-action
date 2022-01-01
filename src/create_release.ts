/*
 * Copyright (c) 2022. Christian Grach <christian.grach@cmgapps.com>
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

import { promisify } from 'util'
import { readFile } from 'fs'
import { Outputs } from './main'
import { GitHub } from '@actions/github/lib/utils'

const readFileAsync = promisify(readFile)

export async function createRelease(
  github: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  tagName: string,
  publish: boolean,
  body?: string,
  bodyFile?: string,
): Promise<Outputs> {
  let bodyFileContent: string | null = null
  if (bodyFile) {
    bodyFileContent = await readFileAsync(bodyFile, { encoding: 'utf-8' })
  }

  const {
    data: { id: id, html_url: htmlUrl, upload_url: uploadUrl },
  } = await github.rest.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    name: tagName,
    body: bodyFileContent || body,
    draft: !publish,
  })

  return {
    id,
    htmlUrl,
    uploadUrl,
  }
}
