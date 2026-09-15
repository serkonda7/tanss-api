import { createClient } from '../generated/client/client.gen'
import type { Client, Config } from '../generated/client/types.gen'

export interface CreateErpClientOptions {
	/**
	 * Hostname of the TANSS instance, e.g. `https://tanss.example.com`.
	 */
	baseUrl: string
	/**
	 * ERP integration token, sent verbatim in the `apiToken` header
	 * (including the `Bearer ` prefix).
	 *
	 * Must belong to an external API role of `ERP`, `CENTRON` or
	 * `SYSTEMHAUS_ONE`. A normal user login token will NOT work for the
	 * `/api/erp/v1/...` routes.
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
 * Create an isolated hey-api client pre-configured for the ERP endpoints.
 *
 * Unlike the generated `client` singleton, the returned instance is not
 * shared with other API areas, so `setConfig` calls elsewhere cannot leak a
 * user token into ERP requests (or vice versa).
 */
export function createErpClientInstance(options: CreateErpClientOptions): Client {
	const { baseUrl, token, fetch, config } = options
	return createClient({
		...config,
		baseUrl,
		auth: token,
		...(fetch !== undefined ? { fetch } : {}),
	})
}

/**
 * Update the token of an ERP client instance (e.g. after rotation).
 */
export function setErpClientToken(client: Client, token: string): void {
	client.setConfig({ auth: token })
}
