import type { Client } from '../../generated/client/types.gen'
import {
	deleteApiErpV1CompanyCategoriesCategoryId,
	deleteApiErpV1TypesTypeId,
	getApiErpV1CompanyCategories,
	getApiErpV1CompanyCategoriesCategoryId,
	getApiErpV1Types,
	getApiErpV1TypesTypeId,
	postApiErpV1CompanyCategoriesCategoryId,
	postApiErpV1Types,
	putApiErpV1CompanyCategoriesCategoryId,
	putApiErpV1TypesTypeId,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1CompanyCategoriesCategoryIdResponse,
	GetApiErpV1CompanyCategoriesResponse,
	GetApiErpV1TypesResponse,
	GetApiErpV1TypesTypeIdResponse,
	PostApiErpV1CompanyCategoriesCategoryIdData,
	PostApiErpV1CompanyCategoriesCategoryIdResponse,
	PostApiErpV1TypesData,
	PostApiErpV1TypesResponse,
	PutApiErpV1CompanyCategoriesCategoryIdData,
	PutApiErpV1CompanyCategoriesCategoryIdResponse,
	PutApiErpV1TypesTypeIdData,
	PutApiErpV1TypesTypeIdResponse,
} from '../../generated/types.gen'
import { ensureErpData, ensureErpSuccess } from '../errors'

export type CreateCompanyCategoryBody = PostApiErpV1CompanyCategoriesCategoryIdData['body']
export type UpdateCompanyCategoryBody = PutApiErpV1CompanyCategoriesCategoryIdData['body']
export type CreateCompanyTypeBody = PostApiErpV1TypesData['body']
export type UpdateCompanyTypeBody = PutApiErpV1TypesTypeIdData['body']

/**
 * Company classifications: categories (Firmen-Kategorien) each grouping
 * company types (Firmen-Typen).
 */
export function createCategoriesResource(client: Client) {
	return {
		/**
		 * List all company categories with their associated company types.
		 */
		async list(): Promise<GetApiErpV1CompanyCategoriesResponse> {
			return ensureErpData(
				await getApiErpV1CompanyCategories({ client }),
				'erp.categories.list',
			)
		},
		/**
		 * Read the single company category identified by `categoryId`.
		 */
		async get(categoryId: number): Promise<GetApiErpV1CompanyCategoriesCategoryIdResponse> {
			return ensureErpData(
				await getApiErpV1CompanyCategoriesCategoryId({ path: { categoryId }, client }),
				'erp.categories.get',
			)
		},
		/**
		 * Create a new company category.
		 */
		async create(
			categoryId: string,
			body: CreateCompanyCategoryBody,
		): Promise<PostApiErpV1CompanyCategoriesCategoryIdResponse> {
			return ensureErpData(
				await postApiErpV1CompanyCategoriesCategoryId({
					path: { categoryId },
					body,
					client,
				}),
				'erp.categories.create',
			)
		},
		/**
		 * Update the company category identified by `categoryId`.
		 */
		async update(
			categoryId: number,
			body: UpdateCompanyCategoryBody,
		): Promise<PutApiErpV1CompanyCategoriesCategoryIdResponse> {
			return ensureErpData(
				await putApiErpV1CompanyCategoriesCategoryId({
					path: { categoryId },
					body,
					client,
				}),
				'erp.categories.update',
			)
		},
		/**
		 * Delete the company category identified by `categoryId`.
		 */
		async remove(categoryId: number): Promise<void> {
			ensureErpSuccess(
				await deleteApiErpV1CompanyCategoriesCategoryId({ path: { categoryId }, client }),
				'erp.categories.remove',
			)
		},
	}
}

export type CategoriesResource = ReturnType<typeof createCategoriesResource>

/**
 * Company types (Firmen-Typen) belonging to a category.
 */
export function createCompanyTypesResource(client: Client) {
	return {
		/**
		 * List all company types configured in TANSS.
		 */
		async list(): Promise<GetApiErpV1TypesResponse> {
			return ensureErpData(await getApiErpV1Types({ client }), 'erp.types.list')
		},
		/**
		 * Read the single company type identified by `typeId`.
		 */
		async get(typeId: number): Promise<GetApiErpV1TypesTypeIdResponse> {
			return ensureErpData(
				await getApiErpV1TypesTypeId({ path: { typeId }, client }),
				'erp.types.get',
			)
		},
		/**
		 * Create a new company type and assign it to a category.
		 */
		async create(body: CreateCompanyTypeBody): Promise<PostApiErpV1TypesResponse> {
			return ensureErpData(await postApiErpV1Types({ body, client }), 'erp.types.create')
		},
		/**
		 * Update the company type identified by `typeId`.
		 */
		async update(
			typeId: number,
			body: UpdateCompanyTypeBody,
		): Promise<PutApiErpV1TypesTypeIdResponse> {
			return ensureErpData(
				await putApiErpV1TypesTypeId({ path: { typeId }, body, client }),
				'erp.types.update',
			)
		},
		/**
		 * Delete the company type identified by `typeId`.
		 */
		async remove(typeId: number): Promise<void> {
			ensureErpSuccess(
				await deleteApiErpV1TypesTypeId({ path: { typeId }, client }),
				'erp.types.remove',
			)
		},
	}
}

export type CompanyTypesResource = ReturnType<typeof createCompanyTypesResource>
