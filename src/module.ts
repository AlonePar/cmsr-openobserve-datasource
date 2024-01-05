import { DataSourcePlugin } from '@grafana/data';
import { OpenObserveDataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { MyQuery, MyDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<OpenObserveDataSource, MyQuery, MyDataSourceOptions>(OpenObserveDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
