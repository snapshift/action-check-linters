import { LinterType } from "./main"

export function parseOutput(type: LinterType, output: string): ErrorParsed[] {
    const matcher = matchers.find(item => item.type === type)
    const lines = output.split('\n').map(line => line.trim()).filter(line => !!line)
    const errorsParsed = lines.map(line => parseErrorLine(line, matcher!))
    return errorsParsed
}

interface Matcher {
    type: LinterType
    regexp: string
    parts: {
        name: string
        position: number
    }[]
}

export interface ErrorParsed {
    file: string
    line: string
    column: string
    severity: string
    code: string
    message: string
}

export const matchers: Matcher[] = [{
    type: LinterType.TSC,
    regexp: "^([^\\s].*)[\\(:](\\d+)[,:](\\d+)(?:\\):\\s+|\\s+-\\s+)(error|warning|info)\\s+TS(\\d+)\\s*:\\s*(.*)$",
    parts: [{
        name: "file",
        position: 1
    }, {
        name: "line",
        position: 2
    }, {
        name: "column",
        position: 3
    }, {
        name: "severity",
        position: 4
    }, {
        name: "code",
        position: 5
    }, {
        name: "message",
        position: 6
    }]
}, {
    type: LinterType.ESLINT
}]

export function parseErrorLine(str: string, matcher: Matcher): ErrorParsed {

    let arr: string[] = []
    try {
        arr = str.match(matcher.regexp) || []
    } catch (error) {
        console.error('erreur match string')
        throw error
    }
    const result: { [k: string]: string } = {}
    arr.forEach((hash, index) => {
        const matcherHash = matcher.parts.find(part => part.position === index)
        if (matcherHash) {
            result[matcherHash.name] = hash
        }
    })

    return result as unknown as ErrorParsed

}