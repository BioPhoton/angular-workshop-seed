import { ModuleWithProviders } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/publish';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/race';
export * from './oauth-service';
export * from './token-validation/jwks-validation-handler';
export * from './token-validation/null-validation-handler';
export * from './token-validation/validation-handler';
export * from './url-helper.service';
export * from './auth.config';
export * from './types';
export * from './tokens';
export * from './events';
export * from './interceptors/default-oauth.interceptor';
export * from './interceptors/resource-server-error-handler';
export * from './oauth-module.config';
import { OAuthModuleConfig } from "./oauth-module.config";
export declare function createDefaultStorage(): Storage;
export declare class OAuthModule {
    static forRoot(config?: OAuthModuleConfig): ModuleWithProviders;
}
