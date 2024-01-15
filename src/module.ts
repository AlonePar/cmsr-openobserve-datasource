import { DataSourcePlugin } from '@grafana/data';
import { SqlQueryEditor } from './sql/components/QueryEditor';
import { SQLQuery } from './sql/types';

import { CheatSheet } from './CheatSheet';
import { OpenObserveDatasource } from './OpenObserveDatasource';
import { OpenObserveSecureOptions, OpenObserveSqlOptions } from './client/types';
import { ConfigurationEditor } from 'configuration/ConfigurationEditor';


export const plugin = new DataSourcePlugin<OpenObserveDatasource, SQLQuery, OpenObserveSqlOptions, OpenObserveSecureOptions>(OpenObserveDatasource)
  .setQueryEditor(SqlQueryEditor)
  .setQueryEditorHelp(CheatSheet)
  .setConfigEditor(ConfigurationEditor);
