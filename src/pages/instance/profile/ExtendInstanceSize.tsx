import { InputNumber, Modal, Typography } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { useState } from 'react';
import { FormattedMessage, useDispatch } from 'umi';

interface ExtendInstanceSizeProps extends ModalProps {
  InstanceId: string;
}

export function ExtendInstanceSize(props: ExtendInstanceSizeProps) {
  const { InstanceId, visible, onCancel } = props;
  const [extendSize, setExtendSize] = useState(5);

  const dispatch = useDispatch<any>();

  function changeExtendSize(value: number | string | undefined) {
    if (typeof value === 'number') {
      setExtendSize(value);
    }
  }

  function inputCancel(ev: any) {
    if (onCancel) {
      onCancel(ev);
    }
  }

  function inputFinish() {
    dispatch({
      type: 'instance/ExtendDiskSize',
      payload: {
        id: InstanceId,
        extendSize,
      },
    }).then((ev: any) => {
      inputCancel(ev);
    });
  }

  const ModelLabel = (
    <FormattedMessage
      id="instance.form.ExtendDiskSize"
      defaultMessage="实例磁盘扩展"
    />
  );

  return (
    <Modal
      title={ModelLabel}
      visible={visible}
      onOk={inputFinish}
      onCancel={inputCancel}
    >
      <Typography.Paragraph>
        <FormattedMessage
          id="instance.form.ExtendPlaceHolder"
          defaultMessage="请输入增量大小（单位MB）"
        />
      </Typography.Paragraph>
      <InputNumber
        value={extendSize}
        min={0}
        step={5}
        onChange={changeExtendSize}
        style={{ width: 470 }}
      />
    </Modal>
  );
}
