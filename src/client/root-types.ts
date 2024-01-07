import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  constant: 6.5,
};

/**
 * These are options configured for each DataSource instance
 */
export interface OpenObserveDataSourceOptions extends DataSourceJsonData {
  organization: string;
}


export interface OpenObserveQuery extends DataQuery {
  queryText?: string;
	rawQuery?: boolean;
	readonly query?: string;

	resultFormat?: Formats;
	alias?: string;
	keywords?: string;
	
	// visual query
	whereConditions?: WhereStatement[];
	selectConditions?: SelectCondition[][];
	groupbyConditions?: GroupbyCondition[];
	tz?: string;
	orderByTime?: 'DESC' | 'ASC';
	limit?: string;
	offset?: string;
}


export enum Formats {
	TimeSeries = 'time_series',
	Table = 'table',
	Logs = 'logs',
}

/* where statement type */
export const OPERATORS = ['=', '!=', '>', '>=', '<', '<=', '<>', '=~', '!~'] as const;
type Operator = (typeof OPERATORS)[number];

export const CONNECTORS = ['AND', 'OR'] as const;

export type WhereStatement = Readonly<[string, Operator, string | number, 'AND' | 'OR' | undefined]>;

/* selected part */
interface BasicCondition {
	type: string;
	params: Array<string | number>;
}

export enum CategoryType {
	Aggregations = 'Aggregations',
	Selectors = 'Selectors',
	Transformations = 'Transformations',
	Predictors = 'Predictors',
	Math = 'Math',
	Aliasing = 'Aliasing',
	Fields = 'Fields',
}

export interface SelectCondition extends BasicCondition {
	category: CategoryType;
}

export interface GroupbyCondition extends BasicCondition {
  
}
