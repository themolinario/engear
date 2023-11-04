export interface IIpAddress {
    ip: string;
}

export interface IUserAgent {
    "userAgentString": string,
    "name": string,
    "type": string,
    "version": string,
    "versionMajor": string,
    "device": {
        "name": string,
        "type": string,
        "brand": string,
        "cpu": string
    },
    "engine": {
        "name": string,
        "type": string,
        "version": string,
        "versionMajor": string
    },
    "operatingSystem": {
        "name": string,
        "type": string,
        "version": string,
        "versionMajor": string
    }
}

export interface IMetricUser {
    streamedTimeTotal: number,
    streamedData: number,
    rebufferingEvents: string,
    rebufferingTime: number,
    userAgent: string,
    speedTest: string,
    username: string
}

export interface IMetric {
    ip: string,
    userAgent: string,
    speedTest: string,
    streamedTime: number,
    rebufferingEvents: string,
    rebufferingTime: number,
}

export interface IRow {
    value: string,
    tooltip?: string
}