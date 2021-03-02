import React from 'react';
import {
  SecurityScanTwoTone,
  EditOutlined,
  RocketTwoTone,
  CrownTwoTone,
} from '@ant-design/icons';
import Progress from '@/components/progress';

export default function () {
  return (
    <>
      <div className="card card-bordered">
        <div className="card-header">
          <div className="card-title">许可管理</div>
        </div>
        <div className="card-body">
          <table className="table table-headless">
            <thead>
              <tr>
                <th className="th-w-symbol"></th>
                <th></th>
                <th className="th-w-progress"></th>
                <th></th>
                <th className="th-w-action"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="symbol symbol-info">
                    <SecurityScanTwoTone twoToneColor="#8950fc" />
                  </div>
                </td>
                <td>
                  <div>堡垒机</div>
                  <div className="text-gray">
                    明御&reg;运维审计与风险控制系统
                  </div>
                </td>
                <td>
                  <div className="text-gray">已分配300资产，共1000资产</div>
                  <Progress percent={30} showInfo={false} />
                </td>
                <td>
                  <div>
                    剩余<span className="text-success">291</span>天
                  </div>
                  <div className="text-gray">2021-02-03 过期</div>
                </td>
                <td>
                  <button className="btn btn-icon">
                    <EditOutlined />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="symbol symbol-success">
                    <RocketTwoTone twoToneColor="#1bc5bd" />
                  </div>
                </td>
                <td>
                  <div>WAF</div>
                  <div className="text-gray">明御&reg;Web应用防火墙</div>
                </td>
                <td>
                  <div className="text-gray">已分配3站点，共10站点</div>
                  <Progress percent={30} showInfo={false} />
                </td>
                <td>
                  <div>
                    剩余<span className="text-success">291</span>天
                  </div>
                  <div className="text-gray">2021-02-03 过期</div>
                </td>
                <td>
                  <button className="btn btn-icon">
                    <EditOutlined />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="symbol symbol-warning">
                    <CrownTwoTone twoToneColor="#ffa800" />
                  </div>
                </td>
                <td>
                  <div>NGFW</div>
                  <div className="text-gray">明御&reg;安全网关</div>
                </td>
                <td>
                  <div className="text-gray">已分配3实例，共10实例</div>
                  <Progress percent={30} showInfo={false} />
                </td>
                <td>
                  <div>
                    剩余<span className="text-success">291</span>天
                  </div>
                  <div className="text-gray">2021-02-03 过期</div>
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
    </>
  );
}
