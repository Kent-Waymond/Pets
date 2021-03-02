import React, { useState, useEffect, useCallback } from 'react';
import {
  IBasiccDescriptionsItem,
  ProfileDescriptions,
} from '@/components/description/ProfileDescriptions';
import {
  NetworkProfile,
  NetworkEthernetPortRecord,
  NetworkInstanceRecord,
} from '../type.d';
import { Typography, Tabs, Space, Modal } from 'antd';
import { FormattedMessage, useDispatch, useIntl, useSelector } from 'umi';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { formatTimestamp } from '@/utils/date';
import { EthernetPortTable } from '../table/EthernetPortTable';
import { InstanceTable } from '../table/InstanceTable';
import UpdateNetworkPanel from '../form/UpdateNetworkPanel';
import { IPModeMap } from '../table/NetworkTable';
import { NetworkEthernetPortAddPanel } from './NetworkEthernetPortAddPanel';
import Button from '@/components/button';

interface NetworkProfileTypeProps {
  profile: NetworkProfile | null;
  panelKey?: string;
  onClose: () => void;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  info: {
    id: 'network.table.info',
    defaultMessage: '基本信息',
  },
  ethernetPort: {
    id: 'network.table.ethernets',
    defaultMessage: '网卡',
  },
  instance: {
    id: 'network.table.instances',
    defaultMessage: '实例',
  },
});

const defaultProfile: NetworkProfile = {
  id: '123',
  name: '321',
  comment: '321',
  type: 2,
  ipMode: 'manual',
  ipPool: '10.0.101.10,10.0.101.125',
  subnetMask: '255.0.0.0',
  gateway: '13',
  createAt: 0,
  ethernetPortCount: 0,
  instanceCount: 0,
};

