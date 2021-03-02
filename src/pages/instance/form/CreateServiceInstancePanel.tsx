import React, { useState } from 'react';
import { Form, Drawer, message } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { FormattedMessage, useDispatch } from 'umi';
import { BasicForm } from '@/components-compatible/Form/BasicForm';
import moment from 'moment';
import { formatMomentToTimestamp } from '@/utils/date';
import CreateProgress from '@/components-compatible/Progress/CreateProgress';
import { ServiceInstanceStepForm } from './ServiceInstanceStepForm';

interface ICreateServiceInstancePanelProps extends DrawerProps {}

// const FormItem = Form.Item;

function CreateServiceInstancePanel(props: ICreateServiceInstancePanelProps) {
  const { visible, onClose } = props;

  const dispatch = useDispatch<any>();
  const [createLoading, ChangeCreateLoaidng] = useState<boolean>(false);

  const [isCreating, ChangeIsCreating] = useState<boolean>(false);
  const [instanceId, ChangeInstanceId] = useState<string>('');

  const [form] = Form.useForm();

  function handleDrawerClose(ev: any) {
    if (onClose) {
      onClose(ev);
    }
    form.resetFields();
  }

  function parseLicenseConfig(product: string, licenseSpec: string) {
    if (product && licenseSpec) {
      const [specId, expireAt] = licenseSpec.split('$');
      if (specId) {
        return {
          expireAt: Number(expireAt) || 0,
          specId,
        };
      }
    }
    return null;
  }

  function handleCreateInstance(ev: any) {
    // ev.preventDefault();
    form.submit();
  }

  async function onFormFinish(formvalues: any) {
    // console.log('values ', formvalues);
    ChangeCreateLoaidng(true);
    const licenseConfig = parseLicenseConfig(
      formvalues?.product,
      formvalues?.specifications,
    );
    if (!licenseConfig) {
      message.warning(
        <FormattedMessage
          id="instance.form.IllegalLicenseSpecification"
          defaultMessage="不合法的许可规格"
        />,
      );
      return;
    }
    const [networkDriver = 1, networkId = ''] =
      formvalues?.networkDriver?.split('$') || '';

    const id = await dispatch({
      type: 'instance/CreateInstance',
      payload: {
        name: formvalues?.name || '',
        comment: formvalues?.comment || '',
        licenseConfig: {
          ...licenseConfig,
        },
        resourceLimit: {
          cpu: Number(formvalues?.cpu) * 100 || 0,
          memory: Number(formvalues?.memory) * 1024 || 0,
          diskSize: Number(formvalues?.diskSize) * 1024 || 0,
        },
        networkDriver: Number(networkDriver) || 1,
        networkId: networkId || '',
        ip: networkDriver != 1 ? formvalues?.ip : undefined,
        // netMask: networkDriver != 1 ? netmask : undefined,
        hostId:
          formvalues?.nodeId === 'auto'
            ? formvalues?.autoNodeId
            : formvalues?.nodeId,
        imageId: formvalues?.imageId,
      },
    });
    if (id) {
      ChangeInstanceId(id);
      ChangeIsCreating(true);
      ChangeCreateLoaidng(false);

      // 通知右上角bell有创建的对象
      dispatch({
        type: 'createrate/IdObjPush',
        payload: {
          id: id,
          name: formvalues.name,
          type: 'instance/GetCreateInstanceProgress',
        },
      });
    } else {
      handleDrawerClose(undefined);
    }
  }

  function InCreating(creating: boolean) {
    // console.log('end created!!');
    handleDrawerClose(undefined);
    ChangeIsCreating(creating);
  }

  const drawerLabel = (
    <FormattedMessage
      id="instance.form.CreateInstance"
      defaultMessage="创建实例"
    />
  );

  const drawerFooter = <div id="create-instance-panel-footer"></div>;
  return (
    <Drawer
      title={drawerLabel}
      visible={visible}
      onClose={handleDrawerClose}
      footer={isCreating ? false : drawerFooter}
      width={600}
      closable={true}
      // destroyOnClose={true}
      maskClosable={false}
    >
      {isCreating ? (
        <CreateProgress
          id={instanceId}
          title={drawerLabel}
          dispatchType={'instance/GetCreateInstanceProgress'}
          InCreating={InCreating}
        />
      ) : (
        <BasicForm
          loading={createLoading}
          form={form}
          layout="vertical"
          onFinish={onFormFinish}
          // onValuesChange={onValuesChange}
        >
          <ServiceInstanceStepForm
            form={form}
            handleCreateInstance={handleCreateInstance}
          />
        </BasicForm>
      )}
    </Drawer>
  );
}

export default CreateServiceInstancePanel;
