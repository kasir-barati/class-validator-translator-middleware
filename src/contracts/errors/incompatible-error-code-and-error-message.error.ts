export class IncompatibleErrorCodeAndErrorMessage extends Error {
    constructor({
        errorCodesPath,
        errorCode,
        path,
    }: {
        errorCodesPath: string;
        errorCode: string;
        path: string;
    }) {
        super();
        this.message = `Defined error codes in this file ${errorCodesPath} has not this error code ${errorCode}, But it is in this locale error message ${path}`;
        this.name = 'INCOMPATIBLE_ERROR_CODE_AND_ERROR_MESSAGE';
    }
}
