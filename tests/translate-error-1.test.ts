import { Equals, IsOptional, validate } from 'class-validator';

import { translateErrors } from '../src/translate-errors';
import { Locale } from '../src/contracts/enums/locales.enum';

const persianMessages: { [x: string]: string } = {
    title_should_be_sample: 'تست خوبه',
};

class TestClassValidator {
    @IsOptional()
    @Equals('sample', { message: 'title_should_be_sample' })
    title: string = 'bad_value';
}

const testClassValidator = new TestClassValidator();

test('Translation should be done for persian for one error', async () => {
    const errors = await validate(testClassValidator);
    const translatedErrors = await translateErrors(
        errors,
        persianMessages,
        Locale.fa,
    );

    expect(translatedErrors[0].constraints!).toBe(
        persianMessages.title_should_be_sample,
    );
});
