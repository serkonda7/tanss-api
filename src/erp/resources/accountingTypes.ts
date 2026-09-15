import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1Accountingtypes,
	getApiErpV1AccountingtypesPrices,
	postApiErpV1Accountingtypes,
	postApiErpV1AccountingtypesPrices,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1AccountingtypesPricesResponse,
	GetApiErpV1AccountingtypesResponse,
	PostApiErpV1AccountingtypesData,
	PostApiErpV1AccountingtypesPricesData,
	PostApiErpV1AccountingtypesPricesResponse,
	PostApiErpV1AccountingtypesResponse,
} from '../../generated/types.gen'
import { ensureErpData } from '../errors'

export type CreateAccountingTypeBody = PostApiErpV1AccountingtypesData['body']
export type CreateAccountingTypePriceBody = PostApiErpV1AccountingtypesPricesData['body']

/**
 * Accounting types (Leistungsarten) and their default prices.
 */
export function createAccountingTypesResource(client: Client) {
	return {
		/**
		 * List the accounting types configured in TANSS.
		 */
		async list(): Promise<GetApiErpV1AccountingtypesResponse> {
			return ensureErpData(
				await getApiErpV1Accountingtypes({ client }),
				'erp.accountingTypes.list',
			)
		},
		/**
		 * Create a new accounting type (Leistungsart).
		 */
		async create(body: CreateAccountingTypeBody): Promise<PostApiErpV1AccountingtypesResponse> {
			return ensureErpData(
				await postApiErpV1Accountingtypes({ body, client }),
				'erp.accountingTypes.create',
			)
		},
		prices: {
			/**
			 * List the default (system-wide) accounting type prices.
			 */
			async list(): Promise<GetApiErpV1AccountingtypesPricesResponse> {
				return ensureErpData(
					await getApiErpV1AccountingtypesPrices({ client }),
					'erp.accountingTypes.prices.list',
				)
			},
			/**
			 * Save a new default price entry for an accounting type,
			 * optionally scoped to a linked entity.
			 */
			async create(
				body: CreateAccountingTypePriceBody,
			): Promise<PostApiErpV1AccountingtypesPricesResponse> {
				return ensureErpData(
					await postApiErpV1AccountingtypesPrices({ body, client }),
					'erp.accountingTypes.prices.create',
				)
			},
		},
	}
}

export type AccountingTypesResource = ReturnType<typeof createAccountingTypesResource>
