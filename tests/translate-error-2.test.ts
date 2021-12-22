import { Equals, IsOptional, validate } from 'class-validator';

import { translateErrors } from '../src/translate-errors';
import { Locale } from '../src/contracts/enums/locales.enum';
import { Messages } from '../src/contracts/types/messages.type';

const sampleMessages: Messages = {
    [Locale.en]: {
        title1_should_be_sample: 'sample is good',
        title2_should_be_sample: 'sample is very good',
    },
    [Locale.fa]: {
        title1_should_be_sample: 'تست خوبه',
        title2_should_be_sample: 'تست خیلی خوبه',
    },
};

class TestClassValidator {
    @IsOptional()
    @Equals('sample', { message: 'title1_should_be_sample' })
    title1: string = 'bad_value';

    @IsOptional()
    @Equals('sample', { message: 'title2_should_be_sample' })
    title2: string = 'bad_value';
}

const testClassValidator = new TestClassValidator();

test('tranlation should be done for persian for two errors', async () => {
    const errors = await validate(testClassValidator);
    const translatedErrors = translateErrors(
        errors,
        sampleMessages,
        Locale.fa,
    );

    expect(translatedErrors[0].constraints!).toBe(
        sampleMessages.fa!.title1_should_be_sample,
    );
    expect(translatedErrors[1].constraints!).toBe(
        sampleMessages.fa!.title2_should_be_sample,
    );
});
