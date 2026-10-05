import type { Client, Config } from '../generated/client/types.gen'
import { createClientInstance, setClientToken } from '../shared/client'

export interface CreateTanssClientOptions {
	/**
	 * Hostname of the TANSS instance, e.g. `https://tanss.example.com`.
	 */
	baseUrl: string
	/**
	 * User session token, sent verbatim in the `apiToken` header
	 * (including the `Bearer ` prefix), e.g. the `apiKey` returned by
	 * `postApiV1Login`.
	 *
	 * ERP-role tokens will NOT work for these routes; use `createErpClient`
	 * for the `/api/erp/v1/...` endpoints instead.
	 */
	token: string
	/**
	 * Custom fetch implementation. Defaults to `globalThis.fetch`.
	 */
	fetch?: typeof fetch
	/**
	 * Extra hey-api client config merged over the defaults.
	 */
	config?: Omit<Config, 'baseUrl' | 'auth' | 'fetch'>
}

/**
 * Create an isolated hey-api client pre-configured for user-token endpoints.
 */
export function createTanssClientInstance(options: CreateTanssClientOptions): Client {
	return createClientInstance(options)
}

/**
 * Update the token of a TANSS client instance (e.g. after re-login).
 */
export function setTanssClientToken(client: Client, token: string): void {
	setClientToken(client, token)
}
