import { catchError, Observable, of, switchMap } from 'rxjs';

import { DataQueryRequest, DataQueryResponse } from '@grafana/data';

import { config, getBackendSrv, BackendDataSourceResponse, toDataQueryResponse  } from '@grafana/runtime';
import { DataQuery } from '@grafana/schema';

export function publicDashboardQueryHandler(request: DataQueryRequest<DataQuery>): Observable<DataQueryResponse> {
  const {
    intervalMs,
    maxDataPoints,
    requestId,
    panelId,
    queryCachingTTL,
    range: { from: fromRange, to: toRange },
  } = request;
  // Return early if no queries exist
  if (!request.targets.length) {
    return of({ data: [] });
  }

  const body = {
    intervalMs,
    maxDataPoints,
    queryCachingTTL,
    timeRange: {
      from: fromRange.valueOf().toString(),
      to: toRange.valueOf().toString(),
      timezone: request.timezone,
    },
  };

  return getBackendSrv()
    .fetch<BackendDataSourceResponse>({
      url: `/api/public/dashboards/${config.publicDashboardAccessToken!}/panels/${panelId}/query`,
      method: 'POST',
      data: body,
      requestId,
    })
    .pipe(
      switchMap((raw) => {
        return of(toDataQueryResponse(raw, request.targets));
      }),
      catchError((err) => {
        return of(toDataQueryResponse(err));
      })
    );
}
