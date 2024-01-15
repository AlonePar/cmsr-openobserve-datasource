import { DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv, BackendSrvRequest, FetchResponse } from '@grafana/runtime';
import { OpenObserveResponse, OpenObserveSqlOptions } from './types';
import { lastValueFrom } from 'rxjs';

export * from './types'

export class OpenObserveClient {
    settings: DataSourceInstanceSettings<OpenObserveSqlOptions>;

    constructor(settings: DataSourceInstanceSettings<OpenObserveSqlOptions>) {
        this.settings = settings;
    }

    async request(req: BackendSrvRequest): Promise<FetchResponse> {
		return await lastValueFrom(getBackendSrv().fetch<OpenObserveResponse>({
            ...req,
            url: this.settings.url + this.normalizeUrl(req.url),
            headers: {
                "Content-Type": req.data ? "application/json; charset=UTF-8" : undefined,
                ...req.headers,
                'Authorization': this.settings.jsonData.basicAuth,
                'organization': this.settings.jsonData.organization ?? "default",
            }
        }));
	}

    async ping(): Promise<boolean> {
        const res = await this.request({
            url: "/healthz",
            method: "GET",
        });
        return res.status === 200;
    }

    async getStatus(): Promise<Record<string, any>> {
        const res = await this.request({
            url: "/api/cache/status",
            method: "GET",
        });
        if (res.status < 400) {
            return res.data;
        }
        throw res;
    }

    private normalizeUrl(url: string): string {
        return url.replace("{org_id}", this.settings.jsonData.organization!);
    }
}

