import type { Client } from '../generated/client/types.gen'
import {
	type CreateTanssClientOptions,
	createTanssClientInstance,
	setTanssClientToken,
} from './client'
import { createDevicesResource, type DevicesResource } from './resources/devices'
import { createOffersResource, type OffersResource } from './resources/offers'

export type { CreateTanssClientOptions } from './client'
export { createTanssClientInstance, setTanssClientToken } from './client'

/**
 * Namespaced facade over generated `/api/v1/...` endpoints that authenticate
 * with a normal user session token.
 *
 * Obtain an instance via `createTanssClient({ baseUrl, token })`.
 *
 * All methods return the success body directly and throw a `TanssApiError`
 * on non-2xx responses — no `{ data, error }` union handling required.
 *
 * ```ts
 * import { createTanssClient } from 'tanss-api'
 *
 * const tanss = createTanssClient({
 *   baseUrl: 'https://tanss.example.com',
 *   token: apiKey, // from postApiV1Login
 * })
 *
 * const pc = await tanss.devices.pcs.get(123)
 * await tanss.devices.pcs.update(123, { ...pc.content, description: 'Updated' })
 * ```
 */
export class TanssClient {
	readonly devices: DevicesResource
	readonly offers: OffersResource

	/**
	 * The underlying isolated hey-api client. Useful for interceptors or
	 * escaping to raw generated SDK functions via `{ client }`.
	 */
	readonly instance: Client

	constructor(client: Client) {
		this.instance = client
		this.devices = createDevicesResource(client)
		this.offers = createOffersResource(client)
	}

	/**
	 * Update the user token (e.g. after re-login) without rebuilding the client.
	 */
	setToken(token: string): void {
		setTanssClientToken(this.instance, token)
	}
}

/**
 * Create a {@link TanssClient} with its own isolated hey-api instance.
 */
export function createTanssClient(options: CreateTanssClientOptions): TanssClient {
	return new TanssClient(createTanssClientInstance(options))
}
