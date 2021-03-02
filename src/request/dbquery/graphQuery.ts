import axios from '../basicRequest';

export function GetServiceContainerStats({
  InstanceId,
  Type,
  Value,
  Columns,
}: any) {
  let filterTime = '';
  if (Type == 'day') {
    filterTime = `now() - ${Value}d`;
  } else if (Type == 'hour') {
    filterTime = `now() - ${Value}h`;
  }
  return axios.graphQueryPost('/v1/metrics/instance', {
    filter: [
      {
        key: 'time',
        value: filterTime,
        operator: '>',
      },
      {
        key: `"instanceId"`,
        value: `'${InstanceId}'`,
        operator: '=',
      },
    ],
    columns: Columns,
  });
}

export function GetServiceNodeStats({
  NodeId,
  Type,
  Value,
  Columns,
  table,
}: any) {
  let filterTime = '';
  if (Type == 'day') {
    filterTime = `now() - ${Value}d`;
  } else if (Type == 'hour') {
    filterTime = `now() - ${Value}h`;
  }

  return axios.graphQueryPost('/v1/metrics/node', {
    filter: [
      {
        key: 'time',
        value: filterTime,
        operator: '>',
      },
      {
        key: `"nodeId"`,
        value: `'${NodeId}'`,
        operator: '=',
      },
    ],
    table: table,
    order: 'time DESC',
  });
}

/**
 * 数据格式
  {
    "code": "200",
    "message": "",
    "requestId": "",
    "success": true,
    "data": {
      "results": [{
        "series": [{
          "columns": ["time", "containerId", "cpuUsagePercent", "diskSize", "diskUsage", "diskUsagePercent", "instanceId", "memoryLimit", "memoryUsagePercent", "netReceivedMb", "netTransmittedMb", "nodeId", "pidNums"],
          "name": "container_stats",
          "values": [
            ["2020-12-09T08:36:55.508874332Z", "ddcda0581aedf4baf2acfe8e49eddb61aa632883c6ccaf8be7345a059748f7f9", "0", null, null, null, "ddcda0581aedf4baf2acfe8e49eddb61aa632883c6ccaf8be7345a059748f7f9", "1928032256", "1.2597963506270302", 431.4321231842041, 1256.914602279663, "0bf13700-3e39-4864-829c-6f6b4189c94a", 14]
          ]
        }],
        "statement_id": 0
      }]
    }
  }
 */

// dashboard中获取所有实例的全部统计信息(所有实例，所有字段)
export function GetDashboardInstancesStatisticRecords() {
  return axios.graphQueryPost('/v1/metrics/instance', {
    filter: [
      {
        key: 'time',
        value: `now() - 1m`,
        operator: '>',
      },
    ],
    table: 'container_stats',
    order: 'time DESC',
  });
}

/* 返回数据格式
{
  "code": "200",
  "message": "",
  "requestId": "",
  "success": true,
  "data": {
    "results": [{
      "series": [{
        "columns": ["time", "bytes_recv", "bytes_sent", "cpu", "device", "fstype", "host", "interface", "mode", "nodeId", "path", "total", "usage_guest", "usage_guest_nice", "usage_idle", "usage_iowait", "usage_irq", "usage_nice", "usage_softirq", "usage_steal", "usage_system", "usage_user", "used", "used_percent"],
        "name": "net",
        "values": [
          ["2020-12-09T08:34:10Z", 6313322242, 633712442, null, null, null, "localhost.localdomain", "eth0", null, "c3c41a8b-3d62-4cda-9447-de602d9f2097", null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        ]
      }, {
        "columns": ["time", "bytes_recv", "bytes_sent", "cpu", "device", "fstype", "host", "interface", "mode", "nodeId", "path", "total", "usage_guest", "usage_guest_nice", "usage_idle", "usage_iowait", "usage_irq", "usage_nice", "usage_softirq", "usage_steal", "usage_system", "usage_user", "used", "used_percent"],
        "name": "mem",
        "values": [
          ["2020-12-09T08:34:10Z", null, null, null, null, null, "localhost.localdomain", null, null, "c3c41a8b-3d62-4cda-9447-de602d9f2097", null, 3973439488, null, null, null, null, null, null, null, null, null, null, 850997248, 21.41714377606749]
        ]
      }, {
        "columns": ["time", "bytes_recv", "bytes_sent", "cpu", "device", "fstype", "host", "interface", "mode", "nodeId", "path", "total", "usage_guest", "usage_guest_nice", "usage_idle", "usage_iowait", "usage_irq", "usage_nice", "usage_softirq", "usage_steal", "usage_system", "usage_user", "used", "used_percent"],
        "name": "disk",
        "values": [
          ["2020-12-09T08:34:10Z", null, null, null, "vda2", "xfs", "localhost.localdomain", null, "rw", "c3c41a8b-3d62-4cda-9447-de602d9f2097", "/", 53151248384, null, null, null, null, null, null, null, null, null, null, 23435591680, 44.09226949983505]
        ]
      }, {
        "columns": ["time", "bytes_recv", "bytes_sent", "cpu", "device", "fstype", "host", "interface", "mode", "nodeId", "path", "total", "usage_guest", "usage_guest_nice", "usage_idle", "usage_iowait", "usage_irq", "usage_nice", "usage_softirq", "usage_steal", "usage_system", "usage_user", "used", "used_percent"],
        "name": "cpu",
        "values": [
          ["2020-12-09T08:34:10Z", null, null, "cpu-total", null, null, "localhost.localdomain", null, null, "c3c41a8b-3d62-4cda-9447-de602d9f2097", null, null, 0, 0, 91.87279151757406, 1.5648662291978002, 0, 0, 0, 0.10095911156181485, 3.1297324583956003, 3.33165068156055, null, null]
        ]
      }],
      "statement_id": 0
    }]
  }
}
*/
// dashboard中获取所有实例的统计信息(默认包含cpu/内存/磁盘/网络)(所有实例，所有字段)
export function GetDashboardNodesStatisticRecords(
  table: string = 'cpu,mem,disk,net',
) {
  return axios.graphQueryPost('/v1/metrics/node', {
    filter: [
      {
        key: 'time',
        value: `now() - 3m`,
        operator: '>',
      },
    ],
    table: table,
    order: 'time DESC',
  });
}
