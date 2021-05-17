import React from 'react';
import { List, Button, Badge } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import Modal from 'antd/lib/modal/Modal';
import { useSelector, history } from 'umi';
import BellItem from './BellItem';
import { MailTwoTone, MessageTwoTone, BookTwoTone } from '@ant-design/icons';
import { GET_IDENTITY } from '@/utils/auth';
interface BellPopProps extends ModalProps {
  visible: boolean;
  onCancel: () => void;
}

export default function BellPop(props: BellPopProps) {
  const { visible, onCancel } = props;
  // 获取所有创建过程中id
  const ObjIds = useSelector((state: any) => state.createrate.createObjIds);
  const currentUser = GET_IDENTITY();

  const RedirectPage = (path: string) => {
    history.push(path);
  };
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
      {/* TODO 发布订阅   当有新的审查、反馈时通知管理员 */}
      {/* <List
        itemLayout="horizontal"
        dataSource={ObjIds}
        renderItem={(item: any) => <BellItem item={item} />}
      /> */}
      <Badge count={100} overflowCount={99}>
        <Button
          type="text"
          onClick={() => RedirectPage('/settings/myfeedback')}
        >
          <MailTwoTone />
          我的反馈
        </Button>
      </Badge>
      <Badge count={100} overflowCount={99}>
        <Button type="text" onClick={() => RedirectPage('/settings/moment')}>
          <MessageTwoTone />
          我的动态
        </Button>
      </Badge>
      {currentUser === 'admin' && (
        <Badge count={100} overflowCount={99}>
          {/* TODO 页面 */}
          <Button type="text">
            <BookTwoTone />
            待审查
          </Button>
        </Badge>
      )}
    </Modal>
  );
}
