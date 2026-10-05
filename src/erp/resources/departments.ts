import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1CompaniesDepartments,
	getApiErpV1DepartmentsDepartmentIdEmployees,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1CompaniesDepartmentsResponse,
	GetApiErpV1DepartmentsDepartmentIdEmployeesResponse,
} from '../../generated/types.gen'
import { ensureData } from '../../shared/errors'

/**
 * Departments (Abteilungen): company-wide list plus the employees assigned
 * to a single department.
 */
export function createDepartmentsResource(client: Client) {
	return {
		/**
		 * List the company departments configured in TANSS.
		 */
		async list(): Promise<GetApiErpV1CompaniesDepartmentsResponse> {
			return ensureData(
				await getApiErpV1CompaniesDepartments({ client }),
				'erp.departments.list',
			)
		},
		/**
		 * List all employees of the given department.
		 */
		async employees(
			departmentId: number,
		): Promise<GetApiErpV1DepartmentsDepartmentIdEmployeesResponse> {
			return ensureData(
				await getApiErpV1DepartmentsDepartmentIdEmployees({
					path: { departmentId },
					client,
				}),
				'erp.departments.employees',
			)
		},
	}
}

export type DepartmentsResource = ReturnType<typeof createDepartmentsResource>
