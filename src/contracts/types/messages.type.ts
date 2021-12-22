import { Locale } from '../enums/locales.enum';

export type Messages = {
    [x in Locale]?: { [x: string]: string };
};
