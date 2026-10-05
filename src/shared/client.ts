import { createClient } from '../generated/client/client.gen'
import type { Client, Config } from '../generated/client/types.gen'

export interface ClientInstanceOptions {
	baseUrl: string
	token: string
	fetch?: typeof fetch
	config?: Omit<Config, 'baseUrl' | 'auth' | 'fetch'>
}

/**
 * Create an isolated hey-api client instance.
 *
 * Unlike the generated `client` singleton, the returned instance is not
 * shared with other API areas, so `setConfig` calls elsewhere cannot leak a
 * token into its requests (or vice versa).
 */
export function createClientInstance(options: ClientInstanceOptions): Client {
	const { baseUrl, token, fetch, config } = options
	return createClient({
		...config,
		baseUrl,
		auth: token,
		...(fetch !== undefined ? { fetch } : {}),
	})
}

/**
 * Update the token of a client instance (e.g. after rotation).
 */
export function setClientToken(client: Client, token: string): void {
	client.setConfig({ auth: token })
}
