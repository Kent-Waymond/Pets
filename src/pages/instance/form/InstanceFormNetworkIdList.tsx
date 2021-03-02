import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { NetworkRecord } from '@/pages/network/type.d';
import { useDispatch } from 'umi';
import { IBHRawListDataRecord } from '@/type';
import { SelectProps } from 'antd/lib/select';

interface InstanceFormNetworkIdListProps extends SelectProps<any> {}

function useFetchNetworkLists(): {
  data: NetworkRecord[];
  loading: boolean;
} {
  const [NetworkLists, ChangeNetworkLists] = useState<NetworkRecord[]>([]);
  const [loading, ChangeLoading] = useState<boolean>(true);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch({
      type: 'network/ListNetworks',
      payload: {
        ListAll: true,
      },
    })
      .then((network: IBHRawListDataRecord<NetworkRecord> | null) => {
        if (network) {
          const { networks } = network;
          if (networks instanceof Array) {
            ChangeNetworkLists(networks);
          }
        } else {
          ChangeNetworkLists([]);
        }
      })
      .finally(() => {
        ChangeLoading(false);
      });
  }, [dispatch]);

  return {
    data: NetworkLists,
    loading,
  };
}

export function InstanceFormNetworkIdList(
  props: InstanceFormNetworkIdListProps,
) {
  const {
    data: NetworkLists,
    loading: NetworkLoading,
  } = useFetchNetworkLists();
  return (
    <Select loading={NetworkLoading} showArrow={false} {...props}>
      {NetworkLists.length > 0 &&
        NetworkLists.map((network: NetworkRecord) => {
          return (
            <Select.Option value={network.id} key={network.id}>
              {network.name}
            </Select.Option>
          );
        })}
    </Select>
  );
}
