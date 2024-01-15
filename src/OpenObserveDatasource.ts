import { DataSourceInstanceSettings, TimeRange } from '@grafana/data';
import { CompletionItemKind, LanguageDefinition, TableIdentifier } from '@grafana/experimental';
import { SqlDatasource } from './sql/datasource/SqlDatasource';
import { DB, SQLQuery } from './sql/types';
import { formatSQL } from './sql/utils/formatSQL';

import { getSqlCompletionProvider } from './sqlCompletionProvider';
import { quoteIdentifierIfNecessary, quoteLiteral, toRawSql } from './client/sqlUtils';
import { OpenObserveClient, OpenObserveSqlOptions } from './client';
import { queryOrgnizations, queryStream, queryStreams } from './client/metaQuery';
import { mapFieldsToTypes } from './client/model/fields';

export class OpenObserveDatasource extends SqlDatasource {
  sqlLanguageDefinition: LanguageDefinition | undefined;

  constructor(private instanceSettings: DataSourceInstanceSettings<OpenObserveSqlOptions>,
        private client: OpenObserveClient) {
    super(instanceSettings);
  }

  getQueryModel() {
    return { quoteLiteral };
  }

  getSqlLanguageDefinition(): LanguageDefinition {
    if (this.sqlLanguageDefinition !== undefined) {
      return this.sqlLanguageDefinition;
    }

    const args = {
      getMeta: (identifier?: TableIdentifier) => this.fetchMeta(identifier),
    };

    this.sqlLanguageDefinition = {
      id: 'openobserve',
      completionProvider: getSqlCompletionProvider(args),
      formatter: formatSQL,
    };

    return this.sqlLanguageDefinition;
  }

  async fetchDatasets(): Promise<string[]> {
    const orgs = await queryOrgnizations(this.client);
    return orgs.map((org) => org.identifier);
  }

  async fetchTables(dataset?: string): Promise<string[]> {
    const streams = await queryStreams(this.client, dataset);
    return streams.map((stream) => stream.name);
  }

  async fetchFields(query: Partial<SQLQuery>) {
    if (!query.dataset || !query.table) {
      return [];
    }
    const schema = await queryStream(this.client, query.table, query.dataset);
    const fields = schema.schema.map((f) => ({
        name: f.name,
        text: f.name,
        value: quoteIdentifierIfNecessary(f.name),
        type: f.type,
        label: f.name,
    }));
    return mapFieldsToTypes(fields);
  }

  async fetchMeta(identifier?: TableIdentifier) {
    const defaultDB = this.instanceSettings.jsonData.database;
    if (!identifier?.schema && defaultDB) {
      const tables = await this.fetchTables(defaultDB);
      return tables.map((t) => ({ name: t, completion: `${defaultDB}.${t}`, kind: CompletionItemKind.Class }));
    } else if (!identifier?.schema && !defaultDB) {
      const datasets = await this.fetchDatasets();
      return datasets.map((d) => ({ name: d, completion: `${d}.`, kind: CompletionItemKind.Module }));
    } else {
      if (!identifier?.table && (!defaultDB || identifier?.schema)) {
        const tables = await this.fetchTables(identifier?.schema);
        return tables.map((t) => ({ name: t, completion: t, kind: CompletionItemKind.Class }));
      } else if (identifier?.table && identifier.schema) {
        const fields = await this.fetchFields({ dataset: identifier.schema, table: identifier.table });
        return fields.map((t) => ({ name: t.name, completion: t.value, kind: CompletionItemKind.Field }));
      } else {
        return [];
      }
    }
  }

  getDB(): DB {
    if (this.db !== undefined) {
      return this.db;
    }

    return {
      datasets: () => this.fetchDatasets(),
      tables: (dataset?: string) => this.fetchTables(dataset),
      fields: (query: SQLQuery) => this.fetchFields(query),
      validateQuery: (query: SQLQuery, _range?: TimeRange) =>
        Promise.resolve({ query, error: '', isError: false, isValid: true }),
      dsID: () => this.id,
      toRawSql,
      functions: () => ['HISTOGRAM'],
      getEditorLanguageDefinition: () => this.getSqlLanguageDefinition(),
    };
  }
}
