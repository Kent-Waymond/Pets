import React from 'react';
import { Input, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormattedMessage } from 'umi';
import { useIntl, defineMessages } from 'react-intl';
const { Option } = Select;

const intlMessages = defineMessages({
  MountPoint: {
    id: 'node.form.InputMountPointTips',
    defaultMessage: '请输入数据盘挂载路径',
  },
  DiskName: {
    id: 'node.form.InputDiskNameTips',
    defaultMessage: '请输入数据盘名',
  },
  FileSystem: {
    id: 'node.form.SelectFileSystemTips',
    defaultMessage: '请选择文件系统',
  },
});

export default function ConfigDataDiskForm() {
  const Intl = useIntl();
  return (
    <>
      <FormItem
        label={
          <FormattedMessage
            id="node.form.mountPoint"
            defaultMessage="数据盘挂载路径"
          />
        }
        name="mountPoint"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.MountPoint),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage id="node.form.diskName" defaultMessage="数据盘名" />
        }
        name="diskName"
        initialValue=""
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.DiskName),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label={
          <FormattedMessage
            id="node.form.filesystem"
            defaultMessage="文件系统"
          />
        }
        name="filesystem"
        initialValue="xfs"
        required={true}
        rules={[
          {
            required: true,
            message: Intl.formatMessage(intlMessages.FileSystem),
          },
        ]}
      >
        <Select>
          <Option value="xfs">xfs</Option>
          <Option value="glusterfs">glusterfs</Option>
        </Select>
      </FormItem>
      <FormItem
        label={
          <FormattedMessage id="node.form.comment" defaultMessage="备注" />
        }
        name="comment"
        initialValue=""
      >
        <Input />
      </FormItem>
    </>
  );
}
