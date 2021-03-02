import React from 'react';
import { FormattedMessage } from 'umi';
import { BasicFormItem } from '@/components-compatible/Form/BasicForm';
import { Input, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface InstanceDataPersistConfFormProps {}

export function InstanceDataPersistConfForm(
  props: InstanceDataPersistConfFormProps,
) {
  return (
    <>
      <fieldset>
        <legend>
          <FormattedMessage
            id="instance.table.DataPersistenceConfig"
            defaultMessage="数据持久化配置"
          />
        </legend>
        <BasicFormItem
          label={
            <FormattedMessage
              id="instance.table.filesystem"
              defaultMessage="文件系统"
            />
          }
          name="filesystem"
          initialValue="ext4"
          required
        >
          <Select>
            <Select.Option value="ext4" title="ext4">
              ext4
            </Select.Option>
            <Select.Option value="xfs" title="xfs">
              xfs
            </Select.Option>
          </Select>
        </BasicFormItem>
        <BasicFormItem
          label={
            <FormattedMessage
              id="instance.table.dataFilePath"
              defaultMessage="数据文件路径"
            />
          }
          name="dataPath"
          initialValue=""
        >
          <Input
            placeholder="/var/lib/usmData/"
            suffix={
              <Tooltip
                placement="topRight"
                title={
                  <FormattedMessage
                    id="instance.form.defultDataDir"
                    defaultMessage="默认数据目录：/var/lib/usmData/"
                  />
                }
              >
                <QuestionCircleOutlined />
              </Tooltip>
            }
          />
        </BasicFormItem>
        <BasicFormItem
          label={
            <FormattedMessage
              id="instance.table.configPath"
              defaultMessage="配置文件路径"
            />
          }
          name="configPath"
          initialValue=""
        >
          <Input
            placeholder="/var/lib/usmConf/"
            suffix={
              <Tooltip
                placement="topRight"
                title={
                  <FormattedMessage
                    id="instance.form.defultConfDir"
                    defaultMessage="默认配置目录：/var/lib/usmConf/"
                  />
                }
              >
                <QuestionCircleOutlined />
              </Tooltip>
            }
          />
        </BasicFormItem>
      </fieldset>
    </>
  );
}
