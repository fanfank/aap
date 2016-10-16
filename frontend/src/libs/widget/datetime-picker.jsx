/**
 * @author  xuruiqi
 * @desc    这个文件是为了解决antd@1.1.0时间日期控件而加的
 *          代码是我根据需求从其它地方copy过来后改的，如果
 *          不是为了修改代码，这个文件没有看的必要
 *
 * @note    使用的库版本如下：
 *          "moment": "2.14.1",
 *          "rc-calendar": "7.0.0",
 *          "rc-time-picker": "2.0.0",
 */

import 'rc-calendar/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';

let localeType = "zh-cn"
let utcOffset = 8;
const now = moment();
now.locale(localeType).utcOffset(utcOffset);

function getFormat(time) {
    time = time || true;
    return time ? format : 'YYYY-MM-DD';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel />;

export let DatetimePicker = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.object,
    defaultCalendarValue: React.PropTypes.object,
  },

  toMoment: function(v) {
    if (v && v.constructor === String) {
        v = new Date(v);
    }
    if (v && v.constructor === Date) {
        v = moment(v);
    }
    if (v) {
        v.locale(localeType).utcOffset(utcOffset);
    }
    return v;
  },

  getInitialState: function() {
    return {
      showTime: true,
      showDateInput: true,
      disabled: false,
      value: this.toMoment(this.props.value || this.props.defaultValue),
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value) {
        this.setState({
            value: this.toMoment(nextProps.value),
        });
    }
  },

  onChange(value) {
    let fv = null;
    if (value) {
        fv = value.format(getFormat(this.state.showTime));
    }
    console.log('DatePicker change: ', (value && fv));
    if (this.props.onChange) {
        this.props.onChange(fv);
    }

    if (this.props.value) {
        value = this.toMoment(this.props.value);
    }
    this.setState({
        value: value,
    });
  },

  render() {
    const state = this.state;
    const calendar = (<Calendar
      locale={ localeType === "en-gb" ? enUS : zhCN }
      style={{ zIndex: 1000 }}
      dateInputPlaceholder="可随意修改"
      formatter={getFormat(state.showTime)}
      disabledTime={null}
      timePicker={state.showTime ? timePickerElement : null}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput}
      disabledDate={null}
    />);
    return (<div style={{ width: 400 }}>
      <div style={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
        lineHeight: 1.5,
        marginBottom: 22,
      }}
      >
        <DatePicker
          animation="slide-up"
          disabled={state.disabled}
          calendar={calendar}
          value={state.value}
          onChange={this.onChange}
        >
          {
            ({ value }) => {
              return (
                <span tabIndex="0">
                <input
                  placeholder="请选择时间"
                  style={{ width: 250 }}
                  disabled={state.disabled}
                  readOnly
                  tabIndex="-1"
                  className="ant-calendar-picker-input ant-input"
                  value={value && value.format(getFormat(state.showTime)) || ''}
                />
                </span>
              );
            }
          }
        </DatePicker>
      </div>
    </div>);
  },
});
