import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1Customers,
	getApiErpV1Invoices,
	postApiErpV1Customers,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1CustomersResponse,
	GetApiErpV1InvoicesData,
	GetApiErpV1InvoicesResponse,
	PostApiErpV1CustomersData,
	PostApiErpV1CustomersResponse,
} from '../../generated/types.gen'
import { ensureErpData } from '../errors'

export type UpsertCustomersBody = PostApiErpV1CustomersData['body']
export type InvoicesQuery = GetApiErpV1InvoicesData['query']

/**
 * Legacy PHP ERP bridge: customer master data sync and invoice reads.
 */
export function createCustomersResource(client: Client) {
	return {
		/**
		 * Read the customer list through the legacy ERP backend bridge.
		 */
		async list(): Promise<GetApiErpV1CustomersResponse> {
			return ensureErpData(await getApiErpV1Customers({ client }), 'erp.customers.list')
		},
		/**
		 * Create or update customer data via the legacy ERP backend bridge.
		 *
		 * The endpoint takes a raw string body (no JSON wrapping).
		 */
		async upsert(body: UpsertCustomersBody): Promise<PostApiErpV1CustomersResponse> {
			return ensureErpData(
				await postApiErpV1Customers({ body, client }),
				'erp.customers.upsert',
			)
		},
		/**
		 * Read invoices for the given customer from the legacy ERP backend.
		 */
		async invoices(query?: InvoicesQuery): Promise<GetApiErpV1InvoicesResponse> {
			return ensureErpData(
				await getApiErpV1Invoices({ query, client }),
				'erp.customers.invoices',
			)
		},
	}
}

export type CustomersResource = ReturnType<typeof createCustomersResource>
