import { ErrorParsed } from "./parseOutput"

export function filterErrors(errorsParsed: ErrorParsed[], fileNamesString: string): ErrorParsed[] {

    const fileNames = fileNamesString.split(" ")
    return errorsParsed.filter(err => {
        return fileNames.includes(err.file)
    })
}