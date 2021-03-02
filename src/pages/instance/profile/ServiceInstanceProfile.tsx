import React, { useState } from 'react';
import {
  IBasiccDescriptionsItem,
  ProfileDescriptions,
} from '@/components/description/ProfileDescriptions';
import {
  InstanceProfileType,
  InstanceProtocol,
  InstanceRunningNode,
  InstanceVolume,
} from '../type.d';
import {
  Typography,
  Tag,
  Badge,
  Row,
  Tabs,
  Progress,
  Button,
  Space,
  Modal,
} from 'antd';
import { FormattedMessage, useDispatch, useIntl } from 'umi';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { formatTimestamp } from '@/utils/date';
import { ChartIndexPanel } from '../charts';
import { ExtendInstanceSize } from './ExtendInstanceSize';
import SpecificationChange from './SpecificationChange';

interface InstanceProfileTypeProps {
  profile: InstanceProfileType | null;
  onClose: (en: any) => void;
}

const stateMap: any = {
  running: 'success',
  stopped: 'error',
  unknown: 'warning',
};

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  running: {
    id: 'instance.table.Running',
    defaultMessage: '运行中',
  },
  stopped: {
    id: 'instance.table.Stopped',
    defaultMessage: '已停止',
  },
  unknown: {
    id: 'instance.table.Unknown',
    defaultMessage: '未知',
  },
  down: {
    id: 'instance.table.Stopped',
    defaultMessage: '已停止',
  },
  ready: {
    id: 'instance.table.Ready',
    defaultMessage: '就绪',
  },
  disconnected: {
    id: 'instance.table.Disconnected',
    defaultMessage: '已断开',
  },
  info: {
    id: 'instance.table.info',
    defaultMessage: '基本信息',
  },
  chart: {
    id: 'instance.table.chart',
    defaultMessage: '实例监控',
  },
});

const NodeStateMap: any = {
  unknown: 'warning',
  down: 'error',
  ready: 'success',
  disconnected: 'error',
};

const defaultProfile: InstanceProfileType = {
  id: '',
  name: '',
  createAt: 0,
  comment: '',
  address: '',
  protocolPorts: [],
  status: 'stopped',
  operationAddress: '',
  consolePort: 0,
  networkId: '',
  networkName: '',
  networkDriver: 0,
  productId: 'USM',
  runningNodes: [],
  volumes: [],
  ResourceLimit: {
    cpu: 0,
    memory: 0,
    diskSize: 0,
  },
  LicenseConfig: {
    expireAt: 0,
    specId: '',
    productId: 'USM',
    version: '',
    specDescription: '',
  },
  licenseRemainDays: 0,
};

