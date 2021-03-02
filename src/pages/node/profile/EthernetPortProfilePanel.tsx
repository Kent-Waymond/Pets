import {
  IBasiccDescriptionsItem,
  ProfileDescriptions,
} from '@/components/description/ProfileDescriptions';
import Tag from '@/components/tag';
import { stringSlice } from '@/utils/string';
import {
  Badge,
  Drawer,
  PageHeader,
  Table,
  Spin,
  Typography,
  Divider,
  Button,
  Switch,
} from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import React, { useContext, useMemo, useState } from 'react';
import { FormattedMessage, useDispatch, useIntl, useSelector } from 'umi';
import {
  INodeProfileEthernetPorts,
  NodeEthernetNetworkStateType,
  NodeEthernetType,
} from '../type.d';
import { EthernetNetworkStateMap, EthernetTypeMap } from './EthernetPortsTable';
import { EthernetPortIpConfModal } from './EthernetPortIpConfModal';
import { EnumNodeEthernetNetworkState } from '../variable';
import { NodeProfileContext } from './NodeProfile';

interface IEthernetPortProfilePanelProps extends DrawerProps {
  profile: INodeProfileEthernetPorts;
  EthernetPortSlaves: INodeProfileEthernetPorts[];
  visible: boolean;
  onClose: () => void;
}

const defaultProfile: INodeProfileEthernetPorts = {
  id: '',
  name: '',
  type: 'device',
  state: 'up',
  connection: false,
  addrs: [],
  slaveType: 'bond',
  master: '',
  createAt: '',
  remark: '',
};

const ActionUpdateEthernetPortState = 'node/UpdateEthernetPortState';
const ActionUpdateEthernetPortIP = 'node/UpdateEthernetPortIP';
const ActionRemarkEthernetPort = 'node/RemarkEthernetPort';

