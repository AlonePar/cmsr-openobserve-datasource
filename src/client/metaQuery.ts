import { OpenObserveClient } from 'client';
import { OrgDetail } from './model/org';
import { Stream, StreamType } from './model/stream';


export async function queryOrgnizations(client: OpenObserveClient): Promise<OrgDetail[]> {
    const res = await client.request({
        url: "/api/{org_id}/organizations",
        method: "GET",
        headers: {
            "user_id": client.settings.jsonData.user,
        }
    });
    if (res.status < 400) {
        return res.data;
    }
    throw res;
}

export async function queryStreams(client: OpenObserveClient, org?: string, streamType?: StreamType, fetchSchema?: boolean): Promise<Stream[]> {
    const orgId = org ?? "{org_id}"
    const res = await client.request({
        url: `/api/${orgId}/streams`,
        method: "GET",
        params: {
            streamType: streamType ?? undefined,
            fetchSchema: fetchSchema ?? undefined,
        }
    });
    if (res.status < 400) {
        return res.data.list;
    }
    throw res;
}

export async function queryStream(client: OpenObserveClient, streamName: string, org?: string, streamType?: StreamType): Promise<Stream> {
    const orgId = org ?? "{org_id}"
    const res = await client.request({
        url: `/api/${orgId}/${streamName}/schema`,
        method: "GET",
        params: {
            streamType: streamType ?? undefined,
        }
    });
    if (res.status < 400) {
        return res.data;
    }
    throw res;
}
