import React, { useState, useEffect, useCallback } from 'react';
import {
  IBasiccDescriptionsItem,
  ProfileDescriptions,
} from '@/components/description/ProfileDescriptions';
import { UserProfile, UserPetsRecord } from '../type.d';
import { Drawer, Tabs, Space, Modal, Avatar } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { UserOutlined } from '@ant-design/icons';
import UpdateUserPanel from '../form/UpdateUserPanel';
import PetsTable from '../table/PetsTable';
import Button from '@/components/button';

interface UserProfileTypeProps {
  profile: UserProfile | null;
  visible: boolean;
  panelKey?: string;
  onClose: () => void;
}

const defaultProfile: UserProfile = {
  userId: '',
  userName: '',
  password: '',
  nickname: '',
  locationId: '',
  type: 0,
  phone: '',
  avatar: '',
  detailAddress: '',
  email: '',
  times: 0,
};

// 获取用户详情  用于用户登录时查看、修改详情 此时用户详情重新请求  Tab 用户基本信息  用户宠物信息

export function UserProfilePanel(props: UserProfileTypeProps) {
  const { profile, visible, panelKey, onClose } = props;
  const [CurrentTabKey, ChangeCurrentTabKey] = useState('info');
  const [UserPetsRecords, ChangeUserPetsRecords] = useState<UserPetsRecord[]>();

  const [UpdatePanelVisible, ChangeUpdatePanelVisible] = useState(false);

  const dispatch = useDispatch<any>();
  let userProfile = profile ?? defaultProfile;
  const UserId = userProfile.userId;

  const ListUserPetsLoading: boolean = useSelector(
    (state: any) => state.loading.effects['info/ListUserPets'],
  );

  const RefreshUserPets = useCallback(() => {
    dispatch({
      type: 'info/ListUserPets',
      payload: {
        pageNumber: 1,
        pageSize: 20,
        // TODO 字段
      },
    }).then((UserPets: UserPetsRecord[]) => {
      if (UserPets instanceof Array) {
        ChangeUserPetsRecords(UserPets);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (CurrentTabKey === 'info') {
    } else if (CurrentTabKey === 'pets') {
      RefreshUserPets();
    }
  }, [CurrentTabKey, RefreshUserPets]);

  useEffect(() => {
    if (panelKey) {
      ChangeCurrentTabKey(panelKey);
    }
  }, [panelKey]);

  const profileItems: IBasiccDescriptionsItem<UserProfile>[] = [
    {
      key: 'avatar',
      label: '头像',
      children: (
        <Avatar
          shape="square"
          size="large"
          src={`http://119.3.249.45:7070/file/image/${userProfile?.avatar}`}
          icon={<UserOutlined />}
        />
      ),
      span: 2,
    },
    {
      key: 'userName',
      label: '用户名',
      children: userProfile?.userName,
    },
    {
      key: 'nickname',
      label: '昵称',
      children: userProfile?.nickname,
    },

    {
      key: 'phone',
      label: '手机号',
      children: userProfile?.phone,
    },
    {
      key: 'detailAddress',
      label: '详细住址',
      children: userProfile?.detailAddress,
    },
    {
      key: 'type',
      label: '用户类型',
      children: userProfile?.type === 0 ? '养宠用户' : '',
    },
    {
      key: 'email',
      label: '邮箱',
      children: userProfile?.email,
    },
  ];
  const ChangeTabKey = (ActiveKey: string) => {
    ChangeCurrentTabKey(ActiveKey);
  };
  const OpenUpdatePanel = () => {
    ChangeUpdatePanelVisible(true);
  };
  const CloseUpdatePanel = () => {
    ChangeUpdatePanelVisible(false);
  };
  const OpenAddPetPanel = () => {};
  const DeletePet = () => {
    Modal.confirm({
      title: '您确认删除吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'info/RemovePet',
          payload: {
            id: UserId,
            // TODO 宠物id
          },
        }).then((success: boolean) => {
          if (success) {
            onClose();
          }
        });
      },
    });
  };
  console.log(profileItems, 'profileItems');
  return (
    <>
      <Drawer
        title={`${profile?.userName} 用户详情`}
        visible={visible}
        onClose={onClose}
        // footer={PetDrawerFooter}
        width={600}
      >
        <Tabs
          activeKey={CurrentTabKey}
          onChange={ChangeTabKey}
          // tabBarExtraContent={
          //   <Space>
          //     <Button onClick={OpenAddPetPanel}>
          //       添加宠物
          //     </Button>
          //     <Button onClick={OpenUpdatePanel}>
          //       更新资料
          //     </Button>
          //     <Button type="danger" onClick={DeletePet}>
          //       删除宠物
          //     </Button>
          //   </Space>
          // }
        >
          <Tabs.TabPane key="info" tab="用户信息">
            <ProfileDescriptions
              profileItems={userProfile ? profileItems : []}
              column={2}
              bordered
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="pets" tab="宠物信息">
            <PetsTable />
          </Tabs.TabPane>
        </Tabs>
        {UpdatePanelVisible && (
          <UpdateUserPanel
            visible={UpdatePanelVisible}
            onClose={CloseUpdatePanel}
            UserProfile={userProfile ?? []}
          />
        )}
      </Drawer>
    </>
  );
}
