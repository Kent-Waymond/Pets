import React from 'react';
import { FormattedMessage } from 'umi';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { Input, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { InstanceNetworkNodeList } from './InstanceNetworkNodeList';
import { PlatformNetworkList } from './PlatformNetworkList';
import { EnumNetworkTypes } from '@/variable';
import { RegexIPv4 } from '@/utils/regex';

interface InstanceBasicNetworkConfFormProps {}

export function InstanceBasicNetworkConfForm(
  props: InstanceBasicNetworkConfFormProps,
) {
  return (
    <>
      <BasicFormItem
        label={
          <FormattedMessage
            id="instance.table.NetworkList"
            defaultMessage="网络"
          />
        }
        name="networkDriver"
        required={true}
        rules={[
          {
            required: true,
          },
        ]}
        style={{ width: 200 }}
      >
        <PlatformNetworkList
          placeholder={
            <FormattedMessage
              id="instance.placeholder.networkDriverSelect"
              defaultMessage="请选择网络"
            />
          }
        />
      </BasicFormItem>
      <BasicFormItem noStyle={true} dependencies={['networkDriver']}>
        {(form: FormInstance) => {
          const { getFieldValue } = form;
          const networkDriver = getFieldValue('networkDriver');
          const [networkType = '', networkId = ''] = networkDriver
            ? networkDriver.split('$')
            : '';
          // let networkRender = null;
          // if (networkType == EnumNetworkTypes.macvlan || networkType == EnumNetworkTypes.ipvlan) {
          //   networkRender = (
          //     <>
          //       <BasicFormItem
          //         label={<FormattedMessage id="instance.table.NetworkIp" defaultMessage="网络IP" />}
          //         name="ip"
          //         initialValue=""
          //         required={true}
          //         rules={[
          //           {
          //             pattern: RegexIPv4,
          //             message: <FormattedMessage id="instance.form.IPMsg" defaultMessage="请输入格式正确的IPv4地址" />,
          //           },
          //         ]}
          //       >
          //         <Input />
          //       </BasicFormItem>
          //     </>
          //   );
          // } else {
          //   networkRender = null;
          // }

          return (
            <>
              {/* {networkRender} */}
              <BasicFormItem
                label={
                  <FormattedMessage
                    id="instance.table.NodeList"
                    defaultMessage="节点"
                  />
                }
                name="nodeId"
                required={true}
                initialValue="auto"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InstanceNetworkNodeList
                  disabled={!networkId}
                  networkId={networkId}
                  formInstance={form}
                  placeholder={
                    <FormattedMessage
                      id="instance.placeholder.nodeIdSelect"
                      defaultMessage="请选择节点"
                    />
                  }
                />
              </BasicFormItem>
            </>
          );
        }}
      </BasicFormItem>

      <BasicFormItem name="autoNodeId" initialValue="" hidden={true}>
        <Input />
      </BasicFormItem>
    </>
  );
}
