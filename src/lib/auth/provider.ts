import * as oauth from 'oauth4webapi';
import type { RequestEvent } from '@sveltejs/kit';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	COOKIE_SECRET
} from '$env/static/private';
import { getSignedCookie, getSignedCookieValue } from './http';

type SocialAuthProviderPropsBase = {
	// Unique provider name which will be used to resolve /auth/:provider routes
	name: string;
	// Could be a openid-client Issuer or a string for a well-known discovery URL or a metadata object used to construct an Issuer
	issuer: URL | string;
	type: 'oauth2' | 'oidc';
	client: oauth.Client;
	authParams: {
		scope: string;
		redirectUri: string;
		// Specific to specific providers
		prompt?: string;
	};
	// Paramater to determine if the state parameter of the OAuth flow should be used and checked
	useState?: boolean;
	usePkce?: boolean;
	// openIdClientOptions?: Omit<ClientMetadata, 'client_id' | 'client_secret'>;
	userInfoUrl?: string;
	accessTokenEndpoint?: string;
};

export type SocialAuthProviderProps = SocialAuthProviderPropsBase & {
	discoveryUrl?: string;
	authEndpoint?: string;
};

export interface SocialAuthProvider {
	name: string;
	generateAuthUrl(): Promise<{
		url: string;
		state?: string;
		codeVerifier?: string;
	}>;

	handleCallback(
		req: RequestEvent,
		stateKey?: string,
		codeKey?: string
	): Promise<oauth.OAuth2TokenEndpointResponse | oauth.OpenIDTokenEndpointResponse>;
	getUserInfo(accessToken: string, headers?: Headers): Promise<oauth.UserInfoResponse>;
}

export class GenericOAuthProvider implements SocialAuthProvider {
	public name: string;
	public as?: oauth.AuthorizationServer;
	constructor(private config: SocialAuthProviderProps) {
		if (!config.client.client_secret) {
			throw new Error('No client secret');
		}

		this.name = config.name;
	}

	private async getAuthorizationServer() {
		if (this.as) {
			return this.as;
		}

		if (this.config.discoveryUrl) {
			const discoveryRes = await oauth.discoveryRequest(new URL(this.config.issuer), {
				algorithm: this.config.type
			});

			this.as = await oauth.processDiscoveryResponse(new URL(this.config.issuer), discoveryRes);

			return this.as;
		} else if (this.config.authEndpoint) {
			this.as = {
				issuer: this.config.issuer.toString(),
				authorization_endpoint: this.config.authEndpoint,
				token_endpoint: this.config.accessTokenEndpoint,
				userinfo_endpoint: this.config.userInfoUrl
			};

			return this.as;
		} else {
			throw new Error(
				'Failed to setup OAuth authorization server: No discovery URL or auth endpoint'
			);
		}
	}

	async generateAuthUrl(): Promise<{
		url: string;
		state?: string | undefined;
		codeVerifier?: string | undefined;
	}> {
		const _as = await this.getAuthorizationServer();
		let state: string | undefined;
		let code_verifier: string | undefined;
		let code_challenge: string | undefined;

		// Set common parameters
		const authUrl = new URL(_as.authorization_endpoint!);
		authUrl.searchParams.set('response_type', 'code');
		authUrl.searchParams.set('scope', this.config.authParams.scope);
		authUrl.searchParams.set('client_id', this.config.client.client_id);
		authUrl.searchParams.set('redirect_uri', this.config.authParams.redirectUri);

		if (this.config.authParams.prompt) {
			authUrl.searchParams.set('prompt', this.config.authParams.prompt);
		}

		// Set state param
		if (this.config.useState) {
			state = oauth.generateRandomState();
			authUrl.searchParams.set('state', state);
		}

		// Set PKCE params
		if (_as.code_challenge_methods_supported?.includes('S256') === true || this.config.usePkce) {
			code_verifier = oauth.generateRandomCodeVerifier();
			code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
			authUrl.searchParams.set('code_challenge', code_challenge);
			authUrl.searchParams.set('code_challenge_method', 'S256');
		}

		// Return the URL and any other parameters that may need to be stored
		return {
			url: authUrl.toString(),
			state,
			codeVerifier: code_verifier
		};
	}

