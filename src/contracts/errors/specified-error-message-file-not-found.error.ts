export class SpecifiedErrorMessageFileNotFound extends Error {
    constructor(targetLocale: string) {
        super();
        this.message = `Could not find the responsible file for the ${targetLocale} language`;
        this.name = 'NOT_SUPPORTED_LANGUAGE';
    }
}
