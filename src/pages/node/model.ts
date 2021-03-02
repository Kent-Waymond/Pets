import { IBHRawListDataRecord } from '@/type';
import { Effect, formatMessage, Subscription } from 'umi';
import { INodeRecord } from './type.d';
import * as Service from '@/request/host';
import { InstanceRecord } from '../instance/type';
import { defineMessages } from 'react-intl';
import { message } from 'antd';

interface INodeModelType {
  namespace: 'node';
  state?: INodeModelStates;
  reducers?: INodeModelReducers;
  effects?: INodeModelEffects;
  subscriptions?: { setup: Subscription };
}

interface INodeModelStates {
  Nodes: IBHRawListDataRecord<INodeRecord> | null;
  InstanceForNodes: IBHRawListDataRecord<InstanceRecord> | null;
}

interface INodeModelReducers {
  updateNodes: Reducer<INodeModelStates, any>;
  updateInstanceForNode: Reducer<INodeModelStates, any>;
}

interface INodeModelEffects {
  ListNodes: Effect;
  ListAllNodes: Effect;
  ListInstancesOnNode: Effect;
  GetHostInfo: Effect;
  CreateNode: Effect;
  GetCreateNodeProgress: Effect;
  RemoveNode: Effect;
  AttachNetwork: Effect;
  ListEthernetPorts: Effect;
  ListUnattachedEthernetPorts: Effect;
  CreateNetworkBond: Effect;
  RemoveNetworkBond: Effect;
  UpdateEthernetPortState: Effect;
  UpdateEthernetPortIP: Effect;
  RemarkEthernetPort: Effect;
  ConfigDataDisk: Effect;
  CreateVLAN: Effect;
}

const intlMessages = defineMessages({
  CreateNodeErr: {
    id: 'mode.node.CreateNodeErr',
    defaultMessage: '创建节点失败{reason}',
  },
  RemoveNodeOk: {
    id: 'mode.node.RemoveNodeOk',
    defaultMessage: '删除节点成功',
  },
  RemoveNodeErr: {
    id: 'mode.node.RemoveNodeErr',
    defaultMessage: '删除节点失败{reason}',
  },
  AttachNetworkOk: {
    id: 'mode.node.AttachNetworkOk',
    defaultMessage: '节点关联网络成功',
  },
  AttachNetworkErr: {
    id: 'mode.node.AttachNetworkErr',
    defaultMessage: '节点关联网络失败{reason}',
  },
  CreateNetworkBondOk: {
    id: 'mode.node.CreateNetworkBondOk',
    defaultMessage: '节点创建链路聚合成功',
  },
  CreateNetworkBondErr: {
    id: 'mode.node.CreateNetworkBondErr',
    defaultMessage: '节点创建链路聚合失败{reason}',
  },
  ConfigDataDiskOk: {
    id: 'mode.node.ConfigDataDiskOk',
    defaultMessage: '节点配置主机数据盘成功',
  },
  ConfigDataDiskErr: {
    id: 'mode.node.ConfigDataDiskErr',
    defaultMessage: '节点配置主机数据盘失败{reason}',
  },
  CreateVLANOk: {
    id: 'mode.node.CreateVLANOk',
    defaultMessage: '节点创建VLAN成功',
  },
  CreateVLANErr: {
    id: 'mode.node.CreateVLANErr',
    defaultMessage: '节点创建VLAN失败{reason}',
  },
  RemoveNetworkBondOk: {
    id: 'mode.node.RemoveNetworkBondOk',
    defaultMessage: '删除链路聚合成功',
  },
  RemoveNetworkBondErr: {
    id: 'mode.node.RemoveNetworkBondErr',
    defaultMessage: '删除链路聚合失败{reason}',
  },
  UpdateEthernetPortStateSuccess: {
    id: 'mode.node.UpdateEthernetPortStateSuccess',
    defaultMessage: '更新主机网口状态成功',
  },
  UpdateEthernetPortStateFail: {
    id: 'mode.node.UpdateEthernetPortStateFail',
    defaultMessage: '更新主机网口状态失败',
  },
  UpdateEthernetPortIpSuccess: {
    id: 'mode.node.UpdateEthernetPortIpSuccess',
    defaultMessage: '更新主机网口IP成功',
  },
  UpdateEthernetPortIpFail: {
    id: 'mode.node.UpdateEthernetPortIpFail',
    defaultMessage: '更新主机网口IP失败',
  },
  RemarkEthernetPortSuccess: {
    id: 'mode.node.RemarkEthernetPortSuccess',
    defaultMessage: '标记主机网口成功',
  },
  RemarkEthernetPortFail: {
    id: 'mode.node.RemarkEthernetPortFail',
    defaultMessage: '标记主机网口失败',
  },
});

