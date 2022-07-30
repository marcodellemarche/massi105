import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

import it from './langs/it';

const format_function = (value, format) =>
{
    if(format === 'lowercase') {
        return value.toLowerCase();
    }

    if(format === 'uppercase') {
        return value.toUpperCase();
    }

    return value;
};

const instance = i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        interpolation: {
            escapeValue: false,
            format: format_function
        },
        resources: {
            it
        },
        fallbackLng: 'it',
        debug: false,
        react: {
            wait: true
        },
    }, (error) =>
    {
        if(error) {
            return error;
        }
    });

export default instance;