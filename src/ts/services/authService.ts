module PowerBiViewer.Services {
	export interface IAuthService {
		waitForAuth(): ng.IPromise<void>
	}

	export class AuthService implements IAuthService {
		static $inject: Array<string> = ['adalAuthenticationService', '$log', '$q'];

		private _adal;
		private _log: ng.ILogService;
		private _q: ng.IQService

		constructor(adalProvider, $log: ng.ILogService, $q: ng.IQService) {
			this._adal = adalProvider;
			this._log = $log;
			this._q = $q;
		}

		waitForAuth(): ng.IPromise<void> {
			let adal = this._adal;

			return this._q<void>((resolve, reject) => {
				if (adal.userInfo.isAuthenticated) {
					resolve();
				}
				else {
					var pollTimer = setInterval(() => {
						if (adal.userInfo.isAuthenticated) {
							clearInterval(pollTimer);
							resolve();
						}
					}, 20);
				}
			});
		}
	}
}