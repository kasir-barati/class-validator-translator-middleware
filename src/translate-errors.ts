import { ValidationError } from 'class-validator';
import _ from 'lodash';

import { Locale } from './contracts/enums/locales.enum';
import { Messages } from './contracts/types/messages.type';

export function translateErrors(
    errors: ValidationError[],
    messages: Messages,
    targetLocale: Locale,
): ValidationError[] | never {
    if (Object.keys(messages).length === 0) {
        throw new Error('passed messages is an empty object');
    }
    if (!messages[targetLocale]) {
        throw new Error('passed targetLocale is not in messages');
    }

    const tempErrors = _.cloneDeep(errors);

    for (const error of tempErrors) {
        if (
            error instanceof ValidationError &&
            typeof error.constraints !== undefined &&
            typeof error.constraints !== null &&
            _.isObject(error.constraints)
        ) {
            if (!messages[targetLocale]) {
                throw new Error(
                    'passed messages have not specified targetLocale',
                );
            }
            _.update(
                error,
                'constraints',
                (value) =>
                    messages[targetLocale]![
                        Object.values(error.constraints!)[0]
                    ],
            );
        }
    }

    return tempErrors;
}
