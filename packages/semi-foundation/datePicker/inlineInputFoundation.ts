import { Locale } from 'date-fns';

import isNullOrUndefined from '../utils/isNullOrUndefined';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { strings } from './constants';
import {formatDateValues } from './_utils/formatter';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';

export default class InlineInputFoundation extends BaseFoundation<DateInlineInputAdapter> {
    constructor(adapter: DateInlineInputAdapter) {
        super({ ...adapter });
    }

    getInlineInputValue({ value, inputValue } : { value: any; inputValue: string }) {
        const { type, rangeSeparator } = this._adapter.getProps();

        let inputValueAllInOne = '';
        if (!isNullOrUndefined(inputValue)) {
            inputValueAllInOne = inputValue;
        } else {
            inputValueAllInOne = this.formatShowText(value);
        }

        const inlineInputValue = {
            monthLeft: {
                dateInput: '',
                timeInput: '',
            },
            monthRight: {
                dateInput: '',
                timeInput: '',
            }
        };
        let leftDateInput, leftTimeInput, rightDateInput, rightTimeInput;

        switch (type) {
            case 'date':
            case 'month':
                inlineInputValue.monthLeft.dateInput = inputValueAllInOne;
                break;
            case 'dateRange':
                [leftDateInput, rightDateInput] = inputValueAllInOne.split(rangeSeparator);
                inlineInputValue.monthLeft.dateInput = leftDateInput;
                inlineInputValue.monthRight.dateInput = rightDateInput;
                break;
            case 'dateTime':
                [leftDateInput, leftTimeInput] = inputValueAllInOne.split(' ');
                inlineInputValue.monthLeft.dateInput = leftDateInput;
                inlineInputValue.monthLeft.timeInput = leftTimeInput;
                break;
            case 'dateTimeRange':
                [leftDateInput, leftTimeInput, rightDateInput, rightTimeInput] = inputValueAllInOne.split(rangeSeparator).join(' ').split(' ');
                inlineInputValue.monthLeft.dateInput = leftDateInput;
                inlineInputValue.monthLeft.timeInput = leftTimeInput;
                inlineInputValue.monthRight.dateInput = rightDateInput;
                inlineInputValue.monthRight.timeInput = rightTimeInput;
                break;
        }
        return inlineInputValue;
    }

    formatShowText(value: BaseValueType[]) {
        const { type, dateFnsLocale, format, rangeSeparator } = this._adapter.getProps();
        const formatToken = format || getDefaultFormatTokenByType(type);
        let text = '';
        switch (type) {
            case 'date':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'dateTime':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateTimeRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'month':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            default:
                break;
        }
        return text;
    }
}

export type Type = typeof strings.TYPE_SET[number];
export type BaseValueType = string | number | Date;

export interface DateInlineInputFoundationProps {
    type: Type;
    onDateFocus: () => void;
    onTimeFocus: () => void;
    value: Date[];
    inputValue: string;
    format: string;
    rangeSeparator: string;
    dateFnsLocale: Locale;
}

export interface DateInlineInputAdapter extends DefaultAdapter<DateInlineInputFoundationProps> {
    notifyDateFocus: DateInlineInputFoundationProps['onDateFocus'],
    notifyTimeFocus: DateInlineInputFoundationProps['onTimeFocus'],
}