module PowerBiViewer.Directives {
	// Code based on https://github.com/mikaturunen/ng-onload

	export function onLoadDirective(): ng.IDirective {
		return {
			restrict: "A",
			scope: { callback: "&ngOnload" },
			link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
				let width: number = element[0].clientWidth;
				let height: number = element[0].clientHeight;

				element.on("load", (ev: Event) => {
					(<any>scope).callback({
						width: width,
						height: height
					});
				})
			}
		}
	}
}