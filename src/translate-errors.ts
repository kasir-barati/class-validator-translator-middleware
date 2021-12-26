import { ValidationError } from 'class-validator';
import _ from 'lodash';
import translate from '@vitalets/google-translate-api';

import { Locale } from './contracts/enums/locales.enum';

export async function translateErrors(
    errors: ValidationError[],
    messages: { [x: string]: string },
    targetLocale: Locale,
): Promise<ValidationError[]> | never {
    if (Object.keys(messages).length === 0) {
        throw new Error('passed messages is an empty object');
    }

    const tempErrors = _.cloneDeep(errors);

    for (const error of tempErrors) {
        if (
            error instanceof ValidationError &&
            typeof error.constraints !== undefined &&
            typeof error.constraints !== null &&
            _.isObject(error.constraints)
        ) {
            if (
                !(
                    `${Object.values(error.constraints!)[0]}` in
                    messages
                )
            ) {
                try {
                    const translatedMessage = await translate(
                        Object.values(error.constraints!)[0],
                        {
                            to: targetLocale,
                        },
                    );
                    _.update(
                        error,
                        'constraints',
                        (value) => translatedMessage.text,
                    );
                } catch (error) {
                    console.dir(error, { depth: null });
                } finally {
                    continue;
                }
            } else {
                _.update(
                    error,
                    'constraints',
                    (value) =>
                        messages[
                            Object.values(error.constraints!)[0]
                        ],
                );
            }
        }
    }

    return tempErrors;
}
