/* eslint-disable max-len */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { BaseValueType, ValidateStatus, ValueType } from './foundation';
import { formatDateValues } from './_utils/formatter';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { cloneDeep, set } from 'lodash';

const KEY_CODE_ENTER = 'Enter';
const KEY_CODE_TAB = 'Tab';


export type Type = 'date' | 'dateRange' | 'year' | 'month' | 'dateTime' | 'dateTimeRange';
export type RangeType = 'rangeStart' | 'rangeEnd';
type PanelType = 'left' | 'right';
export interface InlineInputValue {
    monthLeft: {
        dateInput: string;
        timeInput: string;
    },
    monthRight: {
        dateInput: string;
        timeInput: string;
    }
}
export interface DateInputEventHandlerProps {
    onClick?: (e: any) => void;
    onChange?: (value: string, e: any) => void;
    onEnterPress?: (e: any) => void;
    onBlur?: (e: any) => void;
    onFocus?: (e: any, rangeType: RangeType) => void;
    onClear?: (e: any) => void;
    onRangeInputClear?: (e: any) => void;
    onRangeEndTabPress?: (e: any) => void;
}

export interface DateInputElementProps {
    insetLabel?: any;
    prefix?: any;
}

export interface DateInputFoundationProps extends DateInputElementProps, DateInputEventHandlerProps {
    [x: string]: any;
    value?: ValueType;
    disabled?: boolean;
    type?: Type;
    multiple?: boolean;
    showClear?: boolean;
    format?: string;
    inputStyle?: React.CSSProperties;
    inputReadOnly?: boolean;
    validateStatus?: ValidateStatus;
    prefixCls?: string;
    rangeSeparator?: string;
    panelType?: PanelType;
    inlineInput: boolean;
}

export interface DateInputAdapter extends DefaultAdapter {
    updateIsFocusing: (isFocusing: boolean) => void;
    notifyClick: DateInputFoundationProps['onClick'];
    notifyChange: DateInputFoundationProps['onChange'];
    notifyEnter: DateInputFoundationProps['onEnterPress'];
    notifyBlur: DateInputFoundationProps['onBlur'];
    notifyClear: DateInputFoundationProps['onClear'];
    notifyFocus: DateInputFoundationProps['onFocus'];
    notifyRangeInputClear: DateInputFoundationProps['onRangeInputClear'];
    notifyRangeInputFocus: DateInputFoundationProps['onFocus'];
    notifyTabPress: DateInputFoundationProps['onRangeEndTabPress'];
}

export default class InputFoundation extends BaseFoundation<DateInputAdapter> {
    constructor(adapter: DateInputAdapter) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}

    handleClick(e: any) {
        this._adapter.notifyClick(e);
    }

    handleChange(value: string, e: any) {
        this._adapter.notifyChange(value, e);
    }

    handleInputComplete(e: any) {
        /**
         * onKeyPress, e.key Code gets a value of 0 instead of 13
         * Here key is used to judge the button
         */
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(e.target.value);
        }
    }

    handleInputClear(e: any) {
        this._adapter.notifyClear(e);
    }

    handleRangeInputClear(e: any) {
        // prevent trigger click outside
        this.stopPropagation(e);
        this._adapter.notifyRangeInputClear(e);
    }

    handleRangeInputEnterPress(e: any, rangeInputValue: string) {
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(rangeInputValue);
        }
    }

    handleRangeInputEndKeyPress(e: any) {
        if (e.key === KEY_CODE_TAB) {
            this._adapter.notifyTabPress(e);
        }
    }

    handleRangeInputFocus(e: any, rangeType: RangeType) {
        this._adapter.notifyRangeInputFocus(e, rangeType);
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

    concatInlineInputValue({ inlineInputValue }: { inlineInputValue: InlineInputValue }) {
        const { type, rangeSeparator } = this._adapter.getProps();
        let inputValue = '';

        switch (type) {
            case 'date':
            case 'month':
                inputValue = inlineInputValue.monthLeft.dateInput;
                break;
            case 'dateRange':
                break;
            case 'dateTime':
                break;
            case 'dateTimeRange':
                break;
        }

        return inputValue;
    }

    handleInlineInputChange(options: { value: string, inlineInputValue: InlineInputValue, event: React.ChangeEvent, valuePath: string }) {
        const { type, rangeSeparator } = this._adapter.getProps();
        const { value, valuePath, inlineInputValue, event } = options;
        const newInlineInputValue = set(cloneDeep(inlineInputValue), valuePath, value);
        const newInputValue = this.concatInlineInputValue({ inlineInputValue: newInlineInputValue });

        this.handleChange(newInputValue, event);
    }
}
