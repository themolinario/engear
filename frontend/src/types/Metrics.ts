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