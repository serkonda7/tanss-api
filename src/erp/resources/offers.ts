import type { Client } from '../../generated/client/types.gen'
import {
	deleteApiV1OffersErpSelectionsErpSelectionId,
	getApiV1OffersErpSelectionsErpSelectionId,
	getApiV1OffersErpSelectionsMatPicker,
	getApiV1OffersErpSelectionsMatPickerErpSelectionId,
	postApiV1OffersErpSelections,
	putApiV1OffersErpSelectionsErpSelectionId,
} from '../../generated/sdk.gen'
import type {
	DeleteApiV1OffersErpSelectionsErpSelectionIdResponse,
	GetApiV1OffersErpSelectionsErpSelectionIdResponse,
	GetApiV1OffersErpSelectionsMatPickerData,
	GetApiV1OffersErpSelectionsMatPickerErpSelectionIdResponse,
	GetApiV1OffersErpSelectionsMatPickerResponse,
	PostApiV1OffersErpSelectionsData,
	PostApiV1OffersErpSelectionsResponse,
	PutApiV1OffersErpSelectionsErpSelectionIdData,
	PutApiV1OffersErpSelectionsErpSelectionIdResponse,
} from '../../generated/types.gen'
import { ensureErpData, ensureErpSuccess } from '../errors'

export type CreateErpSelectionBody = PostApiV1OffersErpSelectionsData['body']
export type UpdateErpSelectionBody = PutApiV1OffersErpSelectionsErpSelectionIdData['body']
export type MatPickerQuery = GetApiV1OffersErpSelectionsMatPickerData['query']

/**
 * Offer ERP selections (`/api/v1/offers/erpSelections*`): material
 * selections used in offer templates.
 *
 * Note: unlike `/api/erp/v1/...`, these routes authenticate with a normal
 * user session token (`ApiTokenAuth`), not the ERP-role token. Pass a user
 * token to `createErpClient` when using this resource.
 */
export function createOffersResource(client: Client) {
	return {
		/**
		 * Create a new ERP selection including its materials.
		 */
		async create(body: CreateErpSelectionBody): Promise<PostApiV1OffersErpSelectionsResponse> {
			return ensureErpData(
				await postApiV1OffersErpSelections({ body, client }),
				'erp.offers.create',
			)
		},
		/**
		 * Fetch an ERP selection (including material) by id.
		 */
		async get(
			erpSelectionId: number,
		): Promise<GetApiV1OffersErpSelectionsErpSelectionIdResponse> {
			return ensureErpData(
				await getApiV1OffersErpSelectionsErpSelectionId({
					path: { erpSelectionId },
					client,
				}),
				'erp.offers.get',
			)
		},
		/**
		 * Update an ERP selection and save all attached materials.
		 */
		async update(
			erpSelectionId: number,
			body: UpdateErpSelectionBody,
		): Promise<PutApiV1OffersErpSelectionsErpSelectionIdResponse> {
			return ensureErpData(
				await putApiV1OffersErpSelectionsErpSelectionId({
					path: { erpSelectionId },
					body,
					client,
				}),
				'erp.offers.update',
			)
		},
		/**
		 * Delete an ERP selection.
		 */
		async remove(
			erpSelectionId: number,
		): Promise<DeleteApiV1OffersErpSelectionsErpSelectionIdResponse> {
			// The endpoint answers 204 with an empty JSON object at runtime.
			const result = await deleteApiV1OffersErpSelectionsErpSelectionId({
				path: { erpSelectionId },
				client,
			})
			ensureErpSuccess(result, 'erp.offers.remove')
			return result.data as DeleteApiV1OffersErpSelectionsErpSelectionIdResponse
		},
		/**
		 * List materials for the "material picker".
		 */
		async matPicker(
			query: MatPickerQuery,
		): Promise<GetApiV1OffersErpSelectionsMatPickerResponse> {
			return ensureErpData(
				await getApiV1OffersErpSelectionsMatPicker({ query, client }),
				'erp.offers.matPicker',
			)
		},
		/**
		 * List materials of the picker scoped to a given ERP selection.
		 */
		async matPickerBySelection(
			erpSelectionId: number,
		): Promise<GetApiV1OffersErpSelectionsMatPickerErpSelectionIdResponse> {
			return ensureErpData(
				await getApiV1OffersErpSelectionsMatPickerErpSelectionId({
					path: { erpSelectionId },
					client,
				}),
				'erp.offers.matPickerBySelection',
			)
		},
	}
}

export type OffersResource = ReturnType<typeof createOffersResource>
