import React, { useCallback, useEffect, useState } from 'react';
import { NetworkTable } from './table/NetworkTable';
import { useDispatch, useSelector } from 'umi';
import { FormattedMessage } from 'react-intl';
import { NetworkRecord } from './type.d';
import Grid, { Row } from '@/components/grid';
import CreateNetworkPanel from './form/CreateNetworkPanel';
import { IBHRawListDataRecord } from '@/type';
import Card, { CardBody, CardHeader } from '@/components/card';
import Button from '@/components/button';

export default function () {
  const dispatch = useDispatch();
  const [CreateNetworkPanelVisible, ChangeCreateNetworkPanelVisible] = useState(
    false,
  );
  const RefreshNetworks = useCallback(
    (params?: any) => {
      dispatch({
        type: 'network/ListNetworks',
        payload: {
          Keyword: '',
          PageNumber: 1,
          PageSize: 20,
          ...params,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    RefreshNetworks();
  }, [RefreshNetworks]);

  const NetworkRecord: IBHRawListDataRecord<NetworkRecord> = useSelector(
    (state: any) => state.network.NetworkRecord,
  );
  const ListNetworksLoading: boolean = useSelector(
    (state: any) => state.loading.effects['network/ListNetworks'],
  );
  const OpenCreateNetworkPanel = () => {
    ChangeCreateNetworkPanelVisible(true);
  };
  const CloseCreateNetworkPanel = () => {
    ChangeCreateNetworkPanelVisible(false);
    RefreshNetworks();
  };

  return (
    <Card bordered>
      <CardHeader
        title={
          <FormattedMessage
            id="settings.menu.network"
            defaultMessage="网络管理"
          />
        }
        action={
          <Button type="primary" onClick={OpenCreateNetworkPanel}>
            <FormattedMessage
              id="network.table.CreateNetwork"
              defaultMessage="创建网络"
            />
          </Button>
        }
      />
      <CardBody>
        <NetworkTable
          NetworkRecord={NetworkRecord?.networks ?? []}
          TotalCount={Number(NetworkRecord?.count) ?? 0}
          RefreshNetworks={RefreshNetworks}
          loading={ListNetworksLoading}
        />
        {CreateNetworkPanelVisible && (
          <CreateNetworkPanel
            visible={CreateNetworkPanelVisible}
            onClose={CloseCreateNetworkPanel}
          />
        )}
      </CardBody>
    </Card>
  );
}
