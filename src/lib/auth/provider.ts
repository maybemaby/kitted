import * as oauth from 'oauth4webapi';
import type { RequestEvent } from '@sveltejs/kit';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

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
	};
	// Paramater to determine if the state parameter of the OAuth flow should be used and checked
	useState?: boolean;
	usePkce?: boolean;
	// openIdClientOptions?: Omit<ClientMetadata, 'client_id' | 'client_secret'>;
	userInfoUrl?: string;
	accessTokenEndpoint: string;
};

export type SocialAuthProviderProps = SocialAuthProviderPropsBase & {
	discoveryUrl?: string;
	authEndpoint?: string;
};

interface SocialAuthProvider {
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
}

const GithubProviderProps: SocialAuthProviderProps = {
	name: 'github',
	accessTokenEndpoint: 'https://github.com/login/oauth/access_token',
	client: {
		client_id: GITHUB_CLIENT_ID,
		client_secret: GITHUB_CLIENT_SECRET,
		token_endpoint_auth_method: 'client_secret_basic'
	},
	authParams: {
		redirectUri: 'http://localhost:5173/auth/github/callback',
		scope: 'user:email'
	},
	issuer: 'https://github.com',
	type: 'oauth2',
	authEndpoint: 'https://github.com/login/oauth/authorize',
	usePkce: true
};

// TODO: Add support for OpenID Connect
// TODO: Handle www-authenticate header

export async function createOAuthProvider(
	props: SocialAuthProviderProps
): Promise<SocialAuthProvider> {
	let as: oauth.AuthorizationServer;

	// Since we're using Oauth2, must have a client secret.
	if (!props.client.client_secret) {
		throw new Error('No client secret');
	}

	if (props.discoveryUrl) {
		const discoveryRes = await oauth.discoveryRequest(new URL(props.discoveryUrl), {
			algorithm: props.type
		});

		as = await oauth.processDiscoveryResponse(new URL(props.issuer), discoveryRes);
	} else if (props.authEndpoint) {
		as = {
			issuer: props.issuer.toString(),
			authorization_endpoint: props.authEndpoint,
			token_endpoint: props.accessTokenEndpoint
		};
	} else {
		throw new Error('No discovery URL or auth endpoint');
	}

	return {
		name: props.name,
		async generateAuthUrl() {
			let state: string | undefined;
			let code_verifier: string | undefined;
			let code_challenge: string | undefined;

			// Set common parameters
			const authUrl = new URL(as.authorization_endpoint!);
			authUrl.searchParams.set('response_type', 'code');
			authUrl.searchParams.set('scope', props.authParams.scope);
			authUrl.searchParams.set('client_id', props.client.client_id);
			authUrl.searchParams.set('redirect_uri', props.authParams.redirectUri);

			// Set state param
			if (props.useState) {
				state = oauth.generateRandomState();
				authUrl.searchParams.set('state', state);
			}

			// Set PKCE params
			if (
				(await (as.code_challenge_methods_supported?.includes('S256') === true)) ||
				props.usePkce
			) {
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
		},
		async handleCallback(req: RequestEvent, stateKey?: string, codeKey?: string) {
			const currentUrl = req.url;
			let params: ReturnType<typeof oauth.validateAuthResponse>;
			if (props.useState && stateKey) {
				const state = req.cookies.get(stateKey);
				params = oauth.validateAuthResponse(as, props.client, currentUrl, state);
			} else {
				params = oauth.validateAuthResponse(as, props.client, currentUrl, oauth.expectNoState);
			}

			if (oauth.isOAuth2Error(params)) {
				throw params;
			}

			if (props.usePkce && codeKey) {
				const codeVerifier = req.cookies.get(codeKey);

				if (!codeVerifier) {
					throw new Error('No code verifier');
				}

				const response = await oauth.authorizationCodeGrantRequest(
					as,
					props.client,
					params,
					props.authParams.redirectUri,
					codeVerifier
				);

				const tokens = await oauth.processAuthorizationCodeOAuth2Response(
					as,
					props.client,
					response
				);
				if (oauth.isOAuth2Error(tokens)) {
					throw tokens;
				}

				return tokens;
			} else if (props.usePkce && !codeKey) {
				throw new Error('No code key provided for PKCE');
			} else {
				const response = await oauth.authorizationCodeGrantRequest(
					as,
					props.client,
					params,
					props.authParams.redirectUri,
					''
				);
				const tokens = await oauth.processAuthorizationCodeOAuth2Response(
					as,
					props.client,
					response
				);
				if (oauth.isOAuth2Error(tokens)) {
					throw tokens;
				}

				return tokens;
			}
		}
	};
}

export const GithubProvider = await createOAuthProvider(GithubProviderProps);
