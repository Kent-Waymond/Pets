import React, { useCallback, useEffect, useState } from 'react';
import { OperationLogsTable } from './components/OperationLogsTable';
import { OperationLogForm } from './components/OperationLogForm';
import { FormattedMessage, useDispatch, useSelector } from 'umi';
import { useForm } from 'antd/lib/form/Form';
import { OperationLogRecord, OperationLogSearchForm } from './type.d';
import Card, { CardBody, CardHeader } from '@/components/card';

export default function () {
  const [form] = useForm();
  const dispatch = useDispatch();
  const [pageNumber, ChangePageNumber] = useState<number>(1);
  const [pageSize, ChangePageSize] = useState<number>(20);
  const defaultFormParams = {
    startTime: 0,
    endTime: 0,
    actionType: '',
    result: 0,
    keywords: '',
  };
  const [FormParams, ChangeFormParams] = useState<OperationLogSearchForm>(
    defaultFormParams,
  );

  const RefreshOperationLogs = useCallback(
    (params?: any) => {
      dispatch({
        type: 'log/ListOperateLogs',
        payload: {
          ...params,
        },
      });
    },
    [dispatch],
  );

  const RefreshPage = (newPageNumber: number, newPageSize: number) => {
    // console.log(pageNumber,newPageNumber)
    if (pageNumber !== newPageNumber || pageSize !== newPageSize) {
      ChangePageNumber(newPageNumber);
      ChangePageSize(newPageSize);
      RefreshOperationLogs({
        pageNumber: newPageNumber,
        pageSize: newPageSize,
        ...FormParams,
      });
    }
  };

  function HandleSearch(formparams: OperationLogSearchForm) {
    // console.log("22 ", formparams)
    ChangeFormParams(formparams);
    ChangePageNumber(1);
    ChangePageSize(20);

    RefreshOperationLogs({
      pageNumber: 1,
      pageSize: 20,
      ...formparams,
    });
  }

  useEffect(() => {
    RefreshOperationLogs({ pageNumber: 1, pageSize: 20 });
  }, [RefreshOperationLogs]);

  const OperationLogsRecord: OperationLogRecord = useSelector(
    (state: any) => state.log.OperationLogsRecord,
  );
  const ListOperationLogsLoading: boolean = useSelector(
    (state: any) => state.loading.effects['log/ListOperateLogs'],
  );

  return (
    <>
      <Card bordered>
        <CardHeader
          title={
            <FormattedMessage
              id="settings.menu.log"
              defaultMessage="操作日志"
            />
          }
        />
        <CardBody>
          <OperationLogForm form={form} HandleSearch={HandleSearch} />

          <OperationLogsTable
            OperationLogsRecord={OperationLogsRecord}
            RefreshPage={RefreshPage}
            loading={ListOperationLogsLoading}
            PageNumber={pageNumber}
            PageSize={pageSize}
          />
        </CardBody>
      </Card>
    </>
  );
}