export function ServiceInstanceProfile(props: InstanceProfileTypeProps) {
  const { profile: newProfile, onClose } = props;

  const intl = useIntl();
  const dispatch = useDispatch<any>();
  // console.log(getLocale());
  let profile = newProfile ? newProfile : defaultProfile;

  const { LicenseConfig, ResourceLimit } = profile;

  const [SpecificationChangeVisible, SetSpecificationChangeVisible] = useState(
    false,
  );
  const [extendInstanceSizeVisible, setExtendInstanceSizeVisible] = useState(
    false,
  );

  function parseStatus(status: string) {
    if (!status) {
      return intl.formatMessage(intlMessages.unknown);
    }
    if (intlMessages[status]) {
      return intl.formatMessage(intlMessages[status]);
    }
    return status;
  }
  const profileItems: IBasiccDescriptionsItem<InstanceProfileType>[] = [
    {
      key: 'name',
      label: '实例名称',
      children: profile?.name,
      span: 2,
    },
    {
      key: 'address',
      label: (
        <FormattedMessage
          id="instance.table.ConsoleEntry"
          defaultMessage="控制台入口"
        />
      ),
      children: (
        <Typography.Text
          copyable={{ text: `${profile?.address}:${profile?.consolePort}` }}
        >
          {profile?.address}:{profile?.consolePort}
        </Typography.Text>
      ),
    },
    {
      key: 'protocolPorts',
      label: (
        <FormattedMessage
          id="instance.table.OperationEntry"
          defaultMessage="运维入口"
        />
      ),
      children: (
        <>
          <Typography.Text
            copyable={{ text: profile?.operationAddress || '' }}
            ellipsis={true}
          >
            {profile?.operationAddress || ''}
          </Typography.Text>
          <br />
          {profile?.protocolPorts
            .filter((port1: InstanceProtocol) => port1.protocolName != 'web')
            .map((port: any) => {
              return (
                <Tag
                  key={port.protocolName}
                >{`${port.protocolName}: ${port.port}`}</Tag>
              );
            })}
        </>
      ),
    },
    {
      key: 'createAt',
      label: (
        <FormattedMessage
          id="instance.table.CreateTime"
          defaultMessage="创建时间"
        />
      ),
      children: formatTimestamp(profile?.createAt),
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
        <>
          <Badge
            status={stateMap[profile?.status]}
            text={parseStatus(profile?.status)}
          ></Badge>
        </>
      ),
    },
    {
      key: 'runningNodes',
      label: (
        <FormattedMessage
          id="instance.table.RunningNodes"
          defaultMessage="运行节点"
        />
      ),
      span: 2,
      children: (
        <ul style={{ paddingInlineStart: 10 }}>
          {profile?.runningNodes.map((node: InstanceRunningNode) => {
            return (
              <li key={node.address}>
                {node.address}: &nbsp; &nbsp;
                <Badge
                  status={NodeStateMap[node.status]}
                  text={parseStatus(node?.status)}
                />
              </li>
            );
          })}
        </ul>
      ),
    },
    {
      key: 'volumes',
      label: (
        <FormattedMessage
          id="instance.table.MountVolumes"
          defaultMessage="挂载文件"
        />
      ),
      span: 2,
      children: (
        <>
          {profile?.volumes.map((volume: InstanceVolume) => {
            return (
              <React.Fragment key={volume.path}>
                <Tag
                  key={volume.driverName}
                >{`${volume.driverName}: ${volume.path}`}</Tag>
                <br />
              </React.Fragment>
            );
          })}
        </>
      ),
    },
    {
      key: 'LicenseConfig',
      label: (
        <FormattedMessage
          id="instance.table.LicenseConfig"
          defaultMessage="规格配置"
        />
      ),
      span: 2,
      children: (
        <>
          {/* <Row>
            <FormattedMessage id="instance.table.MaxHostCount" defaultMessage="最大主机数" />
            :&nbsp;
            <Typography.Text strong={true}> {LicenseConfig.maxHostNum || 0}</Typography.Text>
          </Row>
          <Row>
            <FormattedMessage id="instance.table.MaxConcurrencyCount" defaultMessage="最大并发数" />
            :&nbsp;
            <Typography.Text strong={true}>{LicenseConfig.maxConcurrencyNum || 0}</Typography.Text>
          </Row> */}
          <Row>
            <FormattedMessage
              id="instance.table.LicenseSpecification"
              defaultMessage="规格描述"
            />
            :&nbsp;
            <Typography.Text strong={true}>
              {LicenseConfig.specDescription}
            </Typography.Text>
          </Row>
          <Row>
            <FormattedMessage
              id="instance.table.ExpireTime"
              defaultMessage="过期时间"
            />
            :&nbsp;
            <Typography.Text strong={true}>
              {formatTimestamp(LicenseConfig.expireAt)}
            </Typography.Text>
          </Row>
        </>
      ),
    },
    {
      key: 'ResourceLimit',
      label: (
        <FormattedMessage
          id="instance.table.ResourceLimit"
          defaultMessage="资源配额"
        />
      ),
      span: 2,
      children: (
        <>
          CPU:&nbsp;
          <Progress
            style={{ width: '60%' }}
            percent={100}
            format={() => {
              return <span>{`CPU: ${ResourceLimit.cpu || 0}%`}</span>;
            }}
          />
          <br />
          <FormattedMessage id="instance.table.Memory" defaultMessage="内存" />
          :&nbsp;
          <Progress
            style={{ width: '60%' }}
            percent={100}
            format={() => {
              return <span>{`MEM: ${ResourceLimit.memory || 0}MB`}</span>;
            }}
          />
          <br />
          <FormattedMessage
            id="instance.table.diskSize"
            defaultMessage="数据盘"
          />
          :&nbsp;
          <Progress
            style={{ width: '60%' }}
            percent={100}
            format={() => {
              return <span>{`DISK: ${ResourceLimit.diskSize || 0}MB`}</span>;
            }}
          />
        </>
      ),
    },
  ];

  const SpecificationChangeLable = (
    <FormattedMessage
      id="instance.form.SpecificationChange"
      defaultMessage="实例变配"
    />
  );

  function handleClose(en: any) {
    if (onClose) {
      onClose(null);
    }
  }

  function OpenSpecificationChangeModel() {
    SetSpecificationChangeVisible(true);
  }

  function CloseSpecificationChangeModel() {
    SetSpecificationChangeVisible(false);
    // handleClose(null);
  }

  function OpenExtendSizeModel() {
    setExtendInstanceSizeVisible(true);
  }

  function CloseExtendSizeModel() {
    setExtendInstanceSizeVisible(false);
    // handleClose(null);
  }

  function RemoveInstance(ev: any) {
    const Ids = [profile?.id || ''];

    Modal.confirm({
      title: (
        <FormattedMessage
          id="instance.table.releaseInstanceMsg"
          defaultMessage="您确认释放该实例吗？"
        />
      ),
      cancelText: (
        <FormattedMessage id="common.modalcancel" defaultMessage="取消" />
      ),
      okText: <FormattedMessage id="common.modalok" defaultMessage="确定" />,
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'instance/RemoveInstances',
          payload: {
            Ids,
          },
        }).then(() => {
          handleClose(ev);
        });
      },
    });
  }

  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Space>
            <Button onClick={OpenSpecificationChangeModel}>
              {SpecificationChangeLable}
            </Button>
            <Button onClick={OpenExtendSizeModel}>
              <FormattedMessage
                id="instance.table.FixBtn"
                defaultMessage="磁盘扩容"
              />
            </Button>
            <Button onClick={RemoveInstance} danger>
              <FormattedMessage
                id="instance.table.DeleteInstance"
                defaultMessage="删除实例"
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
        <Tabs.TabPane key="chart" tab={intl.formatMessage(intlMessages.chart)}>
          <ChartIndexPanel InstanceId={profile.id} />
        </Tabs.TabPane>
      </Tabs>

      {SpecificationChangeVisible && (
        <SpecificationChange
          visible={SpecificationChangeVisible}
          profile={profile}
          title={SpecificationChangeLable}
          onCancel={CloseSpecificationChangeModel}
        />
      )}
      {extendInstanceSizeVisible && (
        <ExtendInstanceSize
          visible={extendInstanceSizeVisible}
          InstanceId={profile?.id}
          onCancel={CloseExtendSizeModel}
        />
      )}
    </>
  );
}
