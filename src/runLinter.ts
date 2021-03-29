import { exec, ExecOptions } from '@actions/exec'
import { setFailed } from '@actions/core'
import { LinterType, ConfigFileLinter } from './main'

interface Cfg {
    workingDir: string
    linterConfig: ConfigFileLinter,
    files: string[]
}

export async function runLinter({ linterConfig, files }: Cfg): Promise<{ output: string, error: string }> {


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

    const execArgs = getExecArgsByLinter(linterConfig)

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

function getExecArgsByLinter(config: ConfigFileLinter): string[] {

    if (config.type === LinterType.TSC) {
        return [
            'node_modules/typescript/bin/tsc',
            '--noEmit',
            '--noErrorTruncation',
            '--pretty',
            'false',
            '--incremental',
            'false']

    } else if (config.type === LinterType.ESLINT) {
        return []
    } else {
        throw new Error(`Linter unrecognized : ${config.type}`)
    }
}