	async handleCallback(
		req: RequestEvent<Partial<Record<string, string>>, string | null>,
		stateKey?: string | undefined,
		codeKey?: string | undefined
	): Promise<oauth.OAuth2TokenEndpointResponse | oauth.OpenIDTokenEndpointResponse> {
		const _as = await this.getAuthorizationServer();
		const currentUrl = new URL(req.url);

		let params: ReturnType<typeof oauth.validateAuthResponse>;

		if (this.config.useState && stateKey) {
			const state = await getSignedCookie(req, stateKey, COOKIE_SECRET);

			if (!state) {
				throw new Error('Expected state parameter');
			}

			params = oauth.validateAuthResponse(_as, this.config.client, currentUrl, state);
		} else {
			params = oauth.validateAuthResponse(_as, this.config.client, currentUrl, oauth.expectNoState);
		}

		if (oauth.isOAuth2Error(params)) {
			throw params;
		}

		if (this.config.usePkce && codeKey) {
			const codeVerifier = await getSignedCookie(req, codeKey, COOKIE_SECRET);

			if (!codeVerifier) {
				throw new Error('No code verifier');
			}

			const response = await oauth.authorizationCodeGrantRequest(
				_as,
				this.config.client,
				params,
				this.config.authParams.redirectUri,
				codeVerifier
			);

			let tokens:
				| oauth.OAuth2TokenEndpointResponse
				| oauth.OpenIDTokenEndpointResponse
				| oauth.OAuth2Error;

			if (this.config.type === 'oauth2') {
				tokens = await oauth.processAuthorizationCodeOAuth2Response(
					_as,
					this.config.client,
					response
				);
			} else {
				tokens = await oauth.processAuthorizationCodeOpenIDResponse(
					_as,
					this.config.client,
					response
				);
			}

			if (oauth.isOAuth2Error(tokens)) {
				throw tokens;
			}

			return tokens;
		} else if (this.config.usePkce && !codeKey) {
			throw new Error('No code key provided for PKCE');
		} else {
			// No PKCE
			const response = await oauth.authorizationCodeGrantRequest(
				_as,
				this.config.client,
				params,
				this.config.authParams.redirectUri,
				''
			);

			let tokens:
				| oauth.OAuth2TokenEndpointResponse
				| oauth.OpenIDTokenEndpointResponse
				| oauth.OAuth2Error;

			if (this.config.type === 'oauth2') {
				tokens = await oauth.processAuthorizationCodeOAuth2Response(
					_as,
					this.config.client,
					response
				);
			} else {
				tokens = await oauth.processAuthorizationCodeOpenIDResponse(
					_as,
					this.config.client,
					response
				);
			}

			if (oauth.isOAuth2Error(tokens)) {
				throw tokens;
			}

			return tokens;
		}
	}

	async getUserInfo(accessToken: string, headers?: Headers): Promise<oauth.UserInfoResponse> {
		if (!this.config.userInfoUrl) {
			throw new Error('No user info URL provided');
		}

		const _as = await this.getAuthorizationServer();
		const userInfoRes = await oauth.userInfoRequest(_as, this.config.client, accessToken, {
			headers
		});

		return userInfoRes.json() as Promise<oauth.UserInfoResponse>;
	}

	async refreshAccessToken(refreshToken: string) {
		const res = await fetch(this.config.accessTokenEndpoint!, {
			method: 'POST',
			body: JSON.stringify({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				client_secret: this.config.client.client_secret
			}),
			headers: {
				'Content-Type': 'x-www-form-urlencoded'
			}
		});

		if (!res.ok) {
			const body = (await res.json()) as {
				error: string;
				error_description: string;
			};

			throw new Error(body.error_description);
		}

		return (await res.json()) as {
			access_token: string;
			expires_in: number;
			refresh_token: string;
			scope: string;
			token_type: string;
		};
	}
}

export class GithubProvider extends GenericOAuthProvider {
	constructor(clientId: string, clientSecret: string, scope: string, redirectUri: string) {
		super({
			name: 'github',
			accessTokenEndpoint: 'https://github.com/login/oauth/access_token',
			authParams: {
				redirectUri,
				scope
			},
			client: {
				client_id: clientId,
				client_secret: clientSecret
			},
			issuer: 'https://github.com',
			type: 'oauth2',
			authEndpoint: 'https://github.com/login/oauth/authorize',
			usePkce: true,
			useState: true,
			userInfoUrl: 'https://api.github.com/user'
		});
	}
}

export class GoogleProvider extends GenericOAuthProvider {
	constructor(clientId: string, clientSecret: string, scope: string, redirectUri: string) {
		super({
			name: 'google',
			discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
			authParams: {
				scope: 'openid ' + scope,
				redirectUri
			},
			client: {
				client_id: clientId,
				client_secret: clientSecret
			},
			issuer: 'https://accounts.google.com',
			type: 'oidc',
			usePkce: true,
			useState: true,
			userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo'
		});
	}
}
