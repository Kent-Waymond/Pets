import React, { useState } from 'react';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import { Button, Drawer, Form } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import { VaccineForm } from '../form/VaccineForm';
import { VaccineRecord } from '../type';

interface IVaccineProfilePanelProps extends DrawerProps {
  VaccineProfile: VaccineRecord | null;
  visible: boolean;
  onClose: (ev: any) => void;
}

export default function VaccineProfilePanel(props: IVaccineProfilePanelProps) {
  const { visible, VaccineProfile, onClose } = props;
  const dispatch = useDispatch<any>();
  const [UpdateVaccineLoading, ChangeUpdateVaccineLoading] = useState<boolean>(
    false,
  );
  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleUpdateVaccine(ev: any) {
    form.submit();
  }

  function onFormFinish(formvalues: any) {
    console.log(formvalues, 'update');

    ChangeUpdateVaccineLoading(true);
    dispatch({
      type: 'network/ModifyVaccine',
      payload: {
        vaccineId: VaccineProfile?.vaccineId,
        vaccineName: VaccineProfile?.vaccineName,
      },
    }).then(() => {
      handleDrawerClose(undefined);
      ChangeUpdateVaccineLoading(false);
    });
  }

  const drawerFooter = (
    <Button type="primary" onClick={handleUpdateVaccine}>
      更新疫苗
    </Button>
  );
  return (
    <Drawer
      title="疫苗详情"
      visible={visible}
      onClose={handleDrawerClose}
      // footer={drawerFooter}
      width={500}
    >
      <BasicForm
        loading={UpdateVaccineLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <VaccineForm
          form={form}
          type="update"
          onFormFinish={onFormFinish}
          VaccineProfile={VaccineProfile ?? null}
        />
      </BasicForm>
    </Drawer>
  );
}
