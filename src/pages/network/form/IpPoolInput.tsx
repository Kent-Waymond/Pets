import { Input } from 'antd';
import React, { useEffect, useState } from 'react';

interface IpPoolInputProps {
  value?: string;
  onChange?: (value: string) => void;
  connector?: string | React.ReactNode;
  PlaceHolder?: {
    start: string;
    end: string;
  };
}

export function IpPoolInput(props: IpPoolInputProps) {
  const { connector, value, onChange, PlaceHolder } = props;
  const [startInput, ChangeStartInput] = useState<string>('');
  const [endInput, ChangeEndInput] = useState<string>('');

  useEffect(() => {
    // console.log(onChange)

    if (value) {
      const [start = '', end = ''] = value?.split(',');
      ChangeStartInput(start);
      ChangeEndInput(end);
    }
  }, [value]);

  function onStartInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const val = ev.target.value;
    ChangeStartInput(val);
    const targtevalue = [val, endInput].join(',');
    if (onChange) {
      onChange(targtevalue);
    }
  }
  function onEndInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const val = ev.target.value;
    ChangeEndInput(val);

    const targtevalue = [startInput, val].join(',');
    if (onChange) {
      onChange(targtevalue);
    }
  }

  return (
    <Input.Group compact>
      <Input
        style={{ width: '45%' }}
        value={startInput}
        onChange={onStartInputChange}
        placeholder={PlaceHolder?.start}
      />
      <span style={{ width: '10%', textAlign: 'center' }}>
        {connector ?? '-'}
      </span>
      <Input
        style={{ width: '45%' }}
        value={endInput}
        onChange={onEndInputChange}
        placeholder={PlaceHolder?.end}
      />
    </Input.Group>
  );
}
