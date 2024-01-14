export interface OrgUser {
    first_name: string,
    last_name: string,
    email: string,
}

export interface OrgDetail {
    id: number,
    identifier: string,
    name: string,
    user_email: string,
    ingest_threshold: number,
    search_threshold: number,
    type: string,
    OrgUser: OrgUser,
}
