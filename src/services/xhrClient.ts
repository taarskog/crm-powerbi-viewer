type RequestMethodType = "GET" | "POST" | "OPTIONS";

export class RequestMethods {
    public static get Get(): RequestMethodType { return "GET"; }
    public static get Post(): RequestMethodType { return "POST"; }
    public static get Options(): RequestMethodType { return "OPTIONS"; }
}

export interface IRequestOptions {
    method: RequestMethodType;
    url: string;
    headers?: any;
    params?: any;
    body?: any;
}

export class XhrRequestError extends Error {
    status: number = null;
    statusText: string = null;

    constructor(message: string = null, status: number = null, statusText: string = null) {
        super(message);
        this.status = status;
        this.statusText = statusText;
    }

    toString(): string {
        let message: string = "Request failed";

        if (this.message === null) {
            message += ".";
        }
        else {
            message += `: '${this.message}'.`;
        }

        if (this.status !== null || this.statusText !== null) {
            message += ` Status: [${this.status}] ${this.statusText}`;
        }

        return message;
    }
}

export class XhrClient {
    /** Send request.
     *  Defaults to accept application/json if not overridden by options.headers['accept'].
     * @return Response as a promise or XhrRequestError if request failed.
     */
    static send(options: IRequestOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: string = options.url;
            let paramString: string = null;

            if (options.params) {
                // Encode params before sending - both key and value
                paramString = Object.keys(options.params).map(key => {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`;
                }).join("&");
            }

            // When using GET we append params to the url
            if (paramString !== null) {
                if (url.indexOf("?") === -1) {
                    url += "?";
                }

                url += paramString;
            }

            let xhr = new XMLHttpRequest();
            xhr.open(options.method, url);

            xhr.onload = ev => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject(new XhrRequestError(null, xhr.status, xhr.statusText));
                }
            };

            xhr.onerror = ev => {
                let errorMessage: string = null;
                try {
                    errorMessage = JSON.parse(xhr.response).error;
                } catch (e) {
                    errorMessage = "Unexpected Error";
                }

                reject(new XhrRequestError(errorMessage, xhr.status, xhr.statusText));
            };

            if (options.headers) {
                Object.keys(options.headers).forEach(key => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }

            if (!options.headers || typeof options.headers["accept"] === "undefined") {
                // Default to accept json
                xhr.setRequestHeader("Accept", "application/json");
            }

            // TODO: Better method here
            xhr.send(options.body);
        });
    }
}
