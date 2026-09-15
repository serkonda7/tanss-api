import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1EmployeesEmployeeIdDepartments,
	getApiErpV1EmployeesId,
	postApiErpV1Employees,
	putApiErpV1EmployeesId,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1EmployeesEmployeeIdDepartmentsResponse,
	GetApiErpV1EmployeesIdResponse,
	PostApiErpV1EmployeesData,
	PostApiErpV1EmployeesResponse,
	PutApiErpV1EmployeesIdData,
	PutApiErpV1EmployeesIdResponse,
} from '../../generated/types.gen'
import { ensureErpData } from '../errors'

export type CreateEmployeeBody = PostApiErpV1EmployeesData['body']
export type UpdateEmployeeBody = PutApiErpV1EmployeesIdData['body']

/**
 * Employee master data: CRUD plus the departments an employee belongs to.
 */
export function createEmployeesResource(client: Client) {
	return {
		/**
		 * Create a new employee record from the ERP payload.
		 */
		async create(body: CreateEmployeeBody): Promise<PostApiErpV1EmployeesResponse> {
			return ensureErpData(
				await postApiErpV1Employees({ body, client }),
				'erp.employees.create',
			)
		},
		/**
		 * Read the single employee record identified by `id`.
		 */
		async get(id: number): Promise<GetApiErpV1EmployeesIdResponse> {
			return ensureErpData(
				await getApiErpV1EmployeesId({ path: { id }, client }),
				'erp.employees.get',
			)
		},
		/**
		 * Update the employee record identified by `id`.
		 */
		async update(
			id: number,
			body: UpdateEmployeeBody,
		): Promise<PutApiErpV1EmployeesIdResponse> {
			return ensureErpData(
				await putApiErpV1EmployeesId({ path: { id }, body, client }),
				'erp.employees.update',
			)
		},
		/**
		 * List all departments associated with the given employee.
		 */
		async departments(
			employeeId: number,
		): Promise<GetApiErpV1EmployeesEmployeeIdDepartmentsResponse> {
			return ensureErpData(
				await getApiErpV1EmployeesEmployeeIdDepartments({ path: { employeeId }, client }),
				'erp.employees.departments',
			)
		},
	}
}

export type EmployeesResource = ReturnType<typeof createEmployeesResource>
