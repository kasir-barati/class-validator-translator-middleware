# class-validator-translator-middleware

You can simply install it and then use it.

## How to use this package

-   first install it `npm i class-validator-translator-middleware`
-   Examples:
    -   Here is one example in ExpressJS:

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

    -   Here is one example in routing controller

```ts
// messages.ts

import {
    Locale,
    Messages,
} from 'class-validator-translator-middleware';

export const classValidatorMessages: Messages = {
    [Locale.en]: {
        serviced_should_be_boolean_not_empty:
            'serviced should be boolean, not empty string',
    },
    [Locale.fa]: {
        serviced_should_be_boolean_not_empty:
            'لطفا فیلتر شهر های تحت پوشش را خالی وارد نکنید',
    },
};

// city-filter.ts
import {
    IsBoolean,
    IsAlpha,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CityFilterQuery {
    @IsOptional()
    @IsAlpha('en', {
        message: 'serviced_should_be_boolean_not_empty',
    })
    @IsBoolean({ message: 'serviced_should_be_boolean' })
    serviced?: boolean;
}

// class-validator-error-translator.middleware.ts
import { ValidationError } from 'class-validator';
import {
    Middleware,
    ExpressErrorMiddlewareInterface,
    HttpError,
} from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import {
    ClassValidatorTranslatorMiddleware,
    Locale,
} from 'class-validator-translator-middleware';

import { classValidatorMessages } from '../contracts/models/class-validator-messages.mode';

const classValidatorTranslatorMiddleware =
    new ClassValidatorTranslatorMiddleware(
        classValidatorMessages,
        Locale.fa,
    );

class CustomValidationError {
    errors: ValidationError[];
    status?: number;
    statusCode?: number;
}

@Middleware({ type: 'after' })
export class ClassValidatorErrorTranslator
    implements ExpressErrorMiddlewareInterface
{
    error(
        error: HttpError | CustomValidationError,
        request: Request,
        response: Response,
        next: NextFunction,
    ): void {
        classValidatorTranslatorMiddleware.middleware(
            error,
            request,
            response,
            next,
        );
    }
}

// app.ts
import { ClassValidatorErrorTranslator } from './middlewares/class-validator-error-translator.middleware';
import express from 'express';

const app = express();

const routingControllersOptions: RoutingControllersOptions = {
    controllers: [
        /* controllers */
    ],
    middlewares: [ClassValidatorErrorTranslator],
    /* other configs */
    validation: {
        whitelist: true,
    },
};
useExpressServer(app, routingControllersOptions);
```

### Notes

-   I had no time to add all the languages in the Locale
-   Please use it with Typescript to prevent any unexpected behaviours
-   Feel free to create issue or pull request

## Contribution

-   Write you code
-   Write its tests in tests directory
-   run `npm test` and make sure it works perfectly
