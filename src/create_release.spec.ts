/* eslint-disable @typescript-eslint/no-explicit-any */

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

import { createRelease } from './create_release'

jest.mock('fs', () => ({
  readFile: jest.fn((path: any, options: any, callback: (err: any, data: string) => void) => {
    callback(null, `this is the file content from ${path}`)
  }),
}))

describe('create_release', () => {
  let github: any
  let createReleaseMock: jest.Mock

  beforeEach(() => {
    createReleaseMock = jest.fn().mockResolvedValue({ data: { id: 1, html_url: 'html url', upload_url: 'upload url' } })
    github = {
      rest: {
        repos: {
          createRelease: createReleaseMock,
        },
      },
    }
  })

  it('should return outputs', async () => {
    const result = await createRelease(github, 'owner', 'repo', 'tagName', false, 'This is the body')
    expect(result).toStrictEqual({ id: 1, htmlUrl: 'html url', uploadUrl: 'upload url' })
  })

  it('should call function with correct parameters', async () => {
    await createRelease(github, 'owner', 'repo', 'tagName', true, undefined, 'bodyFile.txt')
    expect(createReleaseMock).toBeCalledWith({
      body: 'this is the file content from bodyFile.txt',
      draft: false,
      name: 'tagName',
      owner: 'owner',
      repo: 'repo',
      tag_name: 'tagName',
    })
  })

  it('should prefer file content over body', async () => {
    await createRelease(github, 'owner', 'repo', 'tagName', true, 'this is the body', 'body_file.md')
    expect(createReleaseMock).toBeCalledWith({
      body: 'this is the file content from body_file.md',
      draft: false,
      name: 'tagName',
      owner: 'owner',
      repo: 'repo',
      tag_name: 'tagName',
    })
  })
})
