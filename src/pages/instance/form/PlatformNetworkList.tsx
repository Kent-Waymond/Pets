import React, { useEffect, useState } from 'react';
import Select, { SelectProps } from 'antd/lib/select';
import { useDispatch } from 'umi';
import { IPlatformNetworkRecord } from '@/type';
import { EnumNetworkTypes } from '@/variable';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';

interface IPlatformNetworkListProps extends SelectProps<any> {}

function useFetchNetworkList() {
  const dispatch = useDispatch<any>();
  const [NetworkList, ChangeNetworkList] = useState<IPlatformNetworkRecord[]>(
    [],
  );
  const [loading, ChangeLoading] = useState<boolean>(false);

  useEffect(() => {
    ChangeLoading(true);

    dispatch({
      type: 'global/ListPlatformNetworks',
    }).then((networks: IPlatformNetworkRecord[]) => {
      ChangeNetworkList(networks);
      ChangeLoading(false);
    });
  }, [dispatch]);

  return [loading, NetworkList];
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  autoport: {
    id: 'instance.network.autoport',
    defaultMessage: '自动分配端口',
  },
});

const ExclusiveNetworkTypeMap = {
  [EnumNetworkTypes.macvlan]: 'MACVLAN',
  [EnumNetworkTypes.ipvlan]: 'IPVLAN',
};
export function PlatformNetworkList(props: IPlatformNetworkListProps) {
  const { ...restProps } = props;
  const intl = useIntl();

  const [loading, NetworkList] = useFetchNetworkList();
  return (
    <Select loading={loading as boolean} {...restProps}>
      {(NetworkList as IPlatformNetworkRecord[]).map(
        (network: IPlatformNetworkRecord) => {
          const networkId = network?.id || '';
          const networkType = network?.type || '';
          const networkName = network?.name || '';
          const value = `${networkType}$${networkId}`;
          return (
            <Select.Option key={networkId} value={value}>
              {networkType === EnumNetworkTypes.autoport &&
                `[${intl.formatMessage(intlMessages.autoport)}] ${networkName}`}
              {networkType !== EnumNetworkTypes.autoport &&
                `[${ExclusiveNetworkTypeMap[networkType]}] ${networkName}`}
            </Select.Option>
          );
        },
      )}
    </Select>
  );
}
