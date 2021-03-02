import {
  IBasiccDescriptionsItem,
  ProfileDescriptions,
} from '@/components/description/ProfileDescriptions';
import { formatTimestamp } from '@/utils/date';
import { Badge, Button, Drawer, PageHeader, Space, Spin, Tabs } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useDispatch, useSelector } from 'umi';
import { NodeChartIndexPanel } from '../charts';
import { INodeProfile, INodeProfileEthernetPorts } from '../type.d';
import CreateNetworkBondPanel from '../form/CreateNetworkBondPanel';
import EthernetPortsTable from './EthernetPortsTable';
import InstanceForNodeTable from './InstanceForNodeTable';
import DataDiskTable from './DataDiskTable';
import ConfigDataDiskPanel from '../form/ConfigDataDiskPanel';
import CreateVLANPanel from '../form/CreateVLANPanel';

interface INodeProfileProps extends DrawerProps {
  NodeId: string;
}

interface INodeProfileContext {
  NodeProfile: INodeProfile;
  NodeId: string;
  RefreshNodeProfile: () => void;
  RefreshNodeEthernetPorts: () => void;
}
const defaultProfile: INodeProfile = {
  id: '',
  name: '',
  createAt: 0,
  address: '',
  accountName: '',
  sshPort: 22,
  status: 'down',
  ethernetPorts: [],
  attachedNetworks: [],
  dataDisk: [],
};

// 获取节点详情
function useFetchNodeProfile(
  NodeId: string,
): [boolean, INodeProfile, () => void] {
  const dispatch = useDispatch<any>();
  const [NodeProfile, ChangeNodeProfile] = useState<INodeProfile>(
    defaultProfile,
  );
  const loading = useSelector((state: any) => state.loading);
  const GetNodeProfileLoading = loading?.effects?.['node/GetHostInfo'] || false;
  const GetNodeProfile = useCallback(async () => {
    if (NodeId) {
      const profile: INodeProfile = await dispatch({
        type: 'node/GetHostInfo',
        payload: {
          NodeId,
        },
      });

      if (profile) {
        ChangeNodeProfile(profile);
      } else {
        ChangeNodeProfile(defaultProfile);
      }
    }
    return null;
  }, [NodeId, dispatch]);

  useEffect(() => {
    GetNodeProfile();
  }, [GetNodeProfile]);

  return [GetNodeProfileLoading, NodeProfile, GetNodeProfile];
}

// 获取节点网口列表
function useFetchNodeEthernetPorts(
  NodeId: string,
): [boolean, INodeProfileEthernetPorts[], () => void] {
  const dispatch = useDispatch<any>();
  const [EthernetPorts, ChangeEthernetPorts] = useState<
    INodeProfileEthernetPorts[]
  >([]);
  const loading = useSelector((state: any) => state.loading);
  const GetNodeEthernetPortsLoading =
    loading?.effects?.['node/ListEthernetPorts'] || false;
  const GetNodeEthernetPorts = useCallback(async () => {
    if (NodeId) {
      const ports: INodeProfileEthernetPorts[] = await dispatch({
        type: 'node/ListEthernetPorts',
        payload: {
          hostId: NodeId,
        },
      });

      if (ports instanceof Array) {
        ChangeEthernetPorts(ports);
      } else {
        ChangeEthernetPorts([]);
      }
    }
    return null;
  }, [NodeId, dispatch]);

  useEffect(() => {
    GetNodeEthernetPorts();
  }, [GetNodeEthernetPorts]);

  return [GetNodeEthernetPortsLoading, EthernetPorts, GetNodeEthernetPorts];
}

export const NodeProfileContext = React.createContext<INodeProfileContext>({
  NodeProfile: defaultProfile,
  NodeId: '',
  RefreshNodeProfile: () => {},
  RefreshNodeEthernetPorts: () => {},
});

