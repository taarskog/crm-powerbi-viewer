module PowerBiViewer.Directives {

	export class clipboardDirective {
		static get name(): string { return "ngClipboard"; }
		static get(): ng.IDirective {
			return {
				restrict: "A",
				scope: {
					ngClipboardSuccess: '&',
					ngClipboardError: '&'
				},
				link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
					let clipboard = new Clipboard(element[0]);

					clipboard.on('success', (ev: Event) => {
						scope.$apply(() => {
							(<any>scope).ngClipboardSuccess({ ev: ev });
						});
					});

					clipboard.on('error', (ev: Event) => {
						scope.$apply(() => {
							(<any>scope).ngClipboardError({ ev: ev });
						});
					});
				}
			}
		}
	}
}
