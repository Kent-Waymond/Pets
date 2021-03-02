import React from 'react';
import Button from '@/components/button';
import Card from '@/components/card';
import { DatePicker, Form, Input, Select } from 'antd';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { defineMessages, useIntl } from 'react-intl';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { formatMomentToTimestamp } from '@/utils/date';
import { OperationLogSearchForm } from '../type.d';

const { RangePicker } = DatePicker;
const { Option } = Select;
interface OperationLogFormProps {
  form: any;
  HandleSearch: (params: OperationLogSearchForm) => void;
}
const intlMessages = defineMessages({
  OperationDate: {
    id: 'log.form.OperationDate',
    defaultMessage: '日期',
  },
  OperationType: {
    id: 'log.form.OperationType',
    defaultMessage: '操作类型',
  },
  OperationResult: {
    id: 'log.form.OperationResult',
    defaultMessage: '结果',
  },
  Keyword: {
    id: 'log.form.Keyword',
    defaultMessage: '关键字',
  },
  All: {
    id: 'log.form.All',
    defaultMessage: '全部',
  },
  Instance: {
    id: 'log.form.Instance',
    defaultMessage: '实例相关',
  },
  Node: {
    id: 'log.form.Node',
    defaultMessage: '节点相关',
  },
  Config: {
    id: 'log.form.Config',
    defaultMessage: '配置相关',
  },
  Success: {
    id: 'log.form.Success',
    defaultMessage: '成功',
  },
  Fail: {
    id: 'log.form.Fail',
    defaultMessage: '失败',
  },
  SearchTips: {
    id: 'log.form.SearchTips',
    defaultMessage: '输入用户名/操作内容/来源IP',
  },
  SearchButton: {
    id: 'log.form.SearchButton',
    defaultMessage: '搜索',
  },
});

export function OperationLogForm(props: OperationLogFormProps) {
  const { form, HandleSearch } = props;
  const intl = useIntl();

  function onFormSubmit(values: any) {
    let datestrings = ['', ''];
    if (values.date instanceof Array) {
      datestrings = values.date;
    }
    const [startTime = '', endTime = ''] = datestrings;
    HandleSearch({
      startTime: startTime ? formatMomentToTimestamp(startTime as any) : 0,
      endTime: endTime ? formatMomentToTimestamp(endTime as any) : 0,
      actionType: values.actionType ?? '',
      result: Number(values.result) ?? 0,
      keywords: values.keywords ?? '',
    });
  }

  return (
    <>
      <BasicForm
        className="space-md"
        layout="vertical"
        form={form}
        onFinish={onFormSubmit}
      >
        <BasicFormItem
          label={intl.formatMessage(intlMessages.OperationDate)}
          name="date"
          initialValue={[]}
        >
          <RangePicker />
        </BasicFormItem>
        <BasicFormItem
          label={intl.formatMessage(intlMessages.OperationType)}
          name="actionType"
          initialValue=""
        >
          <Select style={{ width: 120 }}>
            <Option value="">{intl.formatMessage(intlMessages.All)}</Option>
            <Option value="instance">
              {intl.formatMessage(intlMessages.Instance)}
            </Option>
            <Option value="node">
              {intl.formatMessage(intlMessages.Node)}
            </Option>
            <Option value="config">
              {intl.formatMessage(intlMessages.Config)}
            </Option>
          </Select>
        </BasicFormItem>
        <BasicFormItem
          label={intl.formatMessage(intlMessages.OperationResult)}
          name="result"
          initialValue=""
        >
          <Select style={{ width: 120 }}>
            <Option value="">{intl.formatMessage(intlMessages.All)}</Option>
            <Option value="1">
              {intl.formatMessage(intlMessages.Success)}
            </Option>
            <Option value="-1">{intl.formatMessage(intlMessages.Fail)}</Option>
          </Select>
        </BasicFormItem>
        <BasicFormItem
          label={intl.formatMessage(intlMessages.Keyword)}
          name="keywords"
          initialValue=""
        >
          <Input
            style={{ width: 210 }}
            placeholder={intl.formatMessage(intlMessages.SearchTips)}
            allowClear
          />
        </BasicFormItem>
        <BasicFormItem label="&nbsp;">
          <Button type="primary">
            {intl.formatMessage(intlMessages.SearchButton)}
          </Button>
        </BasicFormItem>
      </BasicForm>
    </>
  );
}
