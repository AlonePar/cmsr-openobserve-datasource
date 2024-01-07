import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  TestDataSourceResponse,
} from '@grafana/data';
import { FetchResponse } from '@grafana/runtime';
import { MyQuery, OpenObserveDataSourceOptions } from './root-types';
import { OpenObserveClient } from '.';

export class OpenObserveDataSource extends DataSourceApi<MyQuery, OpenObserveDataSourceOptions> {
  settings: DataSourceInstanceSettings<OpenObserveDataSourceOptions>;
  client: OpenObserveClient;

  constructor(instanceSettings: DataSourceInstanceSettings<OpenObserveDataSourceOptions>) {
    super(instanceSettings);
    this.settings = instanceSettings;
    this.client = new OpenObserveClient(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async testDatasource(): Promise<TestDataSourceResponse>{
    const ping = await this.client.ping();
    if (!ping) {
      return {
        status: 'error',
        message: 'Failed to connect to OpenObserve'
      };
    }

    try {
      const status = await this.client.getStatus();
      console.log("[OO] 检测OpenObserve连接成功, 服务状态: ", status);
      return {
        status: 'success',
				message: 'Success to connect to openGemini',
      };
    } catch (error) {
      let res = error as FetchResponse;
      console.log("[OO] 检测OpenObserve连接失败", res.data || res.statusText);
      return {
        status: 'error',
        message: res.statusText,
      };
    }
  }

}
