import { List } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useSelector } from 'umi';
import BellItem from './BellItem';

interface BellPopProps extends ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export default function BellPop(props: BellPopProps) {
  const { visible, onCancel } = props;
  // 获取所有创建过程中id
  const ObjIds = useSelector((state: any) => state.createrate.createObjIds);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      closable={false}
      mask={false}
      width={336}
      style={{
        top: 55,
        right: 100,
        margin: 0,
        float: 'right',
      }}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={ObjIds}
        renderItem={(item: any) => <BellItem item={item} />}
      />
    </Modal>
  );
}
