export enum StreamType {
    Logs = "logs",
    Metrics = "metrics",
    Traces = "traces",
    EnrichmentTables = "enrichment_tables",
    Filelist = "file_list",
    Metadata = "metadata",
}

export type StreamTypeValue = `${StreamType}`

export enum MetricType {
    Unknown = "unknown",
    Counter = "counter",
    Gauge = "gauge",
    Histogram = "histogram",
    GaugeHistogram = "gaugeHistogram",
    ExponentialHistogram = "exponentialHistogram",
    Summary = "summary",
    Info = "info",
    StateSet = "stateSet",
    Empty = "",
}

export type MetricTypeValue = `${MetricType}`

export enum PartitionTimeLevel {
    Unset = "unset",
    Hourly = "hourly",
    Daily = "daily",
}

export interface Stream {
    name: string,
    storage_type: string,
    stream_type: StreamTypeValue,
    stats: StreamStats,
    schema: Field[],
    settings: StreamSettings,
    metrics_meta: MetricMeta,
}

export interface MetricMeta {
    metric_type: MetricTypeValue,
    metric_family_name: string,
    help: string
    unit: string
}

export interface StreamStats {
    created_at: number,
    doc_time_min: number,
    doc_time_max: number,
    doc_num: number,
    file_num: number,
    storage_size: number,
    compressed_size: number,
}

export interface StreamSettings {
    partition_keys: Map<number, string>,
    partition_time_level: PartitionTimeLevel,
    full_text_search_keys: string[],
    bloom_filter_fields: string[],
    data_retention: number,
}

export interface Field {
    name: string
    type: string
}
