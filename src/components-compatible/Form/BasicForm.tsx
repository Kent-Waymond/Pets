import React, { useEffect, useContext } from 'react';
import { Form, Spin } from 'antd';
import { FormProps, FormItemProps } from 'antd/lib/form';
import { ValidateMessages } from 'rc-field-form/lib/interface';
import FormItem from 'antd/lib/form/FormItem';
import { defineMessages, useIntl } from 'react-intl';

export interface IBasicFormProps extends FormProps {
  loading?: boolean;
  formItemStyle?: React.CSSProperties;
}
export interface IBasicFormItemProps extends FormItemProps {}

interface BasicFormItemContextContent {
  style?: React.CSSProperties;
}

const intlMessages = defineMessages({
  requiredField: {
    id: 'common.requiredField',
    defaultMessage: '这是一个必填字段',
  },
});

export const BasicFormItemContext = React.createContext<BasicFormItemContextContent>(
  {},
);

export function BasicForm(props: IBasicFormProps) {
  const { loading, formItemStyle, ...restProps } = props;
  const intl = useIntl();
  const defaultValidateMessages: ValidateMessages = {
    required: intl.formatMessage(intlMessages.requiredField),
  };
  return (
    <BasicFormItemContext.Provider value={{ style: formItemStyle }}>
      <Spin spinning={loading != undefined ? loading : false}>
        <Form validateMessages={defaultValidateMessages} {...restProps} />
      </Spin>
    </BasicFormItemContext.Provider>
  );
}

export function BasicFormItem(props: IBasicFormItemProps) {
  const FormItemContext = useContext(BasicFormItemContext);
  const itemStyles = FormItemContext?.style ? FormItemContext.style : {};
  return (
    <FormItem
      {...props}
      style={{
        ...itemStyles,
        ...props.style,
      }}
    />
  );
}
