import React from 'react';
import cls from 'classnames';

import BaseComponent, { BaseProps } from '../_base/baseComponent';
import { strings, cssClasses } from '@douyinfe/semi-foundation/datePicker/constants';
import InlineInputFoundation, { Type, DateInlineInputAdapter, DateInlineInputFoundationProps } from '@douyinfe/semi-foundation/datePicker/inlineInputFoundation';
import Input from '../input/index';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';

const prefixCls = cssClasses.PREFIX;

interface DateInlineInputProps extends DateInlineInputFoundationProps, BaseProps {
    
}

export default class DateInlineInput extends BaseComponent<DateInlineInputProps>  {
    foundation: InlineInputFoundation;
    
    constructor(props: DateInlineInputProps) {
        super(props);
        this.foundation = new InlineInputFoundation(this.adapter);
    }

    get adapter(): DateInlineInputAdapter {
        return ({
            ...super.adapter,
            notifyDateFocus: () => {
                this.props.onDateFocus();
            },
            notifyTimeFocus: () => {
                this.props.onTimeFocus();
            }
        });
    }

    render() {
        const { type, onDateFocus, onTimeFocus, value, inputValue } = this.props;

        const _isRangeType = type.includes('Range');
        const inlineInputValue = this.foundation.getInlineInputValue({ value, inputValue });

        const inlineInputWrapperCls = cls({
            [`${prefixCls}-inline-input-wrapper`]: true,
        });
    
        return (
            <div className={inlineInputWrapperCls} x-type={type}>
                <InlineDateInput onDateFocus={onDateFocus} value={inlineInputValue.monthLeft.dateInput} />
                <InlineTimeInput type={type} onTimeFocus={onTimeFocus} value={inlineInputValue.monthLeft.timeInput} />
                {
                    _isRangeType && (
                        <>
                            <InlineInputSeparator />
                            <InlineDateInput onDateFocus={onDateFocus} value={inlineInputValue.monthRight.dateInput} />
                            <InlineTimeInput type={type} onTimeFocus={onTimeFocus} value={inlineInputValue.monthRight.timeInput} />
                        </>
                    )
                }
            </div>
        );
    }
}

function InlineDateInput({ onDateFocus, value }) {
    return (
        <Input onFocus={onDateFocus} placeholder={strings.FORMAT_FULL_DATE} value={value} />
    );
}

function InlineTimeInput({ type, onTimeFocus, value }) {
    const _isTimeType = type.includes('Time');
    return _isTimeType ? <Input onFocus={onTimeFocus} placeholder={strings.FORMAT_TIME_PICKER} value={value} /> : null;
}

function InlineInputSeparator() {
    const separatorCls = `${prefixCls}-inline-input-separator`;
    return <div className={separatorCls}>-</div>;
}