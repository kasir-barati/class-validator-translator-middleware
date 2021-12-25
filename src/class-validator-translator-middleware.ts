import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import { Locale } from './contracts/enums/locales.enum';
import { Messages } from './contracts/types/messages.type';
import { translateErrors } from './translate-errors';

export class ClassValidatorTranslatorMiddleware {
    #messages: Messages;
    #targetLocale: Locale;

    constructor(messages: Messages, targetLocale: Locale) {
        this.#messages = messages;
        this.#targetLocale = targetLocale;
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

            error.errors = await translateErrors(
                error.errors,
                this.#messages,
                this.#targetLocale,
            );
            next(error);
        } else {
            next(error);
        }
    }
}
