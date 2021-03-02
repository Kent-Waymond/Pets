import React from 'react';
import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib/descriptions';
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item';

export interface IBasiccDescriptionsItem<T> extends DescriptionsItemProps {
  key: Exclude<keyof T, symbol>;
}

interface IBasicDescriptionsProps<T> extends DescriptionsProps {
  profileItems: IBasiccDescriptionsItem<T>[];
}

export function ProfileDescriptions(props: IBasicDescriptionsProps<any>) {
  const { profileItems, ...restProps } = props;
  if (profileItems instanceof Array) {
    return (
      <Descriptions {...restProps}>
        {profileItems.map((item: IBasiccDescriptionsItem<any>) => {
          const { key, ...restProps } = item;
          return (
            <Descriptions.Item
              key={key}
              {...restProps}
              style={{ maxWidth: '500px', overflow: 'auto' }}
            />
          );
        })}
      </Descriptions>
    );
  } else {
    return null;
  }
}
