import React, { useState } from 'react';
import { BasicTable, IColumnType } from '@/components/table/BasicTable';
import {
  OperationLogRecord,
  OperationLog,
  OperationLogSearchParams,
} from '../type.d';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import Text from '@/components/text';
import { formatLoacleTimestamp } from '@/utils/date';
import { stringSlice } from '@/utils/string';
import Pagination from '@/components/pagination';

type ParamType = Partial<OperationLogSearchParams>;

interface IOperationLogsTableProps {
  OperationLogsRecord: OperationLogRecord;
  RefreshPage: (pageNumber: number, pageSize: number) => void;
  loading: boolean;
  PageNumber: number;
  PageSize: number;
}

const intlMessages = defineMessages({
  Success: {
    id: 'log.form.Success',
    defaultMessage: '成功',
  },
  Fail: {
    id: 'log.form.Fail',
    defaultMessage: '失败',
  },
});
export function OperationLogsTable(props: IOperationLogsTableProps) {
  const {
    OperationLogsRecord,
    loading,
    PageNumber,
    PageSize,
    RefreshPage,
  } = props;
  const Intl = useIntl();

  const columns: IColumnType<OperationLog>[] = [
    {
      title: (
        <FormattedMessage id="log.table.operateAt" defaultMessage="时间" />
      ),
      key: 'operateAt',
      render: (text: number, record: OperationLog) => {
        return (
          <Text title={formatLoacleTimestamp(text)}>
            {formatLoacleTimestamp(text)}
          </Text>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="log.table.operatorName" defaultMessage="用户" />
      ),
      key: 'operatorName',
      render: (text: string, record: OperationLog) => {
        return <Text title={text}>{stringSlice(text)}</Text>;
      },
    },
    {
      title: <FormattedMessage id="log.table.actionId" defaultMessage="操作" />,
      key: 'actionId',
      render: (text: string, record: OperationLog) => {
        return <Text title={text}>{stringSlice(text, 15)}</Text>;
      },
    },
    {
      title: <FormattedMessage id="log.table.detail" defaultMessage="内容" />,
      key: 'detail',
      render: (text: string, record: OperationLog) => {
        return <Text title={text}>{stringSlice(text, 25)}</Text>;
      },
    },
    {
      title: <FormattedMessage id="log.table.result" defaultMessage="结果" />,
      key: 'result',
      render: (text: number, record: OperationLog) => {
        return text === 1 ? (
          <Text title={Intl.formatMessage(intlMessages.Success)}>
            {Intl.formatMessage(intlMessages.Success)}
          </Text>
        ) : (
          <Text title={Intl.formatMessage(intlMessages.Fail)}>
            {Intl.formatMessage(intlMessages.Fail)}
          </Text>
        );
      },
    },
    {
      title: <FormattedMessage id="log.table.sourceIp" defaultMessage="来源" />,
      key: 'sourceIp',
      render: (text: string, record: OperationLog) => {
        return <Text title={text}>{stringSlice(text)}</Text>;
      },
    },
  ];
  const onPageChange = (pageNumber: number = 1, pageSize: number = 20) => {
    RefreshPage(pageNumber, pageSize);
  };

  return (
    <>
      <BasicTable<OperationLog>
        columns={columns}
        rowKey="id"
        dataSource={OperationLogsRecord?.operateLogs ?? []}
        loading={loading}
        showHeader={false}
        compact
      />
      <div className="pagination-position">
        {OperationLogsRecord && (
          <Pagination
            current={PageNumber}
            pageSize={PageSize}
            total={OperationLogsRecord.count ?? 0}
            simple={true}
            onChange={onPageChange}
          />
        )}
      </div>
    </>
  );
}
