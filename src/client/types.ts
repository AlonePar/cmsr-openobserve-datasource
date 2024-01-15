import { SQLOptions } from "../sql/types";

export interface OpenObserveSqlOptions extends SQLOptions {
    organization?: string;
    basicAuth?: string;
}

export interface OpenObserveSecureOptions {
    basicAuth: string;
}

  
export interface OpenObserveResponse {
    [name: string]: any;
}
