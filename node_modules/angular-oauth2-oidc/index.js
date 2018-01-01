import { Injectable, InjectionToken, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/publish';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/race';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

/**
 * Additional options that can be passt to tryLogin.
 */
var LoginOptions = (function () {
    function LoginOptions() {
    }
    return LoginOptions;
}());
/**
 * Defines a simple storage that can be used for
storing the tokens at client side.
Is compatible to localStorage and sessionStorage,
but you can also create your own implementations.
 * @abstract
 */
var OAuthStorage = (function () {
    function OAuthStorage() {
    }
    /**
     * @abstract
     * @param {?} key
     * @return {?}
     */
    OAuthStorage.prototype.getItem = function (key) { };
    /**
     * @abstract
     * @param {?} key
     * @return {?}
     */
    OAuthStorage.prototype.removeItem = function (key) { };
    /**
     * @abstract
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    OAuthStorage.prototype.setItem = function (key, data) { };
    return OAuthStorage;
}());
/**
 * Represents the received tokens, the received state
and the parsed claims from the id-token.
 */
var ReceivedTokens = (function () {
    function ReceivedTokens() {
    }
    return ReceivedTokens;
}());

/**
 * Interface for Handlers that are hooked in to
validate tokens.
 * @abstract
 */
var ValidationHandler = (function () {
    function ValidationHandler() {
    }
    /**
     * Validates the signature of an id_token.
     * @abstract
     * @param {?} validationParams
     * @return {?}
     */
    ValidationHandler.prototype.validateSignature = function (validationParams) { };
    /**
     * Validates the at_hash in an id_token against the received access_token.
     * @abstract
     * @param {?} validationParams
     * @return {?}
     */
    ValidationHandler.prototype.validateAtHash = function (validationParams) { };
    return ValidationHandler;
}());
/**
 * This abstract implementation of ValidationHandler already implements
the method validateAtHash. However, to make use of it,
you have to override the method calcHash.
 * @abstract
 */
var AbstractValidationHandler = (function () {
    function AbstractValidationHandler() {
    }
    /**
     * Validates the signature of an id_token.
     * @abstract
     * @param {?} validationParams
     * @return {?}
     */
    AbstractValidationHandler.prototype.validateSignature = function (validationParams) { };
    /**
     * Validates the at_hash in an id_token against the received access_token.
     * @param {?} params
     * @return {?}
     */
    AbstractValidationHandler.prototype.validateAtHash = function (params) {
        var /** @type {?} */ hashAlg = this.inferHashAlgorithm(params.idTokenHeader);
        var /** @type {?} */ tokenHash = this.calcHash(params.accessToken, hashAlg); // sha256(accessToken, { asString: true });
        var /** @type {?} */ leftMostHalf = tokenHash.substr(0, tokenHash.length / 2);
        var /** @type {?} */ tokenHashBase64 = btoa(leftMostHalf);
        var /** @type {?} */ atHash = tokenHashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        var /** @type {?} */ claimsAtHash = params.idTokenClaims['at_hash'].replace(/=/g, '');
        if (atHash !== claimsAtHash) {
            console.error('exptected at_hash: ' + atHash);
            console.error('actual at_hash: ' + claimsAtHash);
        }
        return (atHash === claimsAtHash);
    };
    /**
     * Infers the name of the hash algorithm to use
    from the alg field of an id_token.
    
    \@param jwtHeader the id_token's parsed header
     * @param {?} jwtHeader
     * @return {?}
     */
    AbstractValidationHandler.prototype.inferHashAlgorithm = function (jwtHeader) {
        var /** @type {?} */ alg = jwtHeader['alg'];
        if (!alg.match(/^.S[0-9]{3}$/)) {
            throw new Error('Algorithm not supported: ' + alg);
        }
        return 'sha' + alg.substr(2);
    };
    /**
     * Calculates the hash for the passed value by using
    the passed hash algorithm.
    
    \@param valueToHash
    \@param algorithm
     * @abstract
     * @param {?} valueToHash
     * @param {?} algorithm
     * @return {?}
     */
    AbstractValidationHandler.prototype.calcHash = function (valueToHash, algorithm) { };
    return AbstractValidationHandler;
}());

var UrlHelperService = (function () {
    function UrlHelperService() {
    }
    /**
     * @param {?=} customHashFragment
     * @return {?}
     */
    UrlHelperService.prototype.getHashFragmentParams = function (customHashFragment) {
        var /** @type {?} */ hash = customHashFragment || window.location.hash;
        hash = decodeURIComponent(hash);
        if (hash.indexOf('#') !== 0) {
            return {};
        }
        var /** @type {?} */ questionMarkPosition = hash.indexOf('?');
        if (questionMarkPosition > -1) {
            hash = hash.substr(questionMarkPosition + 1);
        }
        else {
            hash = hash.substr(1);
        }
        return this.parseQueryString(hash);
    };
    
    /**
     * @param {?} queryString
     * @return {?}
     */
    UrlHelperService.prototype.parseQueryString = function (queryString) {
        var /** @type {?} */ data = {}, /** @type {?} */ pairs, /** @type {?} */ pair, /** @type {?} */ separatorIndex, /** @type {?} */ escapedKey, /** @type {?} */ escapedValue, /** @type {?} */ key, /** @type {?} */ value;
        if (queryString === null) {
            return data;
        }
        pairs = queryString.split('&');
        for (var /** @type {?} */ i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf('=');
            if (separatorIndex === -1) {
                escapedKey = pair;
                escapedValue = null;
            }
            else {
                escapedKey = pair.substr(0, separatorIndex);
                escapedValue = pair.substr(separatorIndex + 1);
            }
            key = decodeURIComponent(escapedKey);
            value = decodeURIComponent(escapedValue);
            if (key.substr(0, 1) === '/')
                key = key.substr(1);
            data[key] = value;
        }
        return data;
    };
    
    return UrlHelperService;
}());
UrlHelperService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UrlHelperService.ctorParameters = function () { return []; };

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @abstract
 */
var OAuthEvent = (function () {
    /**
     * @param {?} type
     */
    function OAuthEvent(type) {
        this.type = type;
    }
    return OAuthEvent;
}());
var OAuthSuccessEvent = (function (_super) {
    __extends$1(OAuthSuccessEvent, _super);
    /**
     * @param {?} type
     * @param {?=} info
     */
    function OAuthSuccessEvent(type, info) {
        if (info === void 0) { info = null; }
        var _this = _super.call(this, type) || this;
        _this.info = info;
        return _this;
    }
    return OAuthSuccessEvent;
}(OAuthEvent));
var OAuthInfoEvent = (function (_super) {
    __extends$1(OAuthInfoEvent, _super);
    /**
     * @param {?} type
     * @param {?=} info
     */
    function OAuthInfoEvent(type, info) {
        if (info === void 0) { info = null; }
        var _this = _super.call(this, type) || this;
        _this.info = info;
        return _this;
    }
    return OAuthInfoEvent;
}(OAuthEvent));
var OAuthErrorEvent = (function (_super) {
    __extends$1(OAuthErrorEvent, _super);
    /**
     * @param {?} type
     * @param {?} reason
     * @param {?=} params
     */
    function OAuthErrorEvent(type, reason, params) {
        if (params === void 0) { params = null; }
        var _this = _super.call(this, type) || this;
        _this.reason = reason;
        _this.params = params;
        return _this;
    }
    return OAuthErrorEvent;
}(OAuthEvent));

/**
 * @param {?} str
 * @return {?}
 */
function b64DecodeUnicode(str) {
    var /** @type {?} */ base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');
    return decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

var AuthConfig = (function () {
    function AuthConfig() {
        /**
         * The client's id as registered with the auth server
         */
        this.clientId = '';
        /**
         * The client's redirectUri as registered with the auth server
         */
        this.redirectUri = '';
        /**
         * An optional second redirectUri where the auth server
        redirects the user to after logging out.
         */
        this.postLogoutRedirectUri = '';
        /**
         * The auth server's endpoint that allows to log
        the user in when using implicit flow.
         */
        this.loginUrl = '';
        /**
         * The requested scopes
         */
        this.scope = 'openid profile';
        this.resource = '';
        this.rngUrl = '';
        /**
         * Defines whether to use OpenId Connect during
        implicit flow.
         */
        this.oidc = true;
        /**
         * Defines whether to request a access token during
        implicit flow.
         */
        this.requestAccessToken = true;
        this.options = null;
        /**
         * The issuer's uri.
         */
        this.issuer = '';
        /**
         * The logout url.
         */
        this.logoutUrl = '';
        /**
         * Defines whether to clear the hash fragment after logging in.
         */
        this.clearHashAfterLogin = true;
        /**
         * Url of the token endpoint as defined by OpenId Connect and OAuth 2.
         */
        this.tokenEndpoint = null;
        /**
         * Url of the userinfo endpoint as defined by OpenId Connect.
         */
        this.userinfoEndpoint = null;
        this.responseType = 'token';
        /**
         * Defines whether additional debug information should
        be shown at the console.
         */
        this.showDebugInformation = false;
        /**
         * The redirect uri used when doing silent refresh.
         */
        this.silentRefreshRedirectUri = '';
        this.silentRefreshMessagePrefix = '';
        /**
         * Set this to true to display the iframe used for
        silent refresh for debugging.
         */
        this.silentRefreshShowIFrame = false;
        /**
         * Timeout for silent refresh.
        \@internal
        depreacted b/c of typo, see silentRefreshTimeout
         */
        this.siletRefreshTimeout = 1000 * 20;
        /**
         * Timeout for silent refresh.
         */
        this.silentRefreshTimeout = 1000 * 20;
        /**
         * Some auth servers don't allow using password flow
        w/o a client secreat while the standards do not
        demand for it. In this case, you can set a password
        here. As this passwort is exposed to the public
        it does not bring additional security and is therefore
        as good as using no password.
         */
        this.dummyClientSecret = null;
        /**
         * Defines whether https is required.
        The default value is remoteOnly which only allows
        http for localhost, while every other domains need
        to be used with https.
         */
        this.requireHttps = 'remoteOnly';
        /**
         * Defines whether every url provided by the discovery
        document has to start with the issuer's url.
         */
        this.strictDiscoveryDocumentValidation = true;
        /**
         * JSON Web Key Set (https://tools.ietf.org/html/rfc7517)
        with keys used to validate received id_tokens.
        This is taken out of the disovery document. Can be set manually too.
         */
        this.jwks = null;
        /**
         * Map with additional query parameter that are appended to
        the request when initializing implicit flow.
         */
        this.customQueryParams = null;
        this.silentRefreshIFrameName = 'angular-oauth-oidc-silent-refresh-iframe';
        /**
         * Defines when the token_timeout event should be raised.
        If you set this to the default value 0.75, the event
        is triggered after 75% of the token's life time.
         */
        this.timeoutFactor = 0.75;
        /**
         * If true, the lib will try to check whether the user
        is still logged in on a regular basis as described
        in http://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification
        \@type {boolean}
         */
        this.sessionChecksEnabled = false;
        /**
         * Intervall in msec for checking the session
        according to http://openid.net/specs/openid-connect-session-1_0.html#ChangeNotification
        \@type {number}
         */
        this.sessionCheckIntervall = 3 * 1000;
        /**
         * Url for the iframe used for session checks
         */
        this.sessionCheckIFrameUrl = null;
        /**
         * Name of the iframe to use for session checks
        \@type {number}
         */
        this.sessionCheckIFrameName = 'angular-oauth-oidc-check-session-iframe';
        /**
         * This property has been introduced to disable at_hash checks
        and is indented for Identity Provider that does not deliver
        an at_hash EVEN THOUGH its recommended by the OIDC specs.
        Of course, when disabling these checks the we are bypassing
        a security check which means we are more vulnerable.
         */
        this.disableAtHashCheck = false;
        this.skipSubjectCheck = false;
        this.useIdTokenHintForSilentRefresh = false;
        this.skipIssuerCheck = false;
    }
    
    return AuthConfig;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Service for logging in and logging out with
OIDC and OAuth2. Supports implicit flow and
password flow.
 */
var OAuthService = (function (_super) {
    __extends(OAuthService, _super);
    /**
     * @param {?} http
     * @param {?} storage
     * @param {?} tokenValidationHandler
     * @param {?} config
     * @param {?} urlHelper
     */
    function OAuthService(http$$1, storage, tokenValidationHandler, config, urlHelper) {
        var _this = _super.call(this) || this;
        _this.http = http$$1;
        _this.config = config;
        _this.urlHelper = urlHelper;
        /**
         * \@internal
         */
        _this.discoveryDocumentLoaded = false;
        /**
         * The received (passed around) state, when logging
        in with implicit flow.
         */
        _this.state = '';
        _this.eventsSubject = new Subject$1();
        _this.discoveryDocumentLoadedSubject = new Subject$1();
        _this.grantTypesSupported = [];
        _this.inImplicitFlow = false;
        _this.discoveryDocumentLoaded$ = _this.discoveryDocumentLoadedSubject.asObservable();
        _this.events = _this.eventsSubject.asObservable();
        if (tokenValidationHandler) {
            _this.tokenValidationHandler = tokenValidationHandler;
        }
        if (config) {
            _this.configure(config);
        }
        try {
            if (storage) {
                _this.setStorage(storage);
            }
            else if (typeof sessionStorage !== 'undefined') {
                _this.setStorage(sessionStorage);
            }
        }
        catch (e) {
            console.error('cannot access sessionStorage. Consider setting an own storage implementation using setStorage', e);
        }
        _this.setupRefreshTimer();
        return _this;
    }
    /**
     * Use this method to configure the service
    \@param config the configuration
     * @param {?} config
     * @return {?}
     */
    OAuthService.prototype.configure = function (config) {
        // For the sake of downward compatibility with
        // original configuration API
        Object.assign(this, new AuthConfig(), config);
        this.config = config;
        if (this.sessionChecksEnabled) {
            this.setupSessionCheck();
        }
        this.configChanged();
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.configChanged = function () {
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.restartSessionChecksIfStillLoggedIn = function () {
        if (this.hasValidIdToken()) {
            this.initSessionCheck();
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.restartRefreshTimerIfStillLoggedIn = function () {
        this.setupExpirationTimers();
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupSessionCheck = function () {
        var _this = this;
        this
            .events
            .filter(function (e) { return e.type === 'token_received'; })
            .subscribe(function (e) {
            _this.initSessionCheck();
        });
    };
    /**
     *
    \@param params Additional parameter to pass
     * @param {?=} params
     * @return {?}
     */
    OAuthService.prototype.setupAutomaticSilentRefresh = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        this.events
            .filter(function (e) { return e.type === 'token_expires'; })
            .subscribe(function (e) {
            _this.silentRefresh(params).catch(function (_) {
                _this.debug('automatic silent refresh did not work');
            });
        });
        this.restartRefreshTimerIfStillLoggedIn();
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    OAuthService.prototype.loadDiscoveryDocumentAndTryLogin = function (options) {
        var _this = this;
        if (options === void 0) { options = null; }
        return this.loadDiscoveryDocument().then(function (doc) {
            return _this.tryLogin(options);
        });
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    OAuthService.prototype.loadDiscoveryDocumentAndLogin = function (options) {
        var _this = this;
        if (options === void 0) { options = null; }
        return this.loadDiscoveryDocumentAndTryLogin(options).then(function (_) {
            if (!_this.hasValidIdToken() || !_this.hasValidAccessToken()) {
                _this.initImplicitFlow();
                return false;
            }
            else {
                return true;
            }
        });
    };
    /**
     * @param {...?} args
     * @return {?}
     */
    OAuthService.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.showDebugInformation) {
            console.debug.apply(console, args);
        }
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OAuthService.prototype.validateUrlFromDiscoveryDocument = function (url) {
        var /** @type {?} */ errors = [];
        var /** @type {?} */ httpsCheck = this.validateUrlForHttps(url);
        var /** @type {?} */ issuerCheck = this.validateUrlAgainstIssuer(url);
        if (!httpsCheck) {
            errors.push('https for all urls required. Also for urls received by discovery.');
        }
        if (!issuerCheck) {
            errors.push('Every url in discovery document has to start with the issuer url.'
                + 'Also see property strictDiscoveryDocumentValidation.');
        }
        return errors;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OAuthService.prototype.validateUrlForHttps = function (url) {
        if (!url)
            return true;
        var /** @type {?} */ lcUrl = url.toLowerCase();
        if (this.requireHttps === false)
            return true;
        if ((lcUrl.match(/^http:\/\/localhost($|[:\/])/)
            || lcUrl.match(/^http:\/\/localhost($|[:\/])/))
            && this.requireHttps === 'remoteOnly') {
            return true;
        }
        return lcUrl.startsWith('https://');
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OAuthService.prototype.validateUrlAgainstIssuer = function (url) {
        if (!this.strictDiscoveryDocumentValidation)
            return true;
        if (!url)
            return true;
        return url.toLowerCase().startsWith(this.issuer.toLowerCase());
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupRefreshTimer = function () {
        var _this = this;
        if (typeof window === 'undefined') {
            this.debug('timer not supported on this plattform');
            return;
        }
        if (this.hasValidIdToken) {
            this.clearAccessTokenTimer();
            this.clearIdTokenTimer();
            this.setupExpirationTimers();
        }
        this.events.filter(function (e) { return e.type === 'token_received'; }).subscribe(function (_) {
            _this.clearAccessTokenTimer();
            _this.clearIdTokenTimer();
            _this.setupExpirationTimers();
        });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupExpirationTimers = function () {
        var /** @type {?} */ idTokenExp = this.getIdTokenExpiration() || Number.MAX_VALUE;
        var /** @type {?} */ accessTokenExp = this.getAccessTokenExpiration() || Number.MAX_VALUE;
        var /** @type {?} */ useAccessTokenExp = accessTokenExp <= idTokenExp;
        if (this.hasValidAccessToken() && useAccessTokenExp) {
            this.setupAccessTokenTimer();
        }
        if (this.hasValidIdToken() && !useAccessTokenExp) {
            this.setupIdTokenTimer();
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupAccessTokenTimer = function () {
        var _this = this;
        var /** @type {?} */ expiration = this.getAccessTokenExpiration();
        var /** @type {?} */ storedAt = this.getAccessTokenStoredAt();
        var /** @type {?} */ timeout = this.calcTimeout(storedAt, expiration);
        this.accessTokenTimeoutSubscription =
            Observable$1
                .of(new OAuthInfoEvent('token_expires', 'access_token'))
                .delay(timeout)
                .subscribe(function (e) { return _this.eventsSubject.next(e); });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupIdTokenTimer = function () {
        var _this = this;
        var /** @type {?} */ expiration = this.getIdTokenExpiration();
        var /** @type {?} */ storedAt = this.getIdTokenStoredAt();
        var /** @type {?} */ timeout = this.calcTimeout(storedAt, expiration);
        this.idTokenTimeoutSubscription =
            Observable$1
                .of(new OAuthInfoEvent('token_expires', 'id_token'))
                .delay(timeout)
                .subscribe(function (e) { return _this.eventsSubject.next(e); });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.clearAccessTokenTimer = function () {
        if (this.accessTokenTimeoutSubscription) {
            this.accessTokenTimeoutSubscription.unsubscribe();
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.clearIdTokenTimer = function () {
        if (this.idTokenTimeoutSubscription) {
            this.idTokenTimeoutSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} storedAt
     * @param {?} expiration
     * @return {?}
     */
    OAuthService.prototype.calcTimeout = function (storedAt, expiration) {
        var /** @type {?} */ delta = (expiration - storedAt) * this.timeoutFactor;
        return delta;
    };
    /**
     * Sets a custom storage used to store the received
    tokens on client side. By default, the browser's
    sessionStorage is used.
    
    \@param storage
     * @param {?} storage
     * @return {?}
     */
    OAuthService.prototype.setStorage = function (storage) {
        this._storage = storage;
        this.configChanged();
    };
    /**
     * Loads the discovery document to configure most
    properties of this service. The url of the discovery
    document is infered from the issuer's url according
    to the OpenId Connect spec. To use another url you
    can pass it to to optional parameter fullUrl.
    
    \@param fullUrl
     * @param {?=} fullUrl
     * @return {?}
     */
    OAuthService.prototype.loadDiscoveryDocument = function (fullUrl) {
        var _this = this;
        if (fullUrl === void 0) { fullUrl = null; }
        return new Promise(function (resolve, reject) {
            if (!fullUrl) {
                fullUrl = _this.issuer || '';
                if (!fullUrl.endsWith('/')) {
                    fullUrl += '/';
                }
                fullUrl += '.well-known/openid-configuration';
            }
            if (!_this.validateUrlForHttps(fullUrl)) {
                reject('issuer must use Https. Also check property requireHttps.');
                return;
            }
            _this.http.get(fullUrl).subscribe(function (doc) {
                if (!_this.validateDiscoveryDocument(doc)) {
                    _this.eventsSubject.next(new OAuthErrorEvent('discovery_document_validation_error', null));
                    reject('discovery_document_validation_error');
                    return;
                }
                _this.loginUrl = doc.authorization_endpoint;
                _this.logoutUrl = doc.end_session_endpoint;
                _this.grantTypesSupported = doc.grant_types_supported;
                _this.issuer = doc.issuer;
                _this.tokenEndpoint = doc.token_endpoint;
                _this.userinfoEndpoint = doc.userinfo_endpoint;
                _this.jwksUri = doc.jwks_uri;
                _this.sessionCheckIFrameUrl = doc.check_session_iframe;
                _this.discoveryDocumentLoaded = true;
                _this.discoveryDocumentLoadedSubject.next(doc);
                if (_this.sessionChecksEnabled) {
                    _this.restartSessionChecksIfStillLoggedIn();
                }
                _this.loadJwks().then(function (jwks) {
                    var /** @type {?} */ result = {
                        discoveryDocument: doc,
                        jwks: jwks
                    };
                    var /** @type {?} */ event = new OAuthSuccessEvent('discovery_document_loaded', result);
                    _this.eventsSubject.next(event);
                    resolve(event);
                    return;
                }).catch(function (err) {
                    _this.eventsSubject.next(new OAuthErrorEvent('discovery_document_load_error', err));
                    reject(err);
                    return;
                });
            }, function (err) {
                console.error('error loading discovery document', err);
                _this.eventsSubject.next(new OAuthErrorEvent('discovery_document_load_error', err));
                reject(err);
            });
        });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.loadJwks = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.jwksUri) {
                _this.http.get(_this.jwksUri).subscribe(function (jwks) {
                    _this.jwks = jwks;
                    _this.eventsSubject.next(new OAuthSuccessEvent('discovery_document_loaded'));
                    resolve(jwks);
                }, function (err) {
                    console.error('error loading jwks', err);
                    _this.eventsSubject.next(new OAuthErrorEvent('jwks_load_error', err));
                    reject(err);
                });
            }
            else {
                resolve(null);
            }
        });
    };
    /**
     * @param {?} doc
     * @return {?}
     */
    OAuthService.prototype.validateDiscoveryDocument = function (doc) {
        var /** @type {?} */ errors;
        if (!this.skipIssuerCheck && doc.issuer !== this.issuer) {
            console.error('invalid issuer in discovery document', 'expected: ' + this.issuer, 'current: ' + doc.issuer);
            return false;
        }
        errors = this.validateUrlFromDiscoveryDocument(doc.authorization_endpoint);
        if (errors.length > 0) {
            console.error('error validating authorization_endpoint in discovery document', errors);
            return false;
        }
        errors = this.validateUrlFromDiscoveryDocument(doc.end_session_endpoint);
        if (errors.length > 0) {
            console.error('error validating end_session_endpoint in discovery document', errors);
            return false;
        }
        errors = this.validateUrlFromDiscoveryDocument(doc.token_endpoint);
        if (errors.length > 0) {
            console.error('error validating token_endpoint in discovery document', errors);
        }
        errors = this.validateUrlFromDiscoveryDocument(doc.userinfo_endpoint);
        if (errors.length > 0) {
            console.error('error validating userinfo_endpoint in discovery document', errors);
            return false;
        }
        errors = this.validateUrlFromDiscoveryDocument(doc.jwks_uri);
        if (errors.length > 0) {
            console.error('error validating jwks_uri in discovery document', errors);
            return false;
        }
        if (this.sessionChecksEnabled && !doc.check_session_iframe) {
            console.warn('sessionChecksEnabled is activated but discovery document'
                + ' does not contain a check_session_iframe field');
        }
        // this.sessionChecksEnabled = !!doc.check_session_iframe;
        return true;
    };
    /**
     * Uses password flow to exchange userName and password for an
    access_token. After receiving the access_token, this method
    uses it to query the userinfo endpoint in order to get information
    about the user in question.
    
    When using this, make sure that the property oidc is set to false.
    Otherwise stricter validations take happen that makes this operation
    fail.
    
    \@param userName
    \@param password
    \@param headers Optional additional http-headers.
     * @param {?} userName
     * @param {?} password
     * @param {?=} headers
     * @return {?}
     */
    OAuthService.prototype.fetchTokenUsingPasswordFlowAndLoadUserProfile = function (userName, password, headers) {
        var _this = this;
        if (headers === void 0) { headers = new HttpHeaders(); }
        return this
            .fetchTokenUsingPasswordFlow(userName, password, headers)
            .then(function () { return _this.loadUserProfile(); });
    };
    /**
     * Loads the user profile by accessing the user info endpoint defined by OpenId Connect.
    
    When using this with OAuth2 password flow, make sure that the property oidc is set to false.
    Otherwise stricter validations take happen that makes this operation
    fail.
     * @return {?}
     */
    OAuthService.prototype.loadUserProfile = function () {
        var _this = this;
        if (!this.hasValidAccessToken()) {
            throw new Error('Can not load User Profile without access_token');
        }
        if (!this.validateUrlForHttps(this.userinfoEndpoint)) {
            throw new Error('userinfoEndpoint must use Http. Also check property requireHttps.');
        }
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ headers = new HttpHeaders()
                .set('Authorization', 'Bearer ' + _this.getAccessToken());
            _this.http.get(_this.userinfoEndpoint, { headers: headers }).subscribe(function (info) {
                _this.debug('userinfo received', info);
                var /** @type {?} */ existingClaims = _this.getIdentityClaims() || {};
                if (!_this.skipSubjectCheck) {
                    if (_this.oidc && (!existingClaims['sub'] || info.sub !== existingClaims['sub'])) {
                        var /** @type {?} */ err = 'if property oidc is true, the received user-id (sub) has to be the user-id '
                            + 'of the user that has logged in with oidc.\n'
                            + 'if you are not using oidc but just oauth2 password flow set oidc to false';
                        reject(err);
                        return;
                    }
                }
                info = Object.assign({}, existingClaims, info);
                _this._storage.setItem('id_token_claims_obj', JSON.stringify(info));
                _this.eventsSubject.next(new OAuthSuccessEvent('user_profile_loaded'));
                resolve(info);
            }, function (err) {
                console.error('error loading user info', err);
                _this.eventsSubject.next(new OAuthErrorEvent('user_profile_load_error', err));
                reject(err);
            });
        });
    };
    /**
     * Uses password flow to exchange userName and password for an access_token.
    \@param userName
    \@param password
    \@param headers Optional additional http-headers.
     * @param {?} userName
     * @param {?} password
     * @param {?=} headers
     * @return {?}
     */
    OAuthService.prototype.fetchTokenUsingPasswordFlow = function (userName, password, headers) {
        var _this = this;
        if (headers === void 0) { headers = new HttpHeaders(); }
        if (!this.validateUrlForHttps(this.tokenEndpoint)) {
            throw new Error('tokenEndpoint must use Http. Also check property requireHttps.');
        }
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ params = new HttpParams()
                .set('grant_type', 'password')
                .set('client_id', _this.clientId)
                .set('scope', _this.scope)
                .set('username', userName)
                .set('password', password);
            if (_this.dummyClientSecret) {
                params = params.set('client_secret', _this.dummyClientSecret);
            }
            if (_this.customQueryParams) {
                for (var _i = 0, _a = Object.getOwnPropertyNames(_this.customQueryParams); _i < _a.length; _i++) {
                    var key = _a[_i];
                    params = params.set(key, _this.customQueryParams[key]);
                }
            }
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            _this.http.post(_this.tokenEndpoint, params, { headers: headers }).subscribe(function (tokenResponse) {
                _this.debug('tokenResponse', tokenResponse);
                _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                _this.eventsSubject.next(new OAuthSuccessEvent('token_received'));
                resolve(tokenResponse);
            }, function (err) {
                console.error('Error performing password flow', err);
                _this.eventsSubject.next(new OAuthErrorEvent('token_error', err));
                reject(err);
            });
        });
    };
    /**
     * Refreshes the token using a refresh_token.
    This does not work for implicit flow, b/c
    there is no refresh_token in this flow.
    A solution for this is provided by the
    method silentRefresh.
     * @return {?}
     */
    OAuthService.prototype.refreshToken = function () {
        var _this = this;
        if (!this.validateUrlForHttps(this.tokenEndpoint)) {
            throw new Error('tokenEndpoint must use Http. Also check property requireHttps.');
        }
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ params = new HttpParams()
                .set('grant_type', 'refresh_token')
                .set('client_id', _this.clientId)
                .set('scope', _this.scope)
                .set('refresh_token', _this._storage.getItem('refresh_token'));
            if (_this.dummyClientSecret) {
                params = params.set('client_secret', _this.dummyClientSecret);
            }
            if (_this.customQueryParams) {
                for (var _i = 0, _a = Object.getOwnPropertyNames(_this.customQueryParams); _i < _a.length; _i++) {
                    var key = _a[_i];
                    params = params.set(key, _this.customQueryParams[key]);
                }
            }
            var /** @type {?} */ headers = new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded');
            _this.http.post(_this.tokenEndpoint, params, { headers: headers }).subscribe(function (tokenResponse) {
                _this.debug('refresh tokenResponse', tokenResponse);
                _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                _this.eventsSubject.next(new OAuthSuccessEvent('token_received'));
                _this.eventsSubject.next(new OAuthSuccessEvent('token_refreshed'));
                resolve(tokenResponse);
            }, function (err) {
                console.error('Error performing password flow', err);
                _this.eventsSubject.next(new OAuthErrorEvent('token_refresh_error', err));
                reject(err);
            });
        });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.removeSilentRefreshEventListener = function () {
        if (this.silentRefreshPostMessageEventListener) {
            window.removeEventListener('message', this.silentRefreshPostMessageEventListener);
            this.silentRefreshPostMessageEventListener = null;
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupSilentRefreshEventListener = function () {
        var _this = this;
        this.removeSilentRefreshEventListener();
        this.silentRefreshPostMessageEventListener = function (e) {
            var /** @type {?} */ expectedPrefix = '#';
            if (_this.silentRefreshMessagePrefix) {
                expectedPrefix += _this.silentRefreshMessagePrefix;
            }
            if (!e || !e.data || typeof e.data !== 'string')
                return;
            var /** @type {?} */ prefixedMessage = e.data;
            if (!prefixedMessage.startsWith(expectedPrefix))
                return;
            var /** @type {?} */ message = '#' + prefixedMessage.substr(expectedPrefix.length);
            _this.tryLogin({
                customHashFragment: message,
                onLoginError: function (err) {
                    _this.eventsSubject.next(new OAuthErrorEvent('silent_refresh_error', err));
                },
                onTokenReceived: function () {
                    _this.eventsSubject.next(new OAuthSuccessEvent('silently_refreshed'));
                }
            })
                .catch(function (err) { return _this.debug('tryLogin during silent refresh failed', err); });
        };
        window.addEventListener('message', this.silentRefreshPostMessageEventListener);
    };
    /**
     * Performs a silent refresh for implicit flow.
    Use this method to get a new tokens when/ before
    the existing tokens expires.
     * @param {?=} params
     * @return {?}
     */
    OAuthService.prototype.silentRefresh = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        var /** @type {?} */ claims = this.getIdentityClaims() || {};
        if (this.useIdTokenHintForSilentRefresh
            && this.hasValidIdToken) {
            params['id_token_hint'] = this.getIdToken();
        }
        /*
        if (!claims) {
            throw new Error('cannot perform a silent refresh as the user is not logged in');
        }
        */
        if (!this.validateUrlForHttps(this.loginUrl))
            throw new Error('tokenEndpoint must use Https. Also check property requireHttps.');
        if (typeof document === 'undefined') {
            throw new Error('silent refresh is not supported on this platform');
        }
        var /** @type {?} */ existingIframe = document.getElementById(this.silentRefreshIFrameName);
        if (existingIframe) {
            document.body.removeChild(existingIframe);
        }
        this.silentRefreshSubject = claims['sub'];
        var /** @type {?} */ iframe = document.createElement('iframe');
        iframe.id = this.silentRefreshIFrameName;
        this.setupSilentRefreshEventListener();
        var /** @type {?} */ redirectUri = this.silentRefreshRedirectUri || this.redirectUri;
        this.createLoginUrl(null, null, redirectUri, true, params).then(function (url) {
            iframe.setAttribute('src', url);
            if (!_this.silentRefreshShowIFrame) {
                iframe.style['display'] = 'none';
            }
            document.body.appendChild(iframe);
        });
        var /** @type {?} */ errors = this.events.filter(function (e) { return e instanceof OAuthErrorEvent; }).first();
        var /** @type {?} */ success = this.events.filter(function (e) { return e.type === 'silently_refreshed'; }).first();
        var /** @type {?} */ timeout = Observable$1.of(new OAuthErrorEvent('silent_refresh_timeout', null))
            .delay(this.silentRefreshTimeout || this.siletRefreshTimeout);
        return Observable$1
            .race([errors, success, timeout])
            .do(function (e) {
            if (e.type === 'silent_refresh_timeout') {
                _this.eventsSubject.next(e);
            }
        })
            .map(function (e) {
            if (e instanceof OAuthErrorEvent) {
                throw e;
            }
            return e;
        })
            .toPromise();
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.canPerformSessionCheck = function () {
        if (!this.sessionChecksEnabled)
            return false;
        if (!this.sessionCheckIFrameUrl) {
            console.warn('sessionChecksEnabled is activated but there '
                + 'is no sessionCheckIFrameUrl');
            return false;
        }
        var /** @type {?} */ sessionState = this.getSessionState();
        if (!sessionState) {
            console.warn('sessionChecksEnabled is activated but there '
                + 'is no session_state');
            return false;
        }
        if (typeof document === 'undefined') {
            return false;
        }
        return true;
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.setupSessionCheckEventListener = function () {
        var _this = this;
        this.removeSessionCheckEventListener();
        this.sessionCheckEventListener = function (e) {
            var /** @type {?} */ origin = e.origin.toLowerCase();
            var /** @type {?} */ issuer = _this.issuer.toLowerCase();
            _this.debug('sessionCheckEventListener');
            if (!issuer.startsWith(origin)) {
                _this.debug('sessionCheckEventListener', 'wrong origin', origin, 'expected', issuer);
            }
            switch (e.data) {
                case 'unchanged':
                    _this.handleSessionUnchanged();
                    break;
                case 'changed':
                    _this.handleSessionChange();
                    break;
                case 'error':
                    _this.handleSessionError();
                    break;
            }
            _this.debug('got info from session check inframe', e);
        };
        window.addEventListener('message', this.sessionCheckEventListener);
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.handleSessionUnchanged = function () {
        this.debug('session check', 'session unchanged');
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.handleSessionChange = function () {
        var _this = this;
        /* events: session_changed, relogin, stopTimer, logged_out*/
        this.eventsSubject.next(new OAuthInfoEvent('session_changed'));
        this.stopSessionCheckTimer();
        if (this.silentRefreshRedirectUri) {
            this.silentRefresh()
                .catch(function (_) { return _this.debug('silent refresh failed after session changed'); });
            this.waitForSilentRefreshAfterSessionChange();
        }
        else {
            this.eventsSubject.next(new OAuthInfoEvent('session_terminated'));
            this.logOut(true);
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.waitForSilentRefreshAfterSessionChange = function () {
        var _this = this;
        this.events
            .filter(function (e) {
            return e.type === 'silently_refreshed'
                || e.type === 'silent_refresh_timeout'
                || e.type === 'silent_refresh_error';
        })
            .first()
            .subscribe(function (e) {
            if (e.type !== 'silently_refreshed') {
                _this.debug('silent refresh did not work after session changed');
                _this.eventsSubject.next(new OAuthInfoEvent('session_terminated'));
                _this.logOut(true);
            }
        });
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.handleSessionError = function () {
        this.stopSessionCheckTimer();
        this.eventsSubject.next(new OAuthInfoEvent('session_error'));
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.removeSessionCheckEventListener = function () {
        if (this.sessionCheckEventListener) {
            window.removeEventListener('message', this.sessionCheckEventListener);
            this.sessionCheckEventListener = null;
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.initSessionCheck = function () {
        if (!this.canPerformSessionCheck())
            return;
        var /** @type {?} */ existingIframe = document.getElementById(this.sessionCheckIFrameName);
        if (existingIframe) {
            document.body.removeChild(existingIframe);
        }
        var /** @type {?} */ iframe = document.createElement('iframe');
        iframe.id = this.sessionCheckIFrameName;
        this.setupSessionCheckEventListener();
        var /** @type {?} */ url = this.sessionCheckIFrameUrl;
        iframe.setAttribute('src', url);
        //iframe.style.visibility = 'hidden';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        this.startSessionCheckTimer();
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.startSessionCheckTimer = function () {
        this.stopSessionCheckTimer();
        this.sessionCheckTimer = setInterval(this.checkSession.bind(this), this.sessionCheckIntervall);
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.stopSessionCheckTimer = function () {
        if (this.sessionCheckTimer) {
            clearInterval(this.sessionCheckTimer);
            this.sessionCheckTimer = null;
        }
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.checkSession = function () {
        var /** @type {?} */ iframe = document.getElementById(this.sessionCheckIFrameName);
        if (!iframe) {
            console.warn('checkSession did not find iframe', this.sessionCheckIFrameName);
        }
        var /** @type {?} */ sessionState = this.getSessionState();
        if (!sessionState) {
            this.stopSessionCheckTimer();
        }
        var /** @type {?} */ message = this.clientId + ' ' + sessionState;
        iframe.contentWindow.postMessage(message, this.issuer);
    };
    /**
     * @param {?=} state
     * @param {?=} loginHint
     * @param {?=} customRedirectUri
     * @param {?=} noPrompt
     * @param {?=} params
     * @return {?}
     */
    OAuthService.prototype.createLoginUrl = function (state, loginHint, customRedirectUri, noPrompt, params) {
        var _this = this;
        if (state === void 0) { state = ''; }
        if (loginHint === void 0) { loginHint = ''; }
        if (customRedirectUri === void 0) { customRedirectUri = ''; }
        if (noPrompt === void 0) { noPrompt = false; }
        if (params === void 0) { params = {}; }
        var /** @type {?} */ that = this;
        var /** @type {?} */ redirectUri;
        if (customRedirectUri) {
            redirectUri = customRedirectUri;
        }
        else {
            redirectUri = this.redirectUri;
        }
        return this.createAndSaveNonce().then(function (nonce) {
            if (state) {
                state = nonce + ';' + state;
            }
            else {
                state = nonce;
            }
            if (!_this.requestAccessToken && !_this.oidc) {
                throw new Error('Either requestAccessToken or oidc or both must be true');
            }
            if (_this.oidc && _this.requestAccessToken) {
                _this.responseType = 'id_token token';
            }
            else if (_this.oidc && !_this.requestAccessToken) {
                _this.responseType = 'id_token';
            }
            else {
                _this.responseType = 'token';
            }
            var /** @type {?} */ seperationChar = (that.loginUrl.indexOf('?') > -1) ? '&' : '?';
            var /** @type {?} */ scope = that.scope;
            if (_this.oidc && !scope.match(/(^|\s)openid($|\s)/)) {
                scope = 'openid ' + scope;
            }
            var /** @type {?} */ url = that.loginUrl
                + seperationChar
                + 'response_type='
                + encodeURIComponent(that.responseType)
                + '&client_id='
                + encodeURIComponent(that.clientId)
                + '&state='
                + encodeURIComponent(state)
                + '&redirect_uri='
                + encodeURIComponent(redirectUri)
                + '&scope='
                + encodeURIComponent(scope);
            if (loginHint) {
                url += '&login_hint=' + encodeURIComponent(loginHint);
            }
            if (that.resource) {
                url += '&resource=' + encodeURIComponent(that.resource);
            }
            if (that.oidc) {
                url += '&nonce=' + encodeURIComponent(nonce);
            }
            if (noPrompt) {
                url += '&prompt=none';
            }
            for (var _i = 0, _a = Object.keys(params); _i < _a.length; _i++) {
                var key = _a[_i];
                url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }
            if (_this.customQueryParams) {
                for (var _b = 0, _c = Object.getOwnPropertyNames(_this.customQueryParams); _b < _c.length; _b++) {
                    var key = _c[_b];
                    url += '&' + key + '=' + encodeURIComponent(_this.customQueryParams[key]);
                }
            }
            return url;
        });
    };
    
    /**
     * @param {?=} additionalState
     * @param {?=} params
     * @return {?}
     */
    OAuthService.prototype.initImplicitFlowInternal = function (additionalState, params) {
        var _this = this;
        if (additionalState === void 0) { additionalState = ''; }
        if (params === void 0) { params = ''; }
        if (this.inImplicitFlow) {
            return;
        }
        this.inImplicitFlow = true;
        if (!this.validateUrlForHttps(this.loginUrl)) {
            throw new Error('loginUrl must use Http. Also check property requireHttps.');
        }
        var /** @type {?} */ addParams = {};
        var /** @type {?} */ loginHint = null;
        if (typeof params === 'string') {
            loginHint = params;
        }
        else if (typeof params === 'object') {
            addParams = params;
        }
        this.createLoginUrl(additionalState, loginHint, null, false, addParams).then(function (url) {
            location.href = url;
        })
            .catch(function (error) {
            console.error('Error in initImplicitFlow');
            console.error(error);
            _this.inImplicitFlow = false;
        });
    };
    
    /**
     * Starts the implicit flow and redirects to user to
    the auth servers login url.
    
    \@param additionalState Optinal state that is passes around.
     You find this state in the property ``state`` after ``tryLogin`` logged in the user.
    \@param params Hash with additional parameter. If it is a string, it is used for the
                  parameter loginHint (for the sake of compatibility with former versions)
     * @param {?=} additionalState
     * @param {?=} params
     * @return {?}
     */
    OAuthService.prototype.initImplicitFlow = function (additionalState, params) {
        var _this = this;
        if (additionalState === void 0) { additionalState = ''; }
        if (params === void 0) { params = ''; }
        if (this.loginUrl !== '') {
            this.initImplicitFlowInternal(additionalState, params);
        }
        else {
            this.events.filter(function (e) { return e.type === 'discovery_document_loaded'; })
                .subscribe(function (_) { return _this.initImplicitFlowInternal(additionalState, params); });
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    OAuthService.prototype.callOnTokenReceivedIfExists = function (options) {
        var /** @type {?} */ that = this;
        if (options.onTokenReceived) {
            var /** @type {?} */ tokenParams = {
                idClaims: that.getIdentityClaims(),
                idToken: that.getIdToken(),
                accessToken: that.getAccessToken(),
                state: that.state
            };
            options.onTokenReceived(tokenParams);
        }
    };
    /**
     * @param {?} accessToken
     * @param {?} refreshToken
     * @param {?} expiresIn
     * @return {?}
     */
    OAuthService.prototype.storeAccessTokenResponse = function (accessToken, refreshToken, expiresIn) {
        this._storage.setItem('access_token', accessToken);
        this._storage.setItem('access_token_stored_at', '' + Date.now());
        if (expiresIn) {
            var /** @type {?} */ expiresInMilliSeconds = expiresIn * 1000;
            var /** @type {?} */ now = new Date();
            var /** @type {?} */ expiresAt = now.getTime() + expiresInMilliSeconds;
            this._storage.setItem('expires_at', '' + expiresAt);
        }
        if (refreshToken) {
            this._storage.setItem('refresh_token', refreshToken);
        }
    };
    /**
     * Checks whether there are tokens in the hash fragment
    as a result of the implicit flow. These tokens are
    parsed, validated and used to sign the user in to the
    current client.
    
    \@param options Optinal options.
     * @param {?=} options
     * @return {?}
     */
    OAuthService.prototype.tryLogin = function (options) {
        var _this = this;
        if (options === void 0) { options = null; }
        options = options || {};
        var /** @type {?} */ parts;
        if (options.customHashFragment) {
            parts = this.urlHelper.getHashFragmentParams(options.customHashFragment);
        }
        else {
            parts = this.urlHelper.getHashFragmentParams();
        }
        this.debug('parsed url', parts);
        if (parts['error']) {
            this.debug('error trying to login');
            this.handleLoginError(options, parts);
            var /** @type {?} */ err = new OAuthErrorEvent('token_error', {}, parts);
            this.eventsSubject.next(err);
            return Promise.reject(err);
        }
        var /** @type {?} */ accessToken = parts['access_token'];
        var /** @type {?} */ idToken = parts['id_token'];
        var /** @type {?} */ state = decodeURIComponent(parts['state']);
        var /** @type {?} */ sessionState = parts['session_state'];
        if (!this.requestAccessToken && !this.oidc) {
            return Promise.reject('Either requestAccessToken or oidc or both must be true.');
        }
        if (this.requestAccessToken && !accessToken)
            return Promise.resolve();
        if (this.requestAccessToken && !options.disableOAuth2StateCheck && !state)
            return Promise.resolve();
        if (this.oidc && !idToken)
            return Promise.resolve();
        if (this.sessionChecksEnabled && !sessionState) {
            console.warn('session checks (Session Status Change Notification) '
                + 'is activated in the configuration but the id_token '
                + 'does not contain a session_state claim');
        }
        var /** @type {?} */ nonceInState = state;
        var /** @type {?} */ idx = state.indexOf(';');
        if (idx > -1) {
            nonceInState = state.substr(0, idx);
            this.state = state.substr(idx + 1);
        }
        /*
        let stateParts = state.split(';');
        if (stateParts.length > 1) {
            this.state = stateParts[1];
        }
        */
        // let nonceInState = stateParts[0];
        if (this.requestAccessToken && !options.disableOAuth2StateCheck) {
            var /** @type {?} */ success = this.validateNonceForAccessToken(accessToken, nonceInState);
            if (!success) {
                var /** @type {?} */ event_1 = new OAuthErrorEvent('invalid_nonce_in_state', null);
                this.eventsSubject.next(event_1);
                return Promise.reject(event_1);
            }
        }
        if (this.requestAccessToken) {
            this.storeAccessTokenResponse(accessToken, null, parts['expires_in'] | this.fallbackAccessTokenExpirationTimeInSec);
        }
        if (!this.oidc) {
            this.eventsSubject.next(new OAuthSuccessEvent('token_received'));
            if (this.clearHashAfterLogin)
                location.hash = '';
            return Promise.resolve();
        }
        return this
            .processIdToken(idToken, accessToken)
            .then(function (result) {
            if (options.validationHandler) {
                return options.validationHandler({
                    accessToken: accessToken,
                    idClaims: result.idTokenClaims,
                    idToken: result.idToken,
                    state: state
                }).then(function (_) { return result; });
            }
            return result;
        })
            .then(function (result) {
            _this.storeIdToken(result);
            _this.storeSessionState(sessionState);
            _this.eventsSubject.next(new OAuthSuccessEvent('token_received'));
            if (_this.clearHashAfterLogin)
                location.hash = '';
            _this.callOnTokenReceivedIfExists(options);
            _this.inImplicitFlow = false;
        })
            .catch(function (reason) {
            _this.eventsSubject.next(new OAuthErrorEvent('token_validation_error', reason));
            console.error('Error validating tokens');
            console.error(reason);
            return Promise.reject(reason);
        });
    };
    
    /**
     * @param {?} accessToken
     * @param {?} nonceInState
     * @return {?}
     */
    OAuthService.prototype.validateNonceForAccessToken = function (accessToken, nonceInState) {
        var /** @type {?} */ savedNonce = this._storage.getItem('nonce');
        if (savedNonce !== nonceInState) {
            var /** @type {?} */ err = 'validating access_token failed. wrong state/nonce.';
            console.error(err, savedNonce, nonceInState);
            return false;
        }
        return true;
    };
    /**
     * @param {?} idToken
     * @return {?}
     */
    OAuthService.prototype.storeIdToken = function (idToken) {
        this._storage.setItem('id_token', idToken.idToken);
        this._storage.setItem('id_token_claims_obj', idToken.idTokenClaimsJson);
        this._storage.setItem('id_token_expires_at', '' + idToken.idTokenExpiresAt);
        this._storage.setItem('id_token_stored_at', '' + Date.now());
    };
    /**
     * @param {?} sessionState
     * @return {?}
     */
    OAuthService.prototype.storeSessionState = function (sessionState) {
        this._storage.setItem('session_state', sessionState);
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.getSessionState = function () {
        return this._storage.getItem('session_state');
    };
    /**
     * @param {?} options
     * @param {?} parts
     * @return {?}
     */
    OAuthService.prototype.handleLoginError = function (options, parts) {
        if (options.onLoginError)
            options.onLoginError(parts);
        if (this.clearHashAfterLogin)
            location.hash = '';
    };
    /**
     * \@ignore
     * @param {?} idToken
     * @param {?} accessToken
     * @return {?}
     */
    OAuthService.prototype.processIdToken = function (idToken, accessToken) {
        var _this = this;
        var /** @type {?} */ tokenParts = idToken.split('.');
        var /** @type {?} */ headerBase64 = this.padBase64(tokenParts[0]);
        var /** @type {?} */ headerJson = b64DecodeUnicode(headerBase64);
        var /** @type {?} */ header = JSON.parse(headerJson);
        var /** @type {?} */ claimsBase64 = this.padBase64(tokenParts[1]);
        var /** @type {?} */ claimsJson = b64DecodeUnicode(claimsBase64);
        var /** @type {?} */ claims = JSON.parse(claimsJson);
        var /** @type {?} */ savedNonce = this._storage.getItem('nonce');
        if (Array.isArray(claims.aud)) {
            if (claims.aud.every(function (v) { return v !== _this.clientId; })) {
                var /** @type {?} */ err = 'Wrong audience: ' + claims.aud.join(',');
                console.warn(err);
                return Promise.reject(err);
            }
        }
        else {
            if (claims.aud !== this.clientId) {
                var /** @type {?} */ err = 'Wrong audience: ' + claims.aud;
                console.warn(err);
                return Promise.reject(err);
            }
        }
        /*
        if (this.getKeyCount() > 1 && !header.kid) {
            let err = 'There needs to be a kid property in the id_token header when multiple keys are defined via the property jwks';
            console.warn(err);
            return Promise.reject(err);
        }
        */
        if (!claims.sub) {
            var /** @type {?} */ err = 'No sub claim in id_token';
            console.warn(err);
            return Promise.reject(err);
        }
        /* For now, we only check whether the sub against
         * silentRefreshSubject when sessionChecksEnabled is on
         * We will reconsider in a later version to do this
         * in every other case too.
         */
        if (this.sessionChecksEnabled
            && this.silentRefreshSubject
            && this.silentRefreshSubject !== claims['sub']) {
            var /** @type {?} */ err = 'After refreshing, we got an id_token for another user (sub). '
                + ("Expected sub: " + this.silentRefreshSubject + ", received sub: " + claims['sub']);
            console.warn(err);
            return Promise.reject(err);
        }
        if (!claims.iat) {
            var /** @type {?} */ err = 'No iat claim in id_token';
            console.warn(err);
            return Promise.reject(err);
        }
        if (claims.iss !== this.issuer) {
            var /** @type {?} */ err = 'Wrong issuer: ' + claims.iss;
            console.warn(err);
            return Promise.reject(err);
        }
        if (claims.nonce !== savedNonce) {
            var /** @type {?} */ err = 'Wrong nonce: ' + claims.nonce;
            console.warn(err);
            return Promise.reject(err);
        }
        if (!this.disableAtHashCheck && this.requestAccessToken && !claims['at_hash']) {
            var /** @type {?} */ err = 'An at_hash is needed!';
            console.warn(err);
            return Promise.reject(err);
        }
        var /** @type {?} */ now = Date.now();
        var /** @type {?} */ issuedAtMSec = claims.iat * 1000;
        var /** @type {?} */ expiresAtMSec = claims.exp * 1000;
        var /** @type {?} */ tenMinutesInMsec = 1000 * 60 * 10;
        if (issuedAtMSec - tenMinutesInMsec >= now || expiresAtMSec + tenMinutesInMsec <= now) {
            var /** @type {?} */ err = 'Token has been expired';
            console.error(err);
            console.error({
                now: now,
                issuedAtMSec: issuedAtMSec,
                expiresAtMSec: expiresAtMSec
            });
            return Promise.reject(err);
        }
        var /** @type {?} */ validationParams = {
            accessToken: accessToken,
            idToken: idToken,
            jwks: this.jwks,
            idTokenClaims: claims,
            idTokenHeader: header,
            loadKeys: function () { return _this.loadJwks(); }
        };
        if (!this.disableAtHashCheck && this.requestAccessToken && !this.checkAtHash(validationParams)) {
            var /** @type {?} */ err = 'Wrong at_hash';
            console.warn(err);
            return Promise.reject(err);
        }
        return this.checkSignature(validationParams).then(function (_) {
            var /** @type {?} */ result = {
                idToken: idToken,
                idTokenClaims: claims,
                idTokenClaimsJson: claimsJson,
                idTokenHeader: header,
                idTokenHeaderJson: headerJson,
                idTokenExpiresAt: expiresAtMSec,
            };
            return result;
        });
    };
    /**
     * Returns the received claims about the user.
     * @return {?}
     */
    OAuthService.prototype.getIdentityClaims = function () {
        var /** @type {?} */ claims = this._storage.getItem('id_token_claims_obj');
        if (!claims)
            return null;
        return JSON.parse(claims);
    };
    /**
     * Returns the current id_token.
     * @return {?}
     */
    OAuthService.prototype.getIdToken = function () {
        return this._storage.getItem('id_token');
    };
    /**
     * @param {?} base64data
     * @return {?}
     */
    OAuthService.prototype.padBase64 = function (base64data) {
        while (base64data.length % 4 !== 0) {
            base64data += '=';
        }
        return base64data;
    };
    /**
     * Returns the current access_token.
     * @return {?}
     */
    OAuthService.prototype.getAccessToken = function () {
        return this._storage.getItem('access_token');
    };
    
    /**
     * @return {?}
     */
    OAuthService.prototype.getRefreshToken = function () {
        return this._storage.getItem('refresh_token');
    };
    /**
     * Returns the expiration date of the access_token
    as milliseconds since 1970.
     * @return {?}
     */
    OAuthService.prototype.getAccessTokenExpiration = function () {
        if (!this._storage.getItem('expires_at'))
            return null;
        return parseInt(this._storage.getItem('expires_at'), 10);
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.getAccessTokenStoredAt = function () {
        return parseInt(this._storage.getItem('access_token_stored_at'), 10);
    };
    /**
     * @return {?}
     */
    OAuthService.prototype.getIdTokenStoredAt = function () {
        return parseInt(this._storage.getItem('id_token_stored_at'), 10);
    };
    /**
     * Returns the expiration date of the id_token
    as milliseconds since 1970.
     * @return {?}
     */
    OAuthService.prototype.getIdTokenExpiration = function () {
        if (!this._storage.getItem('id_token_expires_at'))
            return null;
        return parseInt(this._storage.getItem('id_token_expires_at'), 10);
    };
    /**
     * Checkes, whether there is a valid access_token.
     * @return {?}
     */
    OAuthService.prototype.hasValidAccessToken = function () {
        if (this.getAccessToken()) {
            var /** @type {?} */ expiresAt = this._storage.getItem('expires_at');
            var /** @type {?} */ now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
                return false;
            }
            return true;
        }
        return false;
    };
    
    /**
     * Checkes, whether there is a valid id_token.
     * @return {?}
     */
    OAuthService.prototype.hasValidIdToken = function () {
        if (this.getIdToken()) {
            var /** @type {?} */ expiresAt = this._storage.getItem('id_token_expires_at');
            var /** @type {?} */ now = new Date();
            if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
                return false;
            }
            return true;
        }
        return false;
    };
    
    /**
     * Returns the auth-header that can be used
    to transmit the access_token to a service
     * @return {?}
     */
    OAuthService.prototype.authorizationHeader = function () {
        return 'Bearer ' + this.getAccessToken();
    };
    /**
     * Removes all tokens and logs the user out.
    If a logout url is configured, the user is
    redirected to it.
    \@param noRedirectToLogoutUrl
     * @param {?=} noRedirectToLogoutUrl
     * @return {?}
     */
    OAuthService.prototype.logOut = function (noRedirectToLogoutUrl) {
        if (noRedirectToLogoutUrl === void 0) { noRedirectToLogoutUrl = false; }
        var /** @type {?} */ id_token = this.getIdToken();
        this._storage.removeItem('access_token');
        this._storage.removeItem('id_token');
        this._storage.removeItem('refresh_token');
        this._storage.removeItem('nonce');
        this._storage.removeItem('expires_at');
        this._storage.removeItem('id_token_claims_obj');
        this._storage.removeItem('id_token_expires_at');
        this._storage.removeItem('id_token_stored_at');
        this._storage.removeItem('access_token_stored_at');
        this.silentRefreshSubject = null;
        this.eventsSubject.next(new OAuthInfoEvent('logout'));
        if (!this.logoutUrl)
            return;
        if (noRedirectToLogoutUrl)
            return;
        if (!id_token)
            return;
        var /** @type {?} */ logoutUrl;
        if (!this.validateUrlForHttps(this.logoutUrl))
            throw new Error('logoutUrl must use Http. Also check property requireHttps.');
        // For backward compatibility
        if (this.logoutUrl.indexOf('{{') > -1) {
            logoutUrl = this.logoutUrl.replace(/\{\{id_token\}\}/, id_token);
        }
        else {
            logoutUrl = this.logoutUrl +
                (this.logoutUrl.indexOf('?') > -1 ? '&' : '?')
                + 'id_token_hint='
                + encodeURIComponent(id_token)
                + '&post_logout_redirect_uri='
                + encodeURIComponent(this.postLogoutRedirectUri || this.redirectUri);
        }
        location.href = logoutUrl;
    };
    
    /**
     * \@ignore
     * @return {?}
     */
    OAuthService.prototype.createAndSaveNonce = function () {
        var /** @type {?} */ that = this;
        return this.createNonce().then(function (nonce) {
            that._storage.setItem('nonce', nonce);
            return nonce;
        });
    };
    
    /**
     * @return {?}
     */
    OAuthService.prototype.createNonce = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.rngUrl) {
                throw new Error('createNonce with rng-web-api has not been implemented so far');
            }
            else {
                var /** @type {?} */ text = '';
                var /** @type {?} */ possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (var /** @type {?} */ i = 0; i < 40; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                resolve(text);
            }
        });
    };
    
    /**
     * @param {?} params
     * @return {?}
     */
    OAuthService.prototype.checkAtHash = function (params) {
        if (!this.tokenValidationHandler) {
            console.warn('No tokenValidationHandler configured. Cannot check at_hash.');
            return true;
        }
        return this.tokenValidationHandler.validateAtHash(params);
    };
    /**
     * @param {?} params
     * @return {?}
     */
    OAuthService.prototype.checkSignature = function (params) {
        if (!this.tokenValidationHandler) {
            console.warn('No tokenValidationHandler configured. Cannot check signature.');
            return Promise.resolve(null);
        }
        return this.tokenValidationHandler.validateSignature(params);
    };
    return OAuthService;
}(AuthConfig));
OAuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
OAuthService.ctorParameters = function () { return [
    { type: HttpClient, },
    { type: OAuthStorage, decorators: [{ type: Optional },] },
    { type: ValidationHandler, decorators: [{ type: Optional },] },
    { type: AuthConfig, decorators: [{ type: Optional },] },
    { type: UrlHelperService, },
]; };

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var rs = require('jsrsasign');
/**
 * Validates the signature of an id_token against one
of the keys of an JSON Web Key Set (jwks).

This jwks can be provided by the discovery document.
 */
var JwksValidationHandler = (function (_super) {
    __extends$2(JwksValidationHandler, _super);
    function JwksValidationHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Allowed algorithms
         */
        _this.allowedAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];
        /**
         * Time period in seconds the timestamp in the signature can
        differ from the current time.
         */
        _this.gracePeriodInSec = 600;
        return _this;
    }
    /**
     * @param {?} params
     * @param {?=} retry
     * @return {?}
     */
    JwksValidationHandler.prototype.validateSignature = function (params, retry) {
        var _this = this;
        if (retry === void 0) { retry = false; }
        if (!params.idToken)
            throw new Error('Parameter idToken expected!');
        if (!params.idTokenHeader)
            throw new Error('Parameter idTokenHandler expected.');
        if (!params.jwks)
            throw new Error('Parameter jwks expected!');
        if (!params.jwks['keys'] || !Array.isArray(params.jwks['keys']) || params.jwks['keys'].length === 0) {
            throw new Error('Array keys in jwks missing!');
        }
        // console.debug('validateSignature: retry', retry);
        var /** @type {?} */ kid = params.idTokenHeader['kid'];
        var /** @type {?} */ keys = params.jwks['keys'];
        var /** @type {?} */ key;
        var /** @type {?} */ alg = params.idTokenHeader['alg'];
        if (kid) {
            key = keys.find(function (k) { return k['kid'] === kid; } /* && k['use'] === 'sig' */);
        }
        else {
            var /** @type {?} */ kty_1 = this.alg2kty(alg);
            var /** @type {?} */ matchingKeys = keys.filter(function (k) { return k['kty'] === kty_1 && k['use'] === 'sig'; });
            /*
            if (matchingKeys.length == 0) {
                let error = 'No matching key found.';
                console.error(error);
                return Promise.reject(error);
            }*/
            if (matchingKeys.length > 1) {
                var /** @type {?} */ error = 'More than one matching key found. Please specify a kid in the id_token header.';
                console.error(error);
                return Promise.reject(error);
            }
            else if (matchingKeys.length === 1) {
                key = matchingKeys[0];
            }
        }
        if (!key && !retry && params.loadKeys) {
            return params
                .loadKeys()
                .then(function (loadedKeys) { return params.jwks = loadedKeys; })
                .then(function (_) { return _this.validateSignature(params, true); });
        }
        if (!key && retry && !kid) {
            var /** @type {?} */ error = 'No matching key found.';
            console.error(error);
            return Promise.reject(error);
        }
        if (!key && retry && kid) {
            var /** @type {?} */ error = 'expected key not found in property jwks. '
                + 'This property is most likely loaded with the '
                + 'discovery document. '
                + 'Expected key id (kid): ' + kid;
            console.error(error);
            return Promise.reject(error);
        }
        var /** @type {?} */ keyObj = rs.KEYUTIL.getKey(key);
        var /** @type {?} */ validationOptions = {
            alg: this.allowedAlgorithms,
            gracePeriod: this.gracePeriodInSec
        };
        var /** @type {?} */ isValid = rs.KJUR.jws.JWS.verifyJWT(params.idToken, keyObj, validationOptions);
        if (isValid) {
            return Promise.resolve();
        }
        else {
            return Promise.reject('Signature not valid');
        }
    };
    /**
     * @param {?} alg
     * @return {?}
     */
    JwksValidationHandler.prototype.alg2kty = function (alg) {
        switch (alg.charAt(0)) {
            case 'R': return 'RSA';
            case 'E': return 'EC';
            default: throw new Error('Cannot infer kty from alg: ' + alg);
        }
    };
    /**
     * @param {?} valueToHash
     * @param {?} algorithm
     * @return {?}
     */
    JwksValidationHandler.prototype.calcHash = function (valueToHash, algorithm) {
        var /** @type {?} */ hashAlg = new rs.KJUR.crypto.MessageDigest({ alg: algorithm });
        var /** @type {?} */ result = hashAlg.digestString(valueToHash);
        var /** @type {?} */ byteArrayAsString = this.toByteArrayAsString(result);
        return byteArrayAsString;
    };
    /**
     * @param {?} hexString
     * @return {?}
     */
    JwksValidationHandler.prototype.toByteArrayAsString = function (hexString) {
        var /** @type {?} */ result = '';
        for (var /** @type {?} */ i = 0; i < hexString.length; i += 2) {
            var /** @type {?} */ hexDigit = hexString.charAt(i) + hexString.charAt(i + 1);
            var /** @type {?} */ num = parseInt(hexDigit, 16);
            result += String.fromCharCode(num);
        }
        return result;
    };
    return JwksValidationHandler;
}(AbstractValidationHandler));

/**
 * A validation handler that isn't validating nothing.
Can be used to skip validation (on your own risk).
 */
var NullValidationHandler = (function () {
    function NullValidationHandler() {
    }
    /**
     * @param {?} validationParams
     * @return {?}
     */
    NullValidationHandler.prototype.validateSignature = function (validationParams) {
        return Promise.resolve(null);
    };
    /**
     * @param {?} validationParams
     * @return {?}
     */
    NullValidationHandler.prototype.validateAtHash = function (validationParams) {
        return true;
    };
    return NullValidationHandler;
}());

var AUTH_CONFIG = new InjectionToken('AUTH_CONFIG');

/**
 * @abstract
 */
var OAuthResourceServerErrorHandler = (function () {
    function OAuthResourceServerErrorHandler() {
    }
    /**
     * @abstract
     * @param {?} err
     * @return {?}
     */
    OAuthResourceServerErrorHandler.prototype.handleError = function (err) { };
    return OAuthResourceServerErrorHandler;
}());
var OAuthNoopResourceServerErrorHandler = (function () {
    function OAuthNoopResourceServerErrorHandler() {
    }
    /**
     * @param {?} err
     * @return {?}
     */
    OAuthNoopResourceServerErrorHandler.prototype.handleError = function (err) {
        return Observable$1.throw(err);
    };
    return OAuthNoopResourceServerErrorHandler;
}());

/**
 * @abstract
 */
var OAuthModuleConfig = (function () {
    function OAuthModuleConfig() {
    }
    return OAuthModuleConfig;
}());
/**
 * @abstract
 */
var OAuthResourceServerConfig = (function () {
    function OAuthResourceServerConfig() {
    }
    return OAuthResourceServerConfig;
}());

var DefaultOAuthInterceptor = (function () {
    /**
     * @param {?} authStorage
     * @param {?} errorHandler
     * @param {?} moduleConfig
     */
    function DefaultOAuthInterceptor(authStorage, errorHandler, moduleConfig) {
        this.authStorage = authStorage;
        this.errorHandler = errorHandler;
        this.moduleConfig = moduleConfig;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    DefaultOAuthInterceptor.prototype.checkUrl = function (url) {
        var /** @type {?} */ found = this.moduleConfig.resourceServer.allowedUrls.find(function (u) { return url.startsWith(u); });
        return !!found;
    };
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    DefaultOAuthInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        var /** @type {?} */ url = req.url.toLowerCase();
        if (!this.moduleConfig)
            return next.handle(req);
        if (!this.moduleConfig.resourceServer)
            return next.handle(req);
        if (!this.moduleConfig.resourceServer.allowedUrls)
            return next.handle(req);
        if (!this.checkUrl(url))
            return next.handle(req);
        var /** @type {?} */ sendAccessToken = this.moduleConfig.resourceServer.sendAccessToken;
        if (sendAccessToken) {
            var /** @type {?} */ token = this.authStorage.getItem('access_token');
            var /** @type {?} */ header = 'Bearer ' + token;
            var /** @type {?} */ headers = req.headers
                .set('Authorization', header);
            req = req.clone({ headers: headers });
        }
        return next.handle(req).catch(function (err) { return _this.errorHandler.handleError(err); });
    };
    return DefaultOAuthInterceptor;
}());
DefaultOAuthInterceptor.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DefaultOAuthInterceptor.ctorParameters = function () { return [
    { type: OAuthStorage, },
    { type: OAuthResourceServerErrorHandler, },
    { type: OAuthModuleConfig, decorators: [{ type: Optional },] },
]; };

/**
 * @return {?}
 */
function createDefaultStorage() {
    return (typeof sessionStorage !== 'undefined') ? sessionStorage : null;
}
var OAuthModule = (function () {
    function OAuthModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    OAuthModule.forRoot = function (config) {
        //const setupInterceptor = config && config.resourceServer && config.resourceServer.allowedUrls;
        if (config === void 0) { config = null; }
        return {
            ngModule: OAuthModule,
            providers: [
                OAuthService,
                UrlHelperService,
                { provide: OAuthStorage, useFactory: createDefaultStorage },
                { provide: OAuthResourceServerErrorHandler, useClass: OAuthNoopResourceServerErrorHandler },
                { provide: OAuthModuleConfig, useValue: config },
                { provide: HTTP_INTERCEPTORS, useClass: DefaultOAuthInterceptor, multi: true }
            ]
        };
    };
    return OAuthModule;
}());
OAuthModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [],
                exports: []
            },] },
];
/**
 * @nocollapse
 */
OAuthModule.ctorParameters = function () { return []; };

export { createDefaultStorage, OAuthModule, OAuthService, JwksValidationHandler, NullValidationHandler, ValidationHandler, AbstractValidationHandler, UrlHelperService, AuthConfig, LoginOptions, OAuthStorage, ReceivedTokens, AUTH_CONFIG, OAuthEvent, OAuthSuccessEvent, OAuthInfoEvent, OAuthErrorEvent, DefaultOAuthInterceptor, OAuthResourceServerErrorHandler, OAuthNoopResourceServerErrorHandler, OAuthModuleConfig, OAuthResourceServerConfig };
