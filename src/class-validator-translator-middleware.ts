import { join } from 'path';
import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import { Locale } from './contracts/enums/locales.enum';
import { translateErrors } from './translate-errors';

export class ClassValidatorTranslatorMiddleware {
    #messagesDirectorPath: string;

    constructor(messagesDirectorPath: string) {
        this.#messagesDirectorPath = messagesDirectorPath;
        this.#isErrorMessagesAndErrorCodesEqual();
    }

    async middleware(
        error: any,
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        if ('errors' in error) {
            if (
                error.errors.filter(
                    (error: any) =>
                        !(error instanceof ValidationError),
                ).length > 0
            ) {
                next(error);
            }

            const targetLocale: Locale =
                Locale[req.headers['accept-language'] as Locale] ??
                Locale.en;
            const targetLocalePath = join(
                this.#messagesDirectorPath,
                `${targetLocale}.json`,
            );
            const messages: {
                [x: string]: string;
            } = require(targetLocalePath);

            error.errors = await translateErrors(
                error.errors,
                messages,
                targetLocale,
            );
            next(error);
        } else {
            next(error);
        }
    }

    #isErrorMessagesAndErrorCodesEqual() {
        const errorCodesPath = join(
            this.#messagesDirectorPath,
            'error-codes.json',
        );
        const errorCodes: {
            [x: string]: string;
        } = require(errorCodesPath);

        for (const locale in Locale) {
            try {
                const path = join(
                    this.#messagesDirectorPath,
                    `${locale}.json`,
                );
                const writtenLocale = require(path);

                for (const errorCode in errorCodes) {
                    if (!writtenLocale[errorCode]) {
                        const error = new Error(
                            `Defined error codes in this file ${errorCodesPath} has not this error code ${errorCode}, But it is in this locale error message ${path}`,
                        );
                        error.name =
                            'incompatible_error_code_and_error_message';
                        throw error;
                    }
                }
            } catch (error: any) {
                // To keep this function synchronized and also ignore the undefined locale files
                // I did this trick to just jump on undefined locales
                if (
                    error.name ===
                    'incompatible_error_code_and_error_message'
                ) {
                    throw error;
                }
                continue;
            }
        }
    }
}
