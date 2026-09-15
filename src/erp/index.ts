import type { Client } from '../generated/client/types.gen'
import { type CreateErpClientOptions, createErpClientInstance, setErpClientToken } from './client'
import {
	type AccountingTypesResource,
	createAccountingTypesResource,
} from './resources/accountingTypes'
import { type CatalogResource, createCatalogResource } from './resources/catalog'
import {
	type CategoriesResource,
	type CompanyTypesResource,
	createCategoriesResource,
	createCompanyTypesResource,
} from './resources/categories'
import { type ChecklistsResource, createChecklistsResource } from './resources/checklists'
import { type CompaniesResource, createCompaniesResource } from './resources/companies'
import { type CustomersResource, createCustomersResource } from './resources/customers'
import { createDepartmentsResource, type DepartmentsResource } from './resources/departments'
import { createEmployeesResource, type EmployeesResource } from './resources/employees'
import { createOffersResource, type OffersResource } from './resources/offers'
import { createTicketsResource, type TicketsResource } from './resources/tickets'

export type { CreateErpClientOptions } from './client'
export { createErpClientInstance, setErpClientToken } from './client'
export { ErpApiError } from './errors'

/**
 * Namespaced facade over the generated `/api/erp/v1/...`,
 * `/api/v1/erp/...` and offer `erpSelections` endpoints.
 *
 * Obtain an instance via `createErpClient({ baseUrl, token })`.
 *
 * All methods return the success body directly and throw an `ErpApiError`
 * on non-2xx responses — no `{ data, error }` union handling required.
 *
 * ```ts
 * import { createErpClient } from 'tanss-api'
 *
 * const erp = createErpClient({
 *   baseUrl: 'https://tanss.example.com',
 *   token: process.env.TANSS_ERP_TOKEN!,
 * })
 *
 * const company = await erp.companies.get(42)
 * console.log(company.content)
 * ```
 */
export class TanssErpClient {
	readonly companies: CompaniesResource
	readonly employees: EmployeesResource
	readonly departments: DepartmentsResource
	readonly categories: CategoriesResource
	readonly types: CompanyTypesResource
	readonly tickets: TicketsResource
	readonly customers: CustomersResource
	readonly accountingTypes: AccountingTypesResource
	readonly checklists: ChecklistsResource
	readonly offers: OffersResource
	readonly catalog: CatalogResource

	/**
	 * The underlying isolated hey-api client. Useful for interceptors or
	 * escaping to raw generated SDK functions via `{ client }`.
	 */
	readonly instance: Client

	constructor(client: Client) {
		this.instance = client
		this.companies = createCompaniesResource(client)
		this.employees = createEmployeesResource(client)
		this.departments = createDepartmentsResource(client)
		this.categories = createCategoriesResource(client)
		this.types = createCompanyTypesResource(client)
		this.tickets = createTicketsResource(client)
		this.customers = createCustomersResource(client)
		this.accountingTypes = createAccountingTypesResource(client)
		this.checklists = createChecklistsResource(client)
		this.offers = createOffersResource(client)
		this.catalog = createCatalogResource(client)
	}

	/**
	 * Update the ERP token (e.g. after rotation) without rebuilding the client.
	 */
	setToken(token: string): void {
		setErpClientToken(this.instance, token)
	}
}

/**
 * Create a {@link TanssErpClient} with its own isolated hey-api instance.
 */
export function createErpClient(options: CreateErpClientOptions): TanssErpClient {
	return new TanssErpClient(createErpClientInstance(options))
}
