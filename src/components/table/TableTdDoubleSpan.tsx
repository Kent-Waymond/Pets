import * as React from 'react';
import Text from 'antd/lib/typography/Text';

/**
 *  主要用于table组件中一个td一行需要展示多段span或者用于展示包含链接内容
 *  例如  用户名列 需要展示  用户名 姓名
 */
interface ICopyConfig {
  text: string;
  onCopy?: () => void;
}

interface ITableTdDoubleSpanProps {
  MainSpan: React.ReactNode | string;
  MainSpanPointer?: boolean; // 是否是链接样式内容
  ExtraSpan?: React.ReactNode | string;
  copyable?: ICopyConfig;
}

interface ITableTdDoubleSpanState {
  hover: boolean;
}

class TableTdDoubleSpan extends React.Component<
  ITableTdDoubleSpanProps,
  ITableTdDoubleSpanState
> {
  constructor(props: ITableTdDoubleSpanProps) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  public onMouseEnter = (ev: any) => {
    this.setState({
      hover: true,
    });
  };

  public onMouseLeave = (ev: any) => {
    this.setState({
      hover: false,
    });
  };

  public render() {
    const { MainSpan, MainSpanPointer, ExtraSpan, copyable } = this.props;
    const { hover } = this.state;

    const MainSpanRender = () => {
      if (MainSpanPointer) {
        return <span className="bh-link">{MainSpan}</span>;
      } else {
        return <span>{MainSpan}</span>;
      }
    };
    return (
      <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {MainSpanRender()}
        <span style={{ marginLeft: 10, color: '#8a8a8a' }}>{ExtraSpan}</span>
        {copyable && 'text' in copyable && hover && (
          <Text copyable={copyable} />
        )}
      </span>
    );
  }
}

export default TableTdDoubleSpan;
