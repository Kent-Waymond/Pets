import React, { useState } from 'react';
import { Form, Drawer, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import CreateProgress from '@/components-compatible/Progress/CreateProgress';
import { VaccineForm } from './VaccineForm';

interface ICreateVaccinePanelProps extends DrawerProps {}

function CreateVaccinePanel(props: ICreateVaccinePanelProps) {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function handleAddVaccine(ev: any) {
    // ev.preventDefault();
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    // console.log('values ', formvalues);
    ChangeCreateLoaidng(true);

    const id = await dispatch({
      type: 'vaccine/CreateVaccine',
      payload: {
        vaccineName: formvalues?.vaccineName || '',
        vaccineType: formvalues?.vaccineType || '',
        vaccinePetType: formvalues?.vaccinePetType || '',
        comment: formvalues?.comment || '',
      },
    });
    if (id) {
      ChangeCreateLoaidng(false);
    } else {
      handleDrawerClose(undefined);
    }
  }

  const drawerFooter = (
    <div id="create-instance-panel-footer">
      <Button type="primary" onClick={handleAddVaccine}>
        添加疫苗
      </Button>
    </div>
  );
  return (
    <Drawer
      title="新增疫苗"
      visible={visible}
      onClose={handleDrawerClose}
      footer={drawerFooter}
      width={600}
      closable={true}
      // destroyOnClose={true}
      maskClosable={false}
    >
      <BasicForm
        loading={createLoading}
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
        // onValuesChange={onValuesChange}
      >
        <VaccineForm form={form} type="create" />
      </BasicForm>
    </Drawer>
  );
}

export default CreateVaccinePanel;
