import { Equals, IsOptional, validate } from 'class-validator';

import { translateErrors } from '../src/translate-errors';
import { Locale } from '../src/contracts/enums/locales.enum';
import { Messages } from '../src/contracts/types/messages.type';

const sampleMessages: Messages = {
    [Locale.en]: {
        title_should_be_sample: 'sample is good',
    },
    [Locale.fa]: {
        title_should_be_sample: 'تست خوبه',
    },
};

class TestClassValidator {
    @IsOptional()
    @Equals('sample', { message: 'title_should_be_sample' })
    title: string = 'bad_value';
}

const testClassValidator = new TestClassValidator();

test('tranlation should be done for persian for one error', async () => {
    const errors = await validate(testClassValidator);
    const translatedErrors = translateErrors(
        errors,
        sampleMessages,
        Locale.fa,
    );

    expect(translatedErrors[0].constraints!).toBe(
        sampleMessages.fa!.title_should_be_sample,
    );
});