export function NetworkProfilePanel(props: NetworkProfileTypeProps) {
  const { profile: newProfile, panelKey, onClose } = props;
  const [CurrentTabKey, ChangeCurrentTabKey] = useState('info');
  const [EthernetPortRecords, ChangeEthernetPortRecords] = useState<
    NetworkEthernetPortRecord[]
  >();
  const [InstanceRecords, ChangeInstanceRecords] = useState<
    NetworkInstanceRecord[]
  >();
  const [UpdatePanelVisible, ChangeUpdatePanelVisible] = useState(false);
  const [AddEthernetPanelVisible, ChangeAddEthernetPanelVisible] = useState(
    false,
  );
  const intl = useIntl();
  const dispatch = useDispatch<any>();
  let profile = newProfile ? newProfile : defaultProfile;
  const ProfileId = profile.id;

  const ListEthernetPortsLoading: boolean = useSelector(
    (state: any) => state.loading.effects['network/ListAttachedEthernetPorts'],
  );
  const ListInstancesLoading: boolean = useSelector(
    (state: any) => state.loading.effects['network/ListAttachedHosts'],
  );

  const RefreshEthernetPorts = useCallback(() => {
    dispatch({
      type: 'network/ListAttachedEthernetPorts',
      payload: {
        pageNumber: 1,
        pageSize: 20,
        listAll: true,
        Portkeywords: '',
        networkId: ProfileId,
      },
    }).then((AttachedEthernetPorts: NetworkEthernetPortRecord[]) => {
      if (AttachedEthernetPorts instanceof Array) {
        ChangeEthernetPortRecords(AttachedEthernetPorts);
      }
    });
  }, [dispatch, ProfileId]);
  const RefreshInstances = useCallback(() => {
    dispatch({
      type: 'network/ListAttachedHosts',
      payload: {
        pageNumber: 1,
        pageSize: 20,
        listAll: true,
        Instancekeywords: '',
        networkId: ProfileId,
      },
    }).then((AttachedHosts: NetworkInstanceRecord[]) => {
      if (AttachedHosts instanceof Array) {
        ChangeInstanceRecords(AttachedHosts);
      }
    });
  }, [dispatch, ProfileId]);

  useEffect(() => {
    if (CurrentTabKey === 'ethernets') {
      RefreshEthernetPorts();
    } else if (CurrentTabKey === 'instances') {
      RefreshInstances();
    }
  }, [CurrentTabKey, RefreshEthernetPorts, RefreshInstances]);

  useEffect(() => {
    if (panelKey) {
      ChangeCurrentTabKey(panelKey);
    }
  }, [panelKey]);

  const profileItems: IBasiccDescriptionsItem<NetworkProfile>[] = [
    {
      key: 'name',
      label: (
        <FormattedMessage id="network.form.name" defaultMessage="网络名" />
      ),
      children: profile?.name,
      span: 2,
    },
    {
      key: 'type',
      label: (
        <FormattedMessage id="network.table.type" defaultMessage="网络类型" />
      ),
      children: (
        <Typography.Text>
          {profile?.type === 2 ? 'MACVLAN' : 'IPVLAN'}
        </Typography.Text>
      ),
    },
    {
      key: 'ipMode',
      label: (
        <FormattedMessage
          id="network.table.IPMode"
          defaultMessage="IP设置模式"
        />
      ),
      children: (
        <Typography.Text>
          {IPModeMap[profile?.ipMode] ?? profile?.ipMode}
        </Typography.Text>
      ),
    },
    {
      key: 'createAt',
      label: (
        <FormattedMessage
          id="network.table.CreateTime"
          defaultMessage="创建时间"
        />
      ),
      children: (
        <Typography.Text>{formatTimestamp(profile?.createAt)}</Typography.Text>
      ),
    },
    {
      key: 'ipPool',
      label: (
        <FormattedMessage id="network.table.IPPool" defaultMessage="IP池" />
      ),
      children: (
        <Typography.Text>
          {profile?.ipPool?.replace(',', ' - ') || '-'}
        </Typography.Text>
      ),
    },
    {
      key: 'subnetMask',
      label: (
        <FormattedMessage
          id="network.table.SubnetMask"
          defaultMessage="子网掩码"
        />
      ),
      children: <Typography.Text>{profile?.subnetMask || '-'}</Typography.Text>,
    },
    {
      key: 'gateway',
      label: (
        <FormattedMessage id="network.table.GateWay" defaultMessage="网关" />
      ),
      children: <Typography.Text>{profile?.gateway || '-'}</Typography.Text>,
    },
    {
      key: 'comment',
      label: (
        <FormattedMessage id="network.table.comment" defaultMessage="备注" />
      ),
      children: <Typography.Text>{profile?.comment}</Typography.Text>,
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
  function OpenAddEthernetPanel() {
    ChangeAddEthernetPanelVisible(true);
  }
  function CloseAddEthernetPanel() {
    ChangeAddEthernetPanelVisible(false);
    if (CurrentTabKey === 'ethernets') {
      RefreshEthernetPorts();
    }
  }

  const DeleteNetwork = () => {
    Modal.confirm({
      title: (
        <FormattedMessage
          id="network.table.delete"
          defaultMessage="您确认删除吗？"
        />
      ),
      cancelText: (
        <FormattedMessage id="common.modalcancel" defaultMessage="取消" />
      ),
      okText: <FormattedMessage id="common.modalok" defaultMessage="确定" />,
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'network/RemoveNetwork',
          payload: {
            id: ProfileId,
          },
        }).then((success: boolean) => {
          if (success) {
            onClose();
          }
        });
      },
    });
  };

  return (
    <>
      <Tabs
        activeKey={CurrentTabKey}
        onChange={ChangeTabKey}
        tabBarExtraContent={
          <Space>
            <Button onClick={OpenAddEthernetPanel}>
              <FormattedMessage
                id="network.form.AddEthernetPort"
                defaultMessage="添加网口"
              />
            </Button>
            <Button onClick={OpenUpdatePanel}>
              <FormattedMessage
                id="network.table.Update"
                defaultMessage="更新网络"
              />
            </Button>
            <Button type="danger" onClick={DeleteNetwork}>
              <FormattedMessage
                id="network.table.Delete"
                defaultMessage="删除网络"
              />
            </Button>
          </Space>
        }
      >
        <Tabs.TabPane key="info" tab={intl.formatMessage(intlMessages.info)}>
          <ProfileDescriptions
            profileItems={profileItems}
            column={2}
            bordered
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="ethernets"
          tab={intl.formatMessage(intlMessages.ethernetPort)}
        >
          <EthernetPortTable
            ProfileId={ProfileId}
            RefreshEthernetPorts={RefreshEthernetPorts}
            EthernetPorts={EthernetPortRecords ?? null}
            loading={ListEthernetPortsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="instances"
          tab={intl.formatMessage(intlMessages.instance)}
        >
          <InstanceTable
            Instances={InstanceRecords ?? null}
            loading={ListInstancesLoading}
          />
        </Tabs.TabPane>
      </Tabs>
      {UpdatePanelVisible && (
        <UpdateNetworkPanel
          visible={UpdatePanelVisible}
          onClose={CloseUpdatePanel}
          NetworkProfile={profile ?? []}
        />
      )}
      {AddEthernetPanelVisible && (
        <NetworkEthernetPortAddPanel
          visible={AddEthernetPanelVisible}
          onCancel={CloseAddEthernetPanel}
          NetworkId={profile?.id || ''}
          CurrentEthernetPortRecords={EthernetPortRecords ?? null}
        />
      )}
    </>
  );
}
