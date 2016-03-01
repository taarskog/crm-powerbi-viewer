module PowerBiViewer.Services {

	export interface IPowerBiConfig {
		type: string;
		dashboardId: string;
		dashboardName: string;
		tileId: string;
		tileName: string;
		reportId: string;
		reportName: string;
	}

	export interface IConfigService {
		powerBi: IPowerBiConfig;
	}

	export class ConfigService implements IConfigService {
		powerBi: IPowerBiConfig;

		constructor(queryString: string) {
			var query = ConfigService.parseQueryString(queryString);
			this.powerBi = <IPowerBiConfig>ConfigService.parseCrmDataString(query.data);
		}

		static create(queryString: string): IConfigService {
			return new ConfigService(queryString);
		}

		private static parseQueryString(queryString: string): any {
			var result: any = {};
			var query: string = typeof queryString === 'undefined' || queryString === null ? '' : queryString;
			query = query.length > 0 && query[0] === '?' ? query.substring(1) : query;

			var vars: string[] = query.split("&");
			for (var i: number = 0; i < vars.length; i++) {
				var pair: string[] = vars[i].split("=");
				// If first entry with this name
				if (typeof this[pair[0]] === "undefined") {
					result[pair[0]] = pair[1];
					// If second entry with this name
				} else if (typeof this[pair[0]] === "string") {
					var arr: any[] = [this[pair[0]], pair[1]];
					result[pair[0]] = arr;
					// If third or later entry with this name
				} else {
					result[pair[0]].push(pair[1]);
				}
			}

			return result;
		}

		private static parseCrmDataString(dataString: string): Object {
			var params: Object = {};
			if (typeof dataString === "undefined" || dataString === null || dataString === '') {
				return params;
			}

			var data: string = decodeURIComponent(dataString);
			var vars: string[] = data.split("&");
			for (var i: number = 0; i < vars.length; i++) {
				var pair: string[] = vars[i].split("=");
				// If first entry with this name
				if (typeof params[pair[0]] === "undefined") {
					params[pair[0]] = pair[1];
					// If second entry with this name
				} else if (typeof params[pair[0]] === "string") {
					var arr: any[] = [params[pair[0]], pair[1]];
					params[pair[0]] = arr;
					// If third or later entry with this name
				} else {
					params[pair[0]].push(pair[1]);
				}
			}

			return params;
		}
	}
}