export default function EthernetPortProfilePanel(
  props: IEthernetPortProfilePanelProps,
) {
  const { profile, visible, EthernetPortSlaves, onClose, ...restProps } = props;
  const intl = useIntl();
  const dispatch = useDispatch<any>();
  const ModelsLoading = useSelector((state: any) => state.loading?.models);
  const loading = !!ModelsLoading?.node;

  const NodeProfileCtx = useContext(NodeProfileContext);
  const { NodeId, RefreshNodeEthernetPorts } = NodeProfileCtx;
  const [
    updateEthernetIpVisible,
    ChangeUpdateEthernetIpVisible,
  ] = useState<boolean>(false);

  const EthernetPortProfile = useMemo(() => {
    return profile ? profile : defaultProfile;
  }, [profile]);

  const disableAction = useMemo((): boolean => {
    const { NodeProfile } = NodeProfileCtx;
    const { addrs, slaveType, master } = EthernetPortProfile;
    return (
      addrs?.includes(NodeProfile?.address) ||
      (slaveType === 'bond' && !!master)
    );
  }, [EthernetPortProfile, NodeProfileCtx]);
  const profileItems: IBasiccDescriptionsItem<INodeProfileEthernetPorts>[] = [
    {
      key: 'name',
      label: (
        <FormattedMessage
          id="node.table.EthernetPortName"
          defaultMessage="网口名"
        />
      ),
      children: EthernetPortProfile?.name,
      span: 2,
    },
    {
      key: 'type',
      label: (
        <FormattedMessage
          id="node.table.EthernetType"
          defaultMessage="网口类型"
        />
      ),
      span: 1,
      children: EthernetTypeMap[EthernetPortProfile?.type]
        ? intl.formatMessage(EthernetTypeMap[EthernetPortProfile?.type])
        : EthernetPortProfile?.type,
    },
    // {
    //   key: 'slaveType',
    //   label: <FormattedMessage id="node.table.slaveType" defaultMessage="链路聚合类型" />,
    //   children: EthernetPortProfile?.slaveType,
    //   span: 1,
    // },
    {
      key: 'state',
      label: (
        <FormattedMessage
          id="node.table.networkState"
          defaultMessage="联网状态"
        />
      ),
      span: 1,
      // children: EthernetNetworkStateMap[EthernetPortProfile?.state] ? intl.formatMessage(EthernetNetworkStateMap[EthernetPortProfile?.state]) : EthernetPortProfile?.state,
      children: (
        <Switch
          checked={!!(EthernetPortProfile?.state === 'up')}
          disabled={disableAction}
          title={
            EthernetNetworkStateMap[EthernetPortProfile?.state]
              ? intl.formatMessage(
                  EthernetNetworkStateMap[EthernetPortProfile?.state],
                )
              : EthernetPortProfile?.state
          }
          onChange={UpdateEthernetState}
        />
      ),
    },
    {
      key: 'connection',
      label: (
        <FormattedMessage
          id="node.table.ElectricState"
          defaultMessage="通电状态"
        />
      ),
      span: 1,
      children: (
        <Badge
          status={EthernetPortProfile?.connection ? 'success' : 'default'}
          text={
            EthernetPortProfile?.connection ? (
              <FormattedMessage
                id="node.table.PowerOn"
                defaultMessage="已通电"
              />
            ) : (
              <FormattedMessage
                id="node.table.PowerOff"
                defaultMessage="未通电"
              />
            )
          }
        />
      ),
    },
    {
      key: 'addrs',
      label: <FormattedMessage id="node.table.addrs" defaultMessage="地址" />,
      children: (
        <>
          {EthernetPortProfile?.addrs instanceof Array &&
            EthernetPortProfile?.addrs?.map((item: string) => {
              return (
                <>
                  <Typography.Text
                    code
                    key={item}
                    title={item}
                    copyable={{ text: item }}
                  >
                    {item}
                  </Typography.Text>
                  <br />
                </>
              );
            })}
        </>
      ),
      span: 2,
    },
    {
      key: 'remark',
      label: (
        <FormattedMessage id="common.text.Comment" defaultMessage="备注" />
      ),
      children: (
        <Typography.Paragraph
          editable={{
            onChange: RemarkEthernetPort,
            maxLength: 50,
            autoSize: { maxRows: 5, minRows: 3 },
          }}
        >
          {EthernetPortProfile?.remark}
        </Typography.Paragraph>
      ),
      span: 2,
    },
  ];

  const TableColumns = [
    {
      title: (
        <FormattedMessage
          id="node.table.EthernetPortName"
          defaultMessage="网口名"
        />
      ),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ellipsis: true,
      render: (name: string, record: INodeProfileEthernetPorts) => {
        return <span title={name}>{name}</span>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="node.table.EthernetType"
          defaultMessage="网口类型"
        />
      ),
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      ellipsis: true,
      render: (type: NodeEthernetType) => {
        const displayLabel = EthernetTypeMap[type]
          ? intl.formatMessage(EthernetTypeMap[type])
          : type;

        return (
          <Typography.Text title={displayLabel}>{displayLabel}</Typography.Text>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="node.table.networkState"
          defaultMessage="联网状态"
        />
      ),
      dataIndex: 'state',
      key: 'state',
      width: '12%',
      ellipsis: true,
      render: (state: NodeEthernetNetworkStateType) => {
        const displayLabel = EthernetNetworkStateMap[state]
          ? intl.formatMessage(EthernetNetworkStateMap[state])
          : state;

        return (
          <Typography.Text title={displayLabel}>{displayLabel}</Typography.Text>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="node.table.masterNode"
          defaultMessage="所属节点"
        />
      ),
      dataIndex: 'master',
      key: 'master',
      width: '15%',
      ellipsis: true,
      render: (text: string) => {
        return <Typography.Text title={text}>{text}</Typography.Text>;
      },
    },
    {
      title: (
        <FormattedMessage id="node.table.addrs" defaultMessage="地址列表" />
      ),
      dataIndex: 'addrs',
      key: 'addrs',
      // width: '20%',
      ellipsis: true,
      render: (addrs: string[]) => {
        if (addrs instanceof Array && addrs?.length > 0) {
          const address = addrs.map((item: string) => {
            return (
              <Typography.Text code key={item} title={item}>
                {item} <br />{' '}
              </Typography.Text>
            );
          });
          return address;
        } else {
          return null;
        }
      },
    },
    {
      title: (
        <FormattedMessage id="common.text.Comment" defaultMessage="备注" />
      ),
      dataIndex: 'remark',
      width: '20%',
      ellipsis: true,
      render: (text: string) => {
        if (text) {
          return <Tag title={text}>{stringSlice(text)}</Tag>;
        }
        return null;
      },
    },
  ];

  function UpdateEthernetState(checked: boolean, ev: MouseEvent) {
    dispatch({
      type: ActionUpdateEthernetPortState,
      payload: {
        NodeId,
        ethernetPort: profile?.name,
        state: checked
          ? EnumNodeEthernetNetworkState.up
          : EnumNodeEthernetNetworkState.down,
      },
    }).then(() => {
      RefreshNodeEthernetPorts();
    });
  }
  function UpdateEthernetIp(values: any) {
    dispatch({
      type: ActionUpdateEthernetPortIP,
      payload: {
        NodeId,
        ethernetPort: profile?.name,
        ...values,
      },
    }).then(() => {
      CloseEthernetIpConfModal();
    });
  }
  function RemarkEthernetPort(remark: any) {
    dispatch({
      type: ActionRemarkEthernetPort,
      payload: {
        NodeId,
        ethernetPort: profile?.name,
        remark,
      },
    }).then(() => {
      RefreshNodeEthernetPorts();
    });
  }

  function OpenEthernetIpConfModal() {
    ChangeUpdateEthernetIpVisible(true);
  }
  function CloseEthernetIpConfModal() {
    ChangeUpdateEthernetIpVisible(false);
    RefreshNodeEthernetPorts();
  }

  return (
    <Drawer
      title={
        <FormattedMessage
          id="node.table.EthernetPortProfilePanel"
          defaultMessage="网口详情"
        />
      }
      maskClosable={false}
      visible={visible}
      width={850}
      onClose={onClose}
      destroyOnClose={true}
      bodyStyle={{ padding: 0 }}
      {...restProps}
    >
      <Spin spinning={loading}>
        <PageHeader
          title={EthernetPortProfile.name}
          extra={[
            <Button onClick={OpenEthernetIpConfModal} disabled={disableAction}>
              <FormattedMessage
                id="node.table.UpdateEthernetIp"
                defaultMessage="更新网口IP"
              />
            </Button>,
          ]}
        >
          <ProfileDescriptions
            profileItems={profileItems}
            column={2}
            bordered={EthernetPortProfile?.type !== 'bond'}
          />
          {EthernetPortProfile?.type === 'bond' && (
            <>
              <Divider />
              <Table
                columns={TableColumns}
                dataSource={EthernetPortSlaves}
                rowKey="name"
                scroll={{
                  y: window.innerHeight - 250,
                }}
              />
            </>
          )}
          {updateEthernetIpVisible && (
            <EthernetPortIpConfModal
              visible={updateEthernetIpVisible}
              title={
                <FormattedMessage
                  id="node.table.UpdateEthernetIp"
                  defaultMessage="更新网口IP"
                />
              }
              onCancel={CloseEthernetIpConfModal}
              profile={EthernetPortProfile}
              onConfigChange={UpdateEthernetIp}
            />
          )}
        </PageHeader>
      </Spin>
    </Drawer>
  );
}
