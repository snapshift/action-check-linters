import { exec, ExecOptions } from '@actions/exec'
import * as path from 'path'
import { setFailed } from '@actions/core'
import { LinterType } from './main'

interface Cfg {
  type : LinterType
  workingDir: string
  configPath?: string
  files?: string[]
}

export async function runLinter({ workingDir, configPath, files }: Cfg): Promise<{ output: string, error: string }> {


  let myOutput = ''
  let myError = ''

  const options: ExecOptions = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      myOutput += data.toString()
    },
    stderr: (data: Buffer) => {
      myError += data.toString()
    }
  }

  const execArgs = [
    `${path.join(workingDir, linterPath)}`,
    ...otherExecArgs
  ]

  // si on passe un tableau de filenames, on les sépare par un espace pour les passer au compiler
  if (files) {
    execArgs.push(files.reduce((str, file) => {
      return `${str} ${file}`
    }, ''))
  }

  try {
    await exec('node', execArgs, options)
  } catch (error) {
    setFailed('')
  }

  return {
    output: myOutput,
    error: myError
  }

}

const linterSettings = [{
    type : 'tsc',
    linterPath:'node_modules/typescript/bin/tsc',
    otherExecArgs : ['--noEmit',
    '--noErrorTruncation',
    '--pretty',
    'false',
    '--incremental',
    'false']
}]

function getSettingsByLinter(type:LinterType, config:ConfigFile['lint'])