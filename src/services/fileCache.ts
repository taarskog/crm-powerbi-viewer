import { XhrClient, RequestMethods, XhrRequestError } from "../services/xhrClient";
import log from "../diag/logger";

abstract class BaseFileCache {
    public abstract getData(url: string, maxAge: number): Promise<string>;

    protected getDataFromServer(url: string): Promise<string> {
        return XhrClient.send({
                method: RequestMethods.Get,
                url: url,
                headers: { "Accept": "*" }
            });
    }
}

class NoFileCahce extends BaseFileCache {
    public getData(url: string, maxAge: number = 1): Promise<string> {
        return this.getDataFromServer(url).then(result => result);
    }
}

class LocalStorageFileCache extends BaseFileCache {
    private get KeyPrefix(): string { return "his_pbia_"; }

    /**
     * Get url contents from cache or if cache expired by downloading using the provided url. NO matter what the server returns the result is returned as a string.
     *
     * @param {string} url Url to item.
     * @param {number} [maxAge=60000] Number of ms the cached item is valid.
     * @returns {Promise<string>} If not expired url result from cache; otherwise result from getting the url contents
     */
    public getData(url: string, maxAge: number = 60000): Promise<string> {
        return new Promise((resolve, reject) => {
            let key = this.KeyPrefix + encodeURIComponent(url);
            let data = localStorage.getItem(key);
            if (data && this.getItemExpiration(data) > Date.now()) {
                log.info("Got item from file cache: " + url);
                resolve(this.getRawData(data));
                return;
            }

            log.info("Item expired, downloading: " + url);

            this.getDataFromServer(url).then(result => {
                if (result && result.length > 0) {
                    localStorage.setItem(key, `${Date.now() + maxAge}|${result}`);
                }

                resolve(result);
                return;
            });
        });
    }

    /**
     * Get expiration of cache item as Epoch value.
     * @param {string} data Cache value as it is stored in the cache.
     * @returns {Number} Expiration of the cache item.
     */
    private getItemExpiration(data: string): Number {
        let indexOfDateSeparator = data.indexOf("|");
        return indexOfDateSeparator < 0 ? null : parseInt(data.substring(0, indexOfDateSeparator));
    }

    /**
     * Get raw cache data without supporting properties such as cache expiration.
     *
     * @param {string} data Cache value as it is stored in the cache.
     * @returns {string} Raw value without supporting properties.
     */
    private getRawData(data: string): string {
        let indexOfDateSeparator = data.indexOf("|");
        return indexOfDateSeparator < 0 && data.length <= indexOfDateSeparator ? null : data.substring(indexOfDateSeparator + 1);
    }
}


let fileCache: BaseFileCache = null;
if (typeof(localStorage) === "undefined") {
    log.debug("No Local Storage available - not using file cache");
    fileCache = new NoFileCahce();
} else {
    log.debug("Using Local Storage as file cache");
    fileCache = new LocalStorageFileCache();
}

export default fileCache;
