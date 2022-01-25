import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import {
    Equals,
    IsOptional,
    validate,
    ValidationError,
} from 'class-validator';

import { ClassValidatorTranslatorMiddleware } from '../src/class-validator-translator-middleware';
import { SpecifiedErrorMessageFileNotFound } from '../src';

const messagesPath = join(__dirname, 'translated-errors');
const classValidatorTranslatorMiddleware =
    new ClassValidatorTranslatorMiddleware(messagesPath);

class TestClassValidator {
    @IsOptional()
    @Equals('sample', { message: 'title_should_be_sample' })
    title: string = 'bad_value';

    @IsOptional()
    @Equals('sample', { message: 'title2_should_be_sample' })
    title2: string = 'bad_value';
}
interface ThrownValidationError {
    errors: ValidationError[];
    status?: number;
    statusCode?: number;
}

const testClassValidator = new TestClassValidator();

describe('class-validator-translator-middleware test #3', () => {
    const unSupportedLanguage = 'tr';
    let mockRequest: Request;
    let mockResponse: Response;
    let mockError: ThrownValidationError;
    let nextFunction: NextFunction = jest.fn();

    beforeEach((done) => {
        mockRequest = {
            headers: {
                'accept-language': unSupportedLanguage,
            },
        } as Request;
        mockResponse = {} as Response;
        validate(testClassValidator).then((errors) => {
            mockError = {
                errors,
            };
            done();
        });
    });

    test('Middleware should call next with a new error', async () => {
        await classValidatorTranslatorMiddleware.middleware(
            mockError,
            mockRequest,
            mockResponse,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalledWith(
            new SpecifiedErrorMessageFileNotFound(
                unSupportedLanguage,
            ),
        );
    });
});