export default function NodeProfile(props: INodeProfileProps) {
  const { NodeId, visible, onClose, ...restProps } = props;

  const [BondNetworkVisible, ChangeBondNetworkVisible] = useState(false);
  const [
    ConfigDataDiskPanelVisible,
    ChangeConfigDataDiskPanelVisible,
  ] = useState(false);
  const [CreateVLANPanelVisible, ChangeCreateVLANPanelVisible] = useState(
    false,
  );

  const [
    GetNodeProfileLoading,
    NodeProfile,
    RefreshNodeProfile,
  ] = useFetchNodeProfile(NodeId);
  const [
    EthernetPortsLoading,
    EthernetPorts,
    RefreshNodeEthernetPorts,
  ] = useFetchNodeEthernetPorts(NodeId);

  const dispatch = useDispatch<any>();

  function closeRecordProfile(ev: any) {
    if (onClose) {
      onClose(ev);
    }
  }

  function handleDeleteNetworkBond(name: string) {
    dispatch({
      type: 'node/RemoveNetworkBond',
      payload: {
        id: NodeId,
        name,
      },
    }).then(() => {
      RefreshNodeEthernetPorts();
    });
  }

  function openBondNetworkPanel() {
    ChangeBondNetworkVisible(true);
  }

  function closeBondNetworkPanel() {
    ChangeBondNetworkVisible(false);
    RefreshNodeEthernetPorts();
  }

  function openConfigDataDiskPanel() {
    ChangeConfigDataDiskPanelVisible(true);
  }

  function closeConfigDataDiskPanel() {
    ChangeConfigDataDiskPanelVisible(false);
  }

  function openCreateVLANPanel() {
    ChangeCreateVLANPanelVisible(true);
  }

  function closeCreateVLANPanel() {
    ChangeCreateVLANPanelVisible(false);
    RefreshNodeEthernetPorts();
  }

  function handleTabPaneClick(key: string, ev: any) {
    if (key === 'port') {
      RefreshNodeEthernetPorts();
    }
  }

  const profileItems: IBasiccDescriptionsItem<INodeProfile>[] = [
    {
      key: 'name',
      label: (
        <FormattedMessage id="node.table.HostName" defaultMessage="节点名" />
      ),
      children: NodeProfile?.name,
      span: 2,
    },
    {
      key: 'address',
      label: (
        <FormattedMessage id="node.table.IpAddress" defaultMessage="IP地址" />
      ),
      children: NodeProfile?.address,
      span: 1,
    },
    {
      key: 'accountName',
      label: (
        <FormattedMessage id="node.table.AccountName" defaultMessage="账户名" />
      ),
      children: NodeProfile?.accountName,
      span: 1,
    },
    {
      key: 'sshPort',
      label: (
        <FormattedMessage id="node.table.SSHPort" defaultMessage="SSH端口" />
      ),
      children: NodeProfile?.sshPort,
      span: 1,
    },
    {
      key: 'status',
      label: (
        <FormattedMessage
          id="instance.table.RunningStatus"
          defaultMessage="运行状态"
        />
      ),
      children: (
        <Badge
          status={NodeProfile?.status == 'ready' ? 'success' : 'error'}
          text={
            NodeProfile?.status == 'ready' ? (
              <FormattedMessage id="node.table.ready" defaultMessage="运行中" />
            ) : (
              <FormattedMessage id="node.table.down" defaultMessage="已停用" />
            )
          }
        />
      ),
      span: 1,
    },
    {
      key: 'createAt',
      label: (
        <FormattedMessage
          id="node.table.CreateTime"
          defaultMessage="创建时间"
        />
      ),
      children: formatTimestamp(NodeProfile?.createAt),
      span: 1,
    },
  ];

  const HeaderExtra = (
    <Space>
      <Button onClick={openBondNetworkPanel}>
        <FormattedMessage
          id="node.table.CreateLinkAggregation"
          defaultMessage="创建链路聚合"
        />
      </Button>
      <Button onClick={openConfigDataDiskPanel}>
        <FormattedMessage
          id="node.table.ConfigDataDisk"
          defaultMessage="配置主机数据盘"
        />
      </Button>
      <Button onClick={openCreateVLANPanel}>
        <FormattedMessage
          id="node.table.CreateVLAN"
          defaultMessage="创建VLAN"
        />
      </Button>
    </Space>
  );
  return (
    <Drawer
      title={
        <FormattedMessage
          id="node.table.NodeProfile"
          defaultMessage="节点详情"
        />
      }
      maskClosable={false}
      visible={visible}
      width={850}
      onClose={closeRecordProfile}
      destroyOnClose={true}
      bodyStyle={{ padding: 0 }}
      {...restProps}
    >
      <Spin spinning={GetNodeProfileLoading}>
        <NodeProfileContext.Provider
          value={{
            NodeProfile,
            NodeId,
            RefreshNodeProfile,
            RefreshNodeEthernetPorts,
          }}
        >
          <PageHeader
            title={NodeProfile.name}
            subTitle={NodeProfile.address}
            extra={HeaderExtra}
          >
            <ProfileDescriptions profileItems={profileItems} column={2} />
            <Tabs onTabClick={handleTabPaneClick}>
              <Tabs.TabPane
                key="chart"
                tab={
                  <FormattedMessage
                    id="node.table.NodeMonitor"
                    defaultMessage="节点监控"
                  />
                }
              >
                <NodeChartIndexPanel NodeId={NodeId} />
              </Tabs.TabPane>
              <Tabs.TabPane
                key="port"
                tab={
                  <FormattedMessage
                    id="node.table.EthernetPort"
                    defaultMessage="物理网口"
                  />
                }
              >
                <EthernetPortsTable
                  NodeId={NodeId}
                  loading={EthernetPortsLoading}
                  EthernetPorts={EthernetPorts}
                  handleDeleteBond={handleDeleteNetworkBond}
                  RefreshNodeEthernetPorts={RefreshNodeEthernetPorts}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                key="instance"
                tab={
                  <FormattedMessage
                    id="node.table.InstanceList"
                    defaultMessage="实例列表"
                  />
                }
              >
                <InstanceForNodeTable NodeId={NodeId} />
              </Tabs.TabPane>
              <Tabs.TabPane
                key="datadisk"
                tab={
                  <FormattedMessage
                    id="node.table.DataDiskList"
                    defaultMessage="数据磁盘"
                  />
                }
              >
                <DataDiskTable DataDiskProfile={NodeProfile.dataDisk ?? []} />
              </Tabs.TabPane>
            </Tabs>
          </PageHeader>

          {BondNetworkVisible && (
            <CreateNetworkBondPanel
              visible={BondNetworkVisible}
              HostId={NodeId}
              EthernetPorts={EthernetPorts}
              onClose={closeBondNetworkPanel}
            />
          )}
          {ConfigDataDiskPanelVisible && (
            <ConfigDataDiskPanel
              visible={ConfigDataDiskPanelVisible}
              HostId={NodeId}
              onClose={closeConfigDataDiskPanel}
            />
          )}
          {CreateVLANPanelVisible && (
            <CreateVLANPanel
              visible={CreateVLANPanelVisible}
              HostId={NodeId}
              EthernetPorts={EthernetPorts}
              onClose={closeCreateVLANPanel}
            />
          )}
        </NodeProfileContext.Provider>
      </Spin>
    </Drawer>
  );
}
