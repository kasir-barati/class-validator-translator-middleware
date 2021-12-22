# class-validator-translator-middleware

You can simply install it and then use it.

## How to use this package

`npm i class-validator-translator-middleware`

then

```ts
import {
    translateErrors,
    Locale,
    Messages,
    ClassValidatorTranslatorMiddleware,
} from 'class-validator-translator-middleware';

const sampleMessages: Messages = {
    [Locale.en]: {
        title_should_be_sample: 'sample is good',
    },
    [Locale.fa]: {
        title_should_be_sample: 'تست خوبه',
    },
};
const classValidatorTranslatorMiddleware =
    new ClassValidatorTranslatorMiddleware(sampleMessages, Locale.fa);

app.use(classValidatorTranslatorMiddleware.middleware);

// this can be your class validator
class TestClassValidator {
    @IsOptional()
    @Equals('sample', { message: 'title_should_be_sample' })
    title: string = 'bad_value';
}

app.use((error, req, res, next) => {
    for (const error of errors) {
        console.log(error.constraints); // تست خوبه
    }
});
```

### Note:

-   I had no time to add all the languages in the Locale
-   Please use it with Typescript to prevent any unexpected behaviours
-   Feel free to create issue or pull request
