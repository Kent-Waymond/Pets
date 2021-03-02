import React from 'react';
import { Badge } from 'antd';
import styles from './chart.less';

interface CharToolTipItem {
  color: string;
  name: string;
  value: string | number;
  extraName?: string;
  extra?: string | number;
}

interface ICharToolTipProps {
  title: string | React.ReactNode;
  items?: CharToolTipItem[];
}

export function CharToolTip(props: ICharToolTipProps) {
  const { title, items } = props;
  return (
    <div className={styles.tooltip}>
      <div className={styles.title}>{title}</div>

      <ul className={styles.itemContainer}>
        {items &&
          items.map((item: CharToolTipItem) => {
            return (
              <li key={item.name} className={styles.item}>
                <span>
                  <Badge color={item.color} />
                </span>
                <span className={styles.label}>{item.name}</span>
                &nbsp; &nbsp;
                <span className={styles.label}>{item.value}</span>
                {item.extraName && (
                  <>
                    &nbsp;
                    <span className={styles.extra}>
                      ({`${item.extraName}: ${item.extra}`})
                    </span>
                  </>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
