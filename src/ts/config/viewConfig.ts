module PowerBiViewer.Config {
	export interface IViewConfig {
		powerBi: Models.PowerBiViewConfigModel;
	}

	export class ViewConfig implements IViewConfig {
		powerBi: Models.PowerBiViewConfigModel;

		constructor(queryString: string) {
			if (typeof queryString !== "undefined" && queryString !== null && queryString.length > 0) {
				sessionStorage.setItem("PowerBiViewer.Config", queryString);
			}
			else {
				queryString = sessionStorage.getItem("PowerBiViewer.Config");
			}

			var query = ViewConfig.parseQueryString(queryString);
			this.powerBi = <Models.PowerBiViewConfigModel>ViewConfig.parseCrmDataString(query.data);
		}

		static create(queryString: string): IViewConfig {
			return new ViewConfig(queryString);
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