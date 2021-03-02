import { Empty } from 'antd';
import React from 'react';
import { FormattedDate, FormattedMessage } from 'umi';
import Spin from '../spin';
import { Table } from './Table';
import { TableBody } from './TableBody';
import { TableCell } from './TableCell';
import { TableHead } from './TableHead';
import { TableRow } from './TableRow';

export interface IBasicTableProps<T> {
  columns: IColumnType<T>[];
  rowKey: string;
  dataSource: T[];
  loading?: boolean;
  showHeader?: boolean;
  compact?: boolean;
  emptyText?: React.ReactNode;
}

export interface IColumnType<T> {
  key: string;
  title?: React.ReactNode;
  dataIndex?: string;
  className?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export function BasicTable<T>(props: IBasicTableProps<T>) {
  const {
    columns,
    rowKey,
    dataSource,
    showHeader,
    compact,
    emptyText,
    loading,
  } = props;

  return (
    <Spin spinning={loading ?? false}>
      <Table showHeader={showHeader} compact={compact}>
        <TableHead>
          <TableRow>
            {columns.map((column: IColumnType<T>) => {
              return (
                <TableCell key={column.key} cellType="head">
                  {column.title ?? ''}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {(!dataSource || dataSource.length === 0) && (
            <tr>
              <td
                colSpan={columns?.length || 1}
                style={{ textAlign: 'center' }}
              >
                {emptyText || (
                  <FormattedMessage
                    id="table.text.emptyText"
                    defaultMessage="暂无数据"
                  />
                )}
              </td>
            </tr>
          )}
          {dataSource &&
            dataSource.map((item: T, index: number) => {
              return (
                <TableRow key={(item as any)[rowKey]}>
                  {columns.map((column: IColumnType<T>) => {
                    const { key, dataIndex, className, render } = column;
                    const value = dataIndex
                      ? (item as any)[dataIndex]
                      : (item as any)[key];
                    return (
                      <TableCell className={className} key={column.key}>
                        {render ? render(value, item, index) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Spin>
  );
}
