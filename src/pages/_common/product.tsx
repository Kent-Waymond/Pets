import React from 'react';
import { SupportProductType } from '@/type';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { EnumSupportProducts } from '@/variable';
import Avatar from '@/components/avatar';
import {
  SecurityScanTwoTone,
  RocketTwoTone,
  CrownTwoTone,
} from '@ant-design/icons';

export interface CommonProductItemInfo {
  name: SupportProductType;
  label: MessageDescriptor;
  unit: MessageDescriptor;
  icon: React.ReactNode;
  description: React.ReactNode;
}

const intlMessages = defineMessages<
  MessageDescriptor,
  Record<string, MessageDescriptor>
>({
  USM: {
    id: 'common.product.USM',
    defaultMessage: '堡垒机',
  },
  WAF: {
    id: 'common.product.WAF',
    defaultMessage: 'Web应用防火墙',
  },
  NGFW: {
    id: 'common.product.NGFW',
    defaultMessage: '下一代防火墙',
  },
  Assets: {
    id: 'common.text.Assets',
    defaultMessage: '资产',
  },
  Sites: {
    id: 'common.text.Sites',
    defaultMessage: '站点',
  },
  Instances: {
    id: 'common.text.Instances',
    defaultMessage: '实例',
  },
});

export const CommonProductItemMap: {
  [key in EnumSupportProducts]: CommonProductItemInfo;
} = {
  [EnumSupportProducts.USM]: {
    name: 'USM',
    label: intlMessages.USM,
    unit: intlMessages.Assets,
    icon: (
      <Avatar status="info">
        <SecurityScanTwoTone twoToneColor="#8950fc" />
      </Avatar>
    ),
    description: (
      <FormattedMessage
        id="common.product.desc.USM"
        defaultMessage="明御®运维审计与风险控制系统"
      />
    ),
  },
  [EnumSupportProducts.WAF]: {
    name: 'WAF',
    label: intlMessages.WAF,
    unit: intlMessages.Sites,
    icon: (
      <Avatar status="success">
        <RocketTwoTone twoToneColor="#1bc5bd" />
      </Avatar>
    ),
    description: (
      <FormattedMessage
        id="common.product.desc.WAF"
        defaultMessage="明御®Web应用防火墙"
      />
    ),
  },
  [EnumSupportProducts.NGFW]: {
    name: 'NGFW',
    label: intlMessages.NGFW,
    unit: intlMessages.Instances,
    icon: (
      <Avatar status="warning">
        <CrownTwoTone twoToneColor="#ffa800" />
      </Avatar>
    ),
    description: (
      <FormattedMessage
        id="common.product.desc.NGFW"
        defaultMessage="明御®安全网关"
      />
    ),
  },
};
