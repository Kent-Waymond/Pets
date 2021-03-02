import React, { useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { FormInstance } from 'antd/lib/form/Form';
import { Button, Space, Steps, message } from 'antd';
import { InstanceBasicInfoForm } from './InstanceBasicInfoForm';
import { InstanceResourceLimitForm } from './InstanceResourceLimitForm';
import { InstanceBasicNetworkConfForm } from './InstanceBasicNetworkConfForm';
// import { InstanceDataPersistConfForm } from './InstanceDataPersistConfForm';
// import { InstanceBasicNetworkConfForm } from './InstanceBasicNetworkConfForm';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'umi';
import {
  DeploymentUnitOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Row } from '@/components/grid';
import { IPlatformImageRecord } from '@/type';

interface IServiceInstanceStepFormProps {
  form: FormInstance;
  handleCreateInstance: (ev: any) => void;
}

interface InstanceFormStep {
  title: string | React.ReactNode;
  key: string;
  content: string | React.ReactNode;
  icon: React.ReactNode;
  fields: string[];
  after?: (values: any, dispatch: any, form: FormInstance) => Promise<boolean>;
}
const Step = Steps.Step;
const steps: InstanceFormStep[] = [
  {
    title: (
      <FormattedMessage
        id="instance.table.BasicInfo"
        defaultMessage="基本信息"
      />
    ),
    key: 'info',
    content: <InstanceBasicInfoForm />,
    icon: <AppstoreOutlined />,
    fields: ['name', 'product', 'specifications', 'expireAt', 'comment'],
    after: GetProductImages,
  },
  {
    title: (
      <FormattedMessage
        id="instance.table.ResourceLimit"
        defaultMessage="资源配额"
      />
    ),
    key: 'resource',
    content: <InstanceResourceLimitForm />,
    icon: <SettingOutlined />,
    fields: ['cpu', 'memory', 'diskSize'],
  },
  {
    title: (
      <FormattedMessage
        id="instance.table.NetworkConfig"
        defaultMessage="节点网络"
      />
    ),
    key: 'network',
    content: <InstanceBasicNetworkConfForm />,
    icon: <DeploymentUnitOutlined />,
    fields: ['networkDriver', 'ip', 'netMask', 'nodeId', 'imageId'],
  },
];

async function GetProductImages(
  values: any,
  dispatch: any,
  form: FormInstance,
): Promise<boolean> {
  const PlatformImages: IPlatformImageRecord[] = await dispatch({
    type: 'global/ListPlatformImages',
  });
  const productInfo = form.getFieldValue('product');
  const targetImage = PlatformImages.find((item: IPlatformImageRecord) => {
    if (item) {
      const { productId = '' } = item;
      return productId === productInfo;
    }
    return false;
  });
  if (targetImage) {
    form.setFieldsValue({
      imageId: targetImage?.id,
    });

    return true;
  }
  message.error(
    <FormattedMessage
      id="instance.form.GetProductImageFailed"
      defaultMessage="获取产品镜像失败"
    />,
  );
  return false;
}

export function ServiceInstanceStepForm(props: IServiceInstanceStepFormProps) {
  const { form, handleCreateInstance } = props;
  const dispatch = useDispatch();
  const [currentStep, ChangeCurrentStep] = useState(0);
  const [footerElement, ChangeFooterElement] = useState<HTMLElement | null>(
    null,
  );

  const displaySteps = useMemo(() => {
    let targetSteps = steps;
    return targetSteps;
  }, []);

  useEffect(() => {
    const element = document.getElementById('create-instance-panel-footer');
    if (element) {
      ChangeFooterElement(element);
    }
  }, []);

  function handlePrevStep(ev: any) {
    const target = currentStep > 1 ? currentStep - 1 : 0;
    ChangeCurrentStep(target);
  }

  function _beforeNextAction(callback: any) {
    const fields = steps[currentStep].fields;
    const after = steps[currentStep].after;

    form.validateFields(fields).then(async (values) => {
      if (after) {
        const continue1 = await after(values, dispatch, form);
        if (continue1) {
          callback();
        }
      } else {
        callback();
      }
    });
  }

  function handleNextStep(ev: any) {
    const callback = () => {
      const target =
        currentStep < displaySteps.length - 1
          ? currentStep + 1
          : displaySteps.length - 1;
      ChangeCurrentStep(target);
    };
    _beforeNextAction(callback);
  }

  function handleSubmit(ev: any) {
    const callback = () => {
      handleCreateInstance(ev);
    };
    _beforeNextAction(callback);
  }

  const StepFooter = (
    <Space>
      <Button onClick={handlePrevStep} disabled={currentStep < 1}>
        <FormattedMessage id="common.PrevStep" defaultMessage="上一步" />
      </Button>
      <Button
        onClick={handleNextStep}
        disabled={currentStep >= displaySteps.length - 1}
      >
        <FormattedMessage id="common.NextStep" defaultMessage="下一步" />
      </Button>

      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={currentStep != displaySteps.length - 1}
        // htmlType="submit"
      >
        <FormattedMessage
          id="instance.form.CreateInstance"
          defaultMessage="创建实例"
        />
      </Button>
    </Space>
  );

  const footer = () => {
    if (footerElement) {
      return ReactDOM.createPortal(StepFooter, footerElement);
    }
  };
  return (
    <>
      <Row size="hg">
        <Steps current={currentStep}>
          {displaySteps.map((item) => (
            <Step key={item.key} title={item.title} icon={item.icon} />
          ))}
        </Steps>
      </Row>

      {displaySteps.map((item: any, index: number) => (
        <div
          key={item.key}
          style={{ display: index == currentStep ? 'block' : 'none' }}
        >
          {item.content}
        </div>
      ))}
      <div>{footer()}</div>
    </>
  );
}
