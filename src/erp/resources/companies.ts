import type { Client } from '../../generated/client/types.gen'
import {
	deleteApiErpV1CompaniesId,
	getApiErpV1CompaniesDepartments,
	getApiErpV1CompaniesEmployees,
	getApiErpV1CompaniesEmployeesDepartments,
	getApiErpV1CompaniesId,
	getApiErpV1CompaniesSearchIdDisplayId,
	postApiErpV1Companies,
	putApiErpV1CompaniesId,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1CompaniesDepartmentsResponse,
	GetApiErpV1CompaniesEmployeesData,
	GetApiErpV1CompaniesEmployeesDepartmentsResponse,
	GetApiErpV1CompaniesEmployeesResponse,
	GetApiErpV1CompaniesIdResponse,
	GetApiErpV1CompaniesSearchIdDisplayIdResponse,
	PostApiErpV1CompaniesData,
	PostApiErpV1CompaniesResponse,
	PutApiErpV1CompaniesIdData,
	PutApiErpV1CompaniesIdResponse,
} from '../../generated/types.gen'
import { ensureErpData, ensureErpSuccess } from '../errors'

export type CreateCompanyBody = PostApiErpV1CompaniesData['body']
export type UpdateCompanyBody = PutApiErpV1CompaniesIdData['body']
export type CompaniesEmployeesQuery = GetApiErpV1CompaniesEmployeesData['query']

/**
 * Company (customer) master data: CRUD plus the ERP lookup and
 * employee/department views scoped to companies.
 */
export function createCompaniesResource(client: Client) {
	return {
		/**
		 * Create a new company (customer) record from ERP master data.
		 */
		async create(body: CreateCompanyBody): Promise<PostApiErpV1CompaniesResponse> {
			return ensureErpData(
				await postApiErpV1Companies({ body, client }),
				'erp.companies.create',
			)
		},
		/**
		 * Read the company record identified by `id`.
		 */
		async get(id: number): Promise<GetApiErpV1CompaniesIdResponse> {
			return ensureErpData(
				await getApiErpV1CompaniesId({ path: { id }, client }),
				'erp.companies.get',
			)
		},
		/**
		 * Update the company identified by `id` with ERP master-data changes.
		 */
		async update(id: number, body: UpdateCompanyBody): Promise<PutApiErpV1CompaniesIdResponse> {
			return ensureErpData(
				await putApiErpV1CompaniesId({ path: { id }, body, client }),
				'erp.companies.update',
			)
		},
		/**
		 * Delete the company identified by `id` with its dependent data.
		 */
		async remove(id: number): Promise<void> {
			ensureErpSuccess(
				await deleteApiErpV1CompaniesId({ path: { id }, client }),
				'erp.companies.remove',
			)
		},
		/**
		 * Search customers by the external ERP customer number (`displayId`).
		 */
		async searchByDisplayId(
			displayId: string,
		): Promise<GetApiErpV1CompaniesSearchIdDisplayIdResponse> {
			return ensureErpData(
				await getApiErpV1CompaniesSearchIdDisplayId({ path: { displayId }, client }),
				'erp.companies.searchByDisplayId',
			)
		},
		/**
		 * List employees of the own company (or filter by `companyId` /
		 * `companyNumber`).
		 */
		async employees(
			query?: CompaniesEmployeesQuery,
		): Promise<GetApiErpV1CompaniesEmployeesResponse> {
			return ensureErpData(
				await getApiErpV1CompaniesEmployees({ query, client }),
				'erp.companies.employees',
			)
		},
		/**
		 * List the company departments (Abteilungen) configured in TANSS.
		 */
		async departments(): Promise<GetApiErpV1CompaniesDepartmentsResponse> {
			return ensureErpData(
				await getApiErpV1CompaniesDepartments({ client }),
				'erp.companies.departments',
			)
		},
		/**
		 * Map of department lists keyed by employee ID for all active
		 * employees of the own company.
		 */
		async employeesDepartments(): Promise<GetApiErpV1CompaniesEmployeesDepartmentsResponse> {
			return ensureErpData(
				await getApiErpV1CompaniesEmployeesDepartments({ client }),
				'erp.companies.employeesDepartments',
			)
		},
	}
}

export type CompaniesResource = ReturnType<typeof createCompaniesResource>
