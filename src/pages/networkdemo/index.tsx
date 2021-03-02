import React from 'react';
import { history } from 'umi';
import {
  PropertySafetyOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  GoldTwoTone,
  FileTextOutlined,
} from '@ant-design/icons';

export default function () {
  return (
    <div className="content">
      <div className="card card-bordered">
        <div className="card-header">
          <div className="card-title">网络管理</div>
          <div className="card-action">
            <button className="btn btn-primary">创建网络</button>
          </div>
        </div>
        <div className="card-body"></div>
        <table className="table">
          <thead>
            <tr>
              <th>名称/IP设置</th>
              <th>网关/掩码</th>
              <th>IP池</th>
              <th>网卡</th>
              <th>实例</th>
              <th className="th-w-action-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="row-flex">
                  <div className="symbol symbol-warning">
                    <GoldTwoTone twoToneColor="#ffa800" />
                  </div>
                  <div className="grid">
                    <div>网络1</div>
                    <div className="text-gray">手动设置</div>
                  </div>
                </div>
              </td>
              <td>
                <div>10.0.0.1</div>
                <div className="text-gray">255.255.255.0</div>
              </td>
              <td>
                <div>10.0.0.20 - 10.0.0.50</div>
              </td>
              <td>
                <div className="tag tag-primary">10</div>
              </td>
              <td>
                <div className="tag tag-primary">6</div>
              </td>
              <td>
                <button className="btn btn-icon">
                  <EditOutlined />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="row-flex">
                  <div className="symbol symbol-primary">
                    <GoldTwoTone twoToneColor="#2a92fc" />
                  </div>
                  <div className="grid">
                    <div>网络1</div>
                    <div className="text-gray">DHCP</div>
                  </div>
                </div>
              </td>
              <td>
                <div>10.0.0.1</div>
                <div className="text-gray">255.255.255.0</div>
              </td>
              <td>
                <div className="text-gray"></div>
              </td>
              <td>
                <div className="tag tag-primary">10</div>
              </td>
              <td>
                <div className="tag tag-primary">6</div>
              </td>
              <td>
                <button className="btn btn-icon">
                  <EditOutlined />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
