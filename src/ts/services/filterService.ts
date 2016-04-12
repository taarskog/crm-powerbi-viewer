module PowerBiViewer.Services {
	export interface IFilterService {
		getFilterFromCrmForm(filterString: string): string
		getFilterFromFunction(functionName: string): string
	}

	export class FilterService implements IFilterService {
		static $inject: Array<string> = ['$log', '$window', 'XrmStatic'];

		static attributeRegex = /{{(\S*?)(#[FT])?}}/g;

		private _log: ng.ILogService;
		private _xrm: Xrm.XrmStatic;
		private _window: ng.IWindowService;

		constructor($log: ng.ILogService, $window: ng.IWindowService, xrm: Xrm.XrmStatic) {
			this._log = $log;
			this._window = $window;
			this._xrm = xrm;
		}

		getFilterFromCrmForm(filterString: string): string {
			if (this._xrm === null) {
				if (filterString.indexOf("{{") >= 0) {
					this._log.warn("Unable to set filter as Xrm is null.");
				}
				return filterString;
			}

			var result = filterString.replace(FilterService.attributeRegex, (match, attributeMatch, formatMatch, offset, src) => {
				return this.getAttributeFromCrmForm(attributeMatch, formatMatch);
			});

			return result;
		}

		getAttributeFromCrmForm(attribName: string, format: string): string {
			var attribValue = "";
			var getFormattedValue = format === "#F";
			var getEntityType = format === "#T";

			// Record id/name filtering
			if (attribName === "id") {
				if (getFormattedValue) {
					attribValue = this._xrm.Page.data.entity.getPrimaryAttributeValue();
				}
				else {
					attribValue = this._xrm.Page.data.entity.getId();
				}
			}

			// Filtering on form attributes
			else {
				var attrib = this._xrm.Page.getAttribute(attribName);

				if (!!attrib) {
					var attribType = attrib.getAttributeType();
					switch (attribType) {
						case "boolean":
						case "datetime":
						case "decimal":
						case "double":
						case "integer":
						case "money":
						case "memo":
						case "string":
							attribValue = (<any>attrib).getValue();
							break;
						case "optionset":
							var selectedOption = (<Xrm.Page.OptionSetAttribute>attrib).getSelectedOption();
							if (selectedOption !== null) {
								if (getFormattedValue) {
									attribValue = selectedOption.text;
								}
								else {
									attribValue = selectedOption.value;
								}
							}
							break;
						case "lookup":
							var lookupValue = (<Xrm.Page.LookupAttribute>attrib).getValue();
							if (lookupValue !== null && lookupValue.length > 0) {
								if (getFormattedValue) {
									attribValue = lookupValue[0].name;
								}
								else if (getEntityType) {
									attribValue = lookupValue[0].entityType;
								}
								else {
									attribValue = lookupValue[0].id;
								}
							}
					}
				}
			}

			return attribValue;
		}

		getFilterFromFunction(functionName: string): string {
			return <string>this.executeFunctionByName(functionName, this._window);
		}

		executeFunctionByName(functionName, context): any {
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for (var i = 0; i < namespaces.length; i++) {
				context = context[namespaces[i]];
			}

			return context[func].apply(context);
		}
	}
}