import { join } from 'path';

import { ClassValidatorTranslatorMiddleware } from '../src/class-validator-translator-middleware';
import { IncompatibleErrorCodeAndErrorMessage } from '../src/contracts/errors/incompatible-error-code-and-error-message.error';

describe('class-validator-translator-middleware', () => {
    test('While creating a new instance it should throw an error', async () => {
        expect(throwErrorWhileCreatingNewInstance).toThrowError(
            IncompatibleErrorCodeAndErrorMessage,
        );
    });
});

function throwErrorWhileCreatingNewInstance() {
    const messagesPath = join(__dirname, 'buggy-translated-errors');
    new ClassValidatorTranslatorMiddleware(messagesPath);
}
