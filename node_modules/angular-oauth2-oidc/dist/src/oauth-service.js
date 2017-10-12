"use strict";
var js_base64_1 = require('js-base64');
var base64_js_1 = require('base64-js');
var _sha256 = require('sha256');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
var sha256 = _sha256;
var OAuthService = (function () {
    function OAuthService(http) {
        var _this = this;
        this.http = http;
        this.clientId = "";
        this.redirectUri = "";
        this.loginUrl = "";
        this.scope = "";
        this.resource = "";
        this.rngUrl = "";
        this.oidc = false;
        this.state = "";
        this.issuer = "";
        this.logoutUrl = "";
        this.clearHashAfterLogin = true;
        this.discoveryDocumentLoaded = false;
        this.grantTypesSupported = [];
        this._storage = localStorage;
        this.discoveryDocumentLoaded$ = rxjs_1.Observable.create(function (sender) {
            _this.discoveryDocumentLoadedSender = sender;
        }).publish().connect();
    }
    OAuthService.prototype.setStorage = function (storage) {
        this._storage = storage;
    };
    OAuthService.prototype.loadDiscoveryDocument = function (fullUrl) {
        var _this = this;
        if (fullUrl === void 0) { fullUrl = null; }
        return new Promise(function (resolve, reject) {
            if (!fullUrl) {
                fullUrl = _this.issuer + '/.well-known/openid-configuration';
            }
            _this.http.get(fullUrl).map(function (r) { return r.json(); }).subscribe(function (doc) {
                _this.loginUrl = doc.authorization_endpoint;
                _this.logoutUrl = doc.end_session_endpoint;
                _this.grantTypesSupported = doc.grant_types_supported;
                _this.issuer = doc.issuer;
                // this.jwks_uri = this.jwks_uri;
                _this.tokenEndpoint = doc.token_endpoint;
                _this.userinfoEndpoint = doc.userinfo_endpoint;
                _this.discoveryDocumentLoaded = true;
                _this.discoveryDocumentLoadedSender.next(doc);
                resolve(doc);
            }, function (err) {
                console.error('error loading dicovery document', err);
                reject(err);
            });
        });
    };
    OAuthService.prototype.fetchTokenUsingPasswordFlowAndLoadUserProfile = function (userName, password) {
        var _this = this;
        return this
            .fetchTokenUsingPasswordFlow(userName, password)
            .then(function () { return _this.loadUserProfile(); });
    };
    OAuthService.prototype.loadUserProfile = function () {
        var _this = this;
        if (!this.hasValidAccessToken())
            throw Error("Can not load User Profile without access_token");
        return new Promise(function (resolve, reject) {
            var headers = new http_1.Headers();
            headers.set('Authorization', 'Bearer ' + _this.getAccessToken());
            _this.http.get(_this.userinfoEndpoint, { headers: headers }).map(function (r) { return r.json(); }).subscribe(function (doc) {
                console.debug('userinfo received', doc);
                _this._storage.setItem('id_token_claims_obj', JSON.stringify(doc));
                resolve(doc);
            }, function (err) {
                console.error('error loading user info', err);
                reject(err);
            });
        });
    };
    OAuthService.prototype.fetchTokenUsingPasswordFlow = function (userName, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var search = new http_1.URLSearchParams();
            search.set('grant_type', 'password');
            search.set('client_id', _this.clientId);
            search.set('scope', _this.scope);
            search.set('username', userName);
            search.set('password', password);
            if (_this.dummyClientSecret) {
                search.set('client_secret', _this.dummyClientSecret);
            }
            var headers = new http_1.Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var params = search.toString();
            _this.http.post(_this.tokenEndpoint, params, { headers: headers }).map(function (r) { return r.json(); }).subscribe(function (tokenResponse) {
                console.debug('tokenResponse', tokenResponse);
                _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                resolve(tokenResponse);
            }, function (err) {
                console.error('Error performing password flow', err);
                reject(err);
            });
        });
    };
    OAuthService.prototype.refreshToken = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var search = new http_1.URLSearchParams();
            search.set('grant_type', 'refresh_token');
            search.set('client_id', _this.clientId);
            search.set('scope', _this.scope);
            search.set('refresh_token', _this._storage.getItem('refresh_token'));
            if (_this.dummyClientSecret) {
                search.set('client_secret', _this.dummyClientSecret);
            }
            var headers = new http_1.Headers();
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            var params = search.toString();
            _this.http.post(_this.tokenEndpoint, params, { headers: headers }).map(function (r) { return r.json(); }).subscribe(function (tokenResponse) {
                console.debug('refresh tokenResponse', tokenResponse);
                _this.storeAccessTokenResponse(tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_in);
                resolve(tokenResponse);
            }, function (err) {
                console.error('Error performing password flow', err);
                reject(err);
            });
        });
    };
    OAuthService.prototype.createLoginUrl = function (state) {
        var that = this;
        if (typeof state === "undefined") {
            state = "";
        }
        return this.createAndSaveNonce().then(function (nonce) {
            if (state) {
                state = nonce + ";" + state;
            }
            else {
                state = nonce;
            }
            var response_type = "token";
            if (that.oidc) {
                response_type = "id_token+token";
            }
            var url = that.loginUrl
                + "?response_type="
                + response_type
                + "&client_id="
                + encodeURIComponent(that.clientId)
                + "&state="
                + encodeURIComponent(state)
                + "&redirect_uri="
                + encodeURIComponent(that.redirectUri)
                + "&scope="
                + encodeURIComponent(that.scope);
            if (that.resource) {
                url += "&resource=" + encodeURIComponent(that.resource);
            }
            if (that.oidc) {
                url += "&nonce=" + encodeURIComponent(nonce);
            }
            return url;
        });
    };
    ;
    OAuthService.prototype.initImplicitFlow = function (additionalState) {
        if (additionalState === void 0) { additionalState = ""; }
        this.createLoginUrl(additionalState).then(function (url) {
            location.href = url;
        })
            .catch(function (error) {
            console.error("Error in initImplicitFlow");
            console.error(error);
        });
    };
    ;
    OAuthService.prototype.callEventIfExists = function (options) {
        var that = this;
        if (options.onTokenReceived) {
            var tokenParams = {
                idClaims: that.getIdentityClaims(),
                idToken: that.getIdToken(),
                accessToken: that.getAccessToken(),
                state: that.state
            };
            options.onTokenReceived(tokenParams);
        }
    };
    OAuthService.prototype.storeAccessTokenResponse = function (accessToken, refreshToken, expiresIn) {
        this._storage.setItem("access_token", accessToken);
        if (expiresIn) {
            var expiresInMilliSeconds = expiresIn * 1000;
            var now = new Date();
            var expiresAt = now.getTime() + expiresInMilliSeconds;
            this._storage.setItem("expires_at", "" + expiresAt);
        }
        if (refreshToken) {
            this._storage.setItem("refresh_token", refreshToken);
        }
    };
    OAuthService.prototype.tryLogin = function (options) {
        var _this = this;
        options = options || {};
        var parts = this.getFragment();
        var accessToken = parts["access_token"];
        var idToken = parts["id_token"];
        var state = parts["state"];
        var oidcSuccess = false;
        var oauthSuccess = false;
        if (!accessToken || !state)
            return false;
        if (this.oidc && !idToken)
            return false;
        var savedNonce = this._storage.getItem("nonce");
        var stateParts = state.split(';');
        var nonceInState = stateParts[0];
        if (savedNonce === nonceInState) {
            this.storeAccessTokenResponse(accessToken, null, parts['expires_in']);
            if (stateParts.length > 1) {
                this.state = stateParts[1];
            }
            oauthSuccess = true;
        }
        if (!oauthSuccess)
            return false;
        if (this.oidc) {
            oidcSuccess = this.processIdToken(idToken, accessToken);
            if (!oidcSuccess)
                return false;
        }
        if (options.validationHandler) {
            var validationParams = { accessToken: accessToken, idToken: idToken };
            options
                .validationHandler(validationParams)
                .then(function () {
                _this.callEventIfExists(options);
            })
                .catch(function (reason) {
                console.error('Error validating tokens');
                console.error(reason);
            });
        }
        else {
            this.callEventIfExists(options);
        }
        // NEXT VERSION: Notify parent-window (iframe-refresh)
        /*
        var win = window;
        if (win.parent && win.parent.onOAuthCallback) {
            win.parent.onOAuthCallback(this.state);
        }
        */
        if (this.clearHashAfterLogin)
            location.hash = '';
        return true;
    };
    ;
    OAuthService.prototype.processIdToken = function (idToken, accessToken) {
        var _this = this;
        var tokenParts = idToken.split(".");
        var claimsBase64 = this.padBase64(tokenParts[1]);
        var claimsJson = js_base64_1.Base64.decode(claimsBase64);
        var claims = JSON.parse(claimsJson);
        var savedNonce = this._storage.getItem("nonce");
        if (Array.isArray(claims.aud)) {
            if (claims.aud.every(function (v) { return v !== _this.clientId; })) {
                console.warn("Wrong audience: " + claims.aud.join(","));
                return false;
            }
        }
        else {
            if (claims.aud !== this.clientId) {
                console.warn("Wrong audience: " + claims.aud);
                return false;
            }
        }
        if (this.issuer && claims.iss !== this.issuer) {
            console.warn("Wrong issuer: " + claims.iss);
            return false;
        }
        if (claims.nonce !== savedNonce) {
            console.warn("Wrong nonce: " + claims.nonce);
            return false;
        }
        if (accessToken && !this.checkAtHash(accessToken, claims)) {
            console.warn("Wrong at_hash");
            return false;
        }
        // Das Prüfen des Zertifikates wird der Serverseite überlassen!
        var now = Date.now();
        var issuedAtMSec = claims.iat * 1000;
        var expiresAtMSec = claims.exp * 1000;
        var tenMinutesInMsec = 1000 * 60 * 10;
        if (issuedAtMSec - tenMinutesInMsec >= now || expiresAtMSec + tenMinutesInMsec <= now) {
            console.warn("Token has been expired");
            console.warn({
                now: now,
                issuedAtMSec: issuedAtMSec,
                expiresAtMSec: expiresAtMSec
            });
            return false;
        }
        this._storage.setItem("id_token", idToken);
        this._storage.setItem("id_token_claims_obj", claimsJson);
        this._storage.setItem("id_token_expires_at", "" + expiresAtMSec);
        if (this.validationHandler) {
            this.validationHandler(idToken);
        }
        return true;
    };
    OAuthService.prototype.getIdentityClaims = function () {
        var claims = this._storage.getItem("id_token_claims_obj");
        if (!claims)
            return null;
        return JSON.parse(claims);
    };
    OAuthService.prototype.getIdToken = function () {
        return this._storage.getItem("id_token");
    };
    OAuthService.prototype.padBase64 = function (base64data) {
        while (base64data.length % 4 !== 0) {
            base64data += "=";
        }
        return base64data;
    };
    OAuthService.prototype.tryLoginWithIFrame = function () {
        throw new Error("tryLoginWithIFrame has not been implemented so far");
    };
    ;
    OAuthService.prototype.tryRefresh = function (timeoutInMsec) {
        throw new Error("tryRefresh has not been implemented so far");
    };
    ;
    OAuthService.prototype.getAccessToken = function () {
        return this._storage.getItem("access_token");
    };
    ;
    OAuthService.prototype.hasValidAccessToken = function () {
        if (this.getAccessToken()) {
            var expiresAt = this._storage.getItem("expires_at");
            var now = new Date();
            if (expiresAt && parseInt(expiresAt) < now.getTime()) {
                return false;
            }
            return true;
        }
        return false;
    };
    ;
    OAuthService.prototype.hasValidIdToken = function () {
        if (this.getIdToken()) {
            var expiresAt = this._storage.getItem("id_token_expires_at");
            var now = new Date();
            if (expiresAt && parseInt(expiresAt) < now.getTime()) {
                return false;
            }
            return true;
        }
        return false;
    };
    ;
    OAuthService.prototype.authorizationHeader = function () {
        return "Bearer " + this.getAccessToken();
    };
    OAuthService.prototype.logOut = function (noRedirectToLogoutUrl) {
        if (noRedirectToLogoutUrl === void 0) { noRedirectToLogoutUrl = false; }
        var id_token = this.getIdToken();
        this._storage.removeItem("access_token");
        this._storage.removeItem("id_token");
        this._storage.removeItem("refresh_token");
        this._storage.removeItem("nonce");
        this._storage.removeItem("expires_at");
        this._storage.removeItem("id_token_claims_obj");
        this._storage.removeItem("id_token_expires_at");
        if (!this.logoutUrl)
            return;
        if (noRedirectToLogoutUrl)
            return;
        var logoutUrl;
        // For backward compatibility
        if (this.logoutUrl.indexOf('{{') > -1) {
            logoutUrl = this.logoutUrl.replace(/\{\{id_token\}\}/, id_token);
        }
        else {
            logoutUrl = this.logoutUrl + "?id_token_hint="
                + encodeURIComponent(id_token)
                + "&post_logout_redirect_uri="
                + encodeURIComponent(this.redirectUri);
        }
        location.href = logoutUrl;
    };
    ;
    OAuthService.prototype.createAndSaveNonce = function () {
        var that = this;
        return this.createNonce().then(function (nonce) {
            that._storage.setItem("nonce", nonce);
            return nonce;
        });
    };
    ;
    OAuthService.prototype.createNonce = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.rngUrl) {
                throw new Error("createNonce with rng-web-api has not been implemented so far");
            }
            else {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 40; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                resolve(text);
            }
        });
    };
    ;
    OAuthService.prototype.getFragment = function () {
        if (window.location.hash.indexOf("#") === 0) {
            return this.parseQueryString(window.location.hash.substr(1));
        }
        else {
            return {};
        }
    };
    ;
    OAuthService.prototype.parseQueryString = function (queryString) {
        var data = {}, pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;
        if (queryString === null) {
            return data;
        }
        pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
            pair = pairs[i];
            separatorIndex = pair.indexOf("=");
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
    ;
    OAuthService.prototype.checkAtHash = function (accessToken, idClaims) {
        if (!accessToken || !idClaims || !idClaims.at_hash)
            return true;
        var tokenHash = sha256(accessToken, { asBytes: true });
        var leftMostHalf = tokenHash.slice(0, (tokenHash.length / 2));
        var tokenHashBase64 = base64_js_1.fromByteArray(leftMostHalf);
        var atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        var claimsAtHash = idClaims.at_hash.replace(/=/g, "");
        var atHash = tokenHashBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        if (atHash != claimsAtHash) {
            console.warn("exptected at_hash: " + atHash);
            console.warn("actual at_hash: " + claimsAtHash);
        }
        return (atHash == claimsAtHash);
    };
    OAuthService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    OAuthService.ctorParameters = function () { return [
        { type: http_1.Http, },
    ]; };
    return OAuthService;
}());
exports.OAuthService = OAuthService;
//# sourceMappingURL=oauth-service.js.map