const Model: INodeModelType = {
  namespace: 'node',
  state: {
    Nodes: null,
    InstanceForNodes: null,
  },
  reducers: {
    updateNodes: (state: INodeModelStates, { payload }): INodeModelStates => {
      const { Nodes } = payload;
      return {
        ...state,
        Nodes,
      };
    },
    updateInstanceForNode: (
      state: INodeModelStates,
      { payload },
    ): INodeModelStates => {
      const { InstanceForNodes } = payload;
      return {
        ...state,
        InstanceForNodes,
      };
    },
  },
  effects: {
    *ListNodes(
      { payload: { Keyword, PageNumber, PageSize, OrderFields } },
      { call, put },
    ) {
      const response = yield call(Service.ListHosts, {
        Keyword,
        PageNumber,
        PageSize,
        OrderFields,
      });

      yield put({
        type: 'updateNodes',
        payload: {
          Nodes: response?.data?.data || null,
        },
      });
    },
    *ListAllNodes({}, { call, put }) {
      const response = yield call(Service.ListHosts, { ListAll: true });

      const AllNodes = response?.data?.data || null;

      return AllNodes;
    },
    *ListInstancesOnNode(
      { payload: { NodeId, Keyword, PageNumber, PageSize, OrderFields } },
      { call, put },
    ) {
      const response = yield call(Service.ListInstancesOnNode, {
        NodeId,
        Keyword,
        PageNumber,
        PageSize,
        OrderFields,
      });
      yield put({
        type: 'updateInstanceForNode',
        payload: {
          InstanceForNodes: response?.data?.data || null,
        },
      });
    },
    *GetHostInfo({ payload: { NodeId } }, { call, put }) {
      const response = yield call(Service.GetHostInfo, { NodeId });
      const profile = response?.data?.data?.host || null;
      return profile;
    },
    *CreateNode(
      {
        payload: {
          name,
          address,
          sshPort,
          accountName,
          accountPassword,
          accountPrivatekey,
          accountPrivatekeyPass,
        },
      },
      { call, put },
    ) {
      const response = yield call(Service.CreateHost, {
        name,
        address,
        sshPort,
        accountName,
        accountPassword,
        accountPrivatekey,
        accountPrivatekeyPass,
      });
      const nodeId = response?.data?.data?.id || null;
      if (nodeId == null) {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateNodeErr, { reason: errMsg }),
        );
      }
      return nodeId;
    },
    *GetCreateNodeProgress({ payload: { id } }, { call, put }) {
      const response = yield call(Service.getCreateProgress, { id });
      return response?.data?.data?.object || null;
    },
    *RemoveNode({ payload: { id } }, { call }) {
      const response = yield call(Service.RemoveHost, { id });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.RemoveNodeOk));
      } else {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.RemoveNodeErr, { reason: errMsg }),
        );
      }
      return;
    },
    *AttachNetwork(
      { payload: { hostId, networkId, ethernetPort, vlanId } },
      { call },
    ) {
      const response = yield call(Service.AttachNetwork, {
        hostId,
        networkId,
        ethernetPort,
        vlanId,
      });
      let result = false;
      if (response.data?.code == '200') {
        result = true;
        message.success(formatMessage(intlMessages.AttachNetworkOk));
      } else {
        result = false;
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.AttachNetworkErr, { reason: errMsg }),
        );
      }
      return result;
    },
    *ListEthernetPorts({ payload: { hostId } }, { call }) {
      const response = yield call(Service.ListEthernetPorts, { hostId });
      let ethernetPorts = response?.data?.data?.ethernetPorts;
      ethernetPorts = ethernetPorts instanceof Array ? ethernetPorts : [];
      return ethernetPorts;
    },
    *ListUnattachedEthernetPorts({ payload: { hostId } }, { call }) {
      const response = yield call(Service.ListUnattachedEthernetPorts, {
        hostId,
      });
      let ethernetPorts = response?.data?.data?.ethernetPorts;
      ethernetPorts = ethernetPorts instanceof Array ? ethernetPorts : [];
      return ethernetPorts;
    },
    *CreateNetworkBond({ payload: { id, name, mode, slave } }, { call }) {
      const response = yield call(Service.CreateNetworkBond, {
        id,
        name,
        mode,
        slave,
      });
      // console.log(response, 'res');
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.CreateNetworkBondOk));
      } else {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateNetworkBondErr, { reason: errMsg }),
        );
      }
      return;
    },
    *RemoveNetworkBond({ payload: { id, name } }, { call }) {
      const response = yield call(Service.RemoveNetworkBond, { id, name });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.RemoveNetworkBondOk));
      } else {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.RemoveNetworkBondErr, { reason: errMsg }),
        );
      }
      return;
    },
    *UpdateEthernetPortState(
      { payload: { NodeId, ethernetPort, state } },
      { call },
    ) {
      const response = yield call(Service.UpdateEthernetPortState, {
        NodeId,
        ethernetPort,
        state,
      });
      if (response.data?.code == '200') {
        message.success(
          formatMessage(intlMessages.UpdateEthernetPortStateSuccess),
        );
      } else {
        message.error(formatMessage(intlMessages.UpdateEthernetPortStateFail));
      }
      return;
    },
    *UpdateEthernetPortIP(
      { payload: { NodeId, ethernetPort, ip, mask } },
      { call },
    ) {
      const response = yield call(Service.UpdateEthernetPortIP, {
        NodeId,
        ethernetPort,
        ip,
        mask,
      });
      if (response.data?.code == '200') {
        message.success(
          formatMessage(intlMessages.UpdateEthernetPortIpSuccess),
        );
      } else {
        message.error(formatMessage(intlMessages.UpdateEthernetPortIpFail));
      }
      return;
    },
    *RemarkEthernetPort(
      { payload: { NodeId, ethernetPort, remark } },
      { call },
    ) {
      const response = yield call(Service.RemarkEthernetPort, {
        NodeId,
        ethernetPort,
        remark,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.RemarkEthernetPortSuccess));
      } else {
        message.error(formatMessage(intlMessages.RemarkEthernetPortFail));
      }
      return;
    },
    *ConfigDataDisk(
      { payload: { mountPoint, hostId, diskName, comment, filesystem } },
      { call },
    ) {
      const response = yield call(Service.ConfigDataDisk, {
        mountPoint,
        hostId,
        diskName,
        comment,
        filesystem,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.ConfigDataDiskOk));
      } else {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.ConfigDataDiskErr, { reason: errMsg }),
        );
      }
      return;
    },
    *CreateVLAN(
      { payload: { hostId, ethernetPort, vlanId, vlanName } },
      { call },
    ) {
      const response = yield call(Service.CreateVLAN, {
        hostId,
        ethernetPort,
        vlanId,
        vlanName,
      });
      if (response.data?.code == '200') {
        message.success(formatMessage(intlMessages.CreateVLANOk));
      } else {
        const errMsg = response?.data?.message
          ? ', ' + response.data.message
          : '';
        message.error(
          formatMessage(intlMessages.CreateVLANErr, { reason: errMsg }),
        );
      }
      return;
    },
  },
};

export default Model;
