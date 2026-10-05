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
import { ensureData, ensureSuccess } from '../../shared/errors'

export type CreateErpSelectionBody = PostApiV1OffersErpSelectionsData['body']
export type UpdateErpSelectionBody = PutApiV1OffersErpSelectionsErpSelectionIdData['body']
export type MatPickerQuery = GetApiV1OffersErpSelectionsMatPickerData['query']

/**
 * Offer ERP selections (`/api/v1/offers/erpSelections*`): material
 * selections used in offer templates.
 */
export function createOffersResource(client: Client) {
	return {
		/**
		 * Create a new ERP selection including its materials.
		 */
		async create(body: CreateErpSelectionBody): Promise<PostApiV1OffersErpSelectionsResponse> {
			return ensureData(
				await postApiV1OffersErpSelections({ body, client }),
				'tanss.offers.create',
			)
		},
		/**
		 * Fetch an ERP selection (including material) by id.
		 */
		async get(
			erpSelectionId: number,
		): Promise<GetApiV1OffersErpSelectionsErpSelectionIdResponse> {
			return ensureData(
				await getApiV1OffersErpSelectionsErpSelectionId({
					path: { erpSelectionId },
					client,
				}),
				'tanss.offers.get',
			)
		},
		/**
		 * Update an ERP selection and save all attached materials.
		 */
		async update(
			erpSelectionId: number,
			body: UpdateErpSelectionBody,
		): Promise<PutApiV1OffersErpSelectionsErpSelectionIdResponse> {
			return ensureData(
				await putApiV1OffersErpSelectionsErpSelectionId({
					path: { erpSelectionId },
					body,
					client,
				}),
				'tanss.offers.update',
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
			ensureSuccess(result, 'tanss.offers.remove')
			return result.data as DeleteApiV1OffersErpSelectionsErpSelectionIdResponse
		},
		/**
		 * List materials for the "material picker".
		 */
		async matPicker(
			query: MatPickerQuery,
		): Promise<GetApiV1OffersErpSelectionsMatPickerResponse> {
			return ensureData(
				await getApiV1OffersErpSelectionsMatPicker({ query, client }),
				'tanss.offers.matPicker',
			)
		},
		/**
		 * List materials of the picker scoped to a given ERP selection.
		 */
		async matPickerBySelection(
			erpSelectionId: number,
		): Promise<GetApiV1OffersErpSelectionsMatPickerErpSelectionIdResponse> {
			return ensureData(
				await getApiV1OffersErpSelectionsMatPickerErpSelectionId({
					path: { erpSelectionId },
					client,
				}),
				'tanss.offers.matPickerBySelection',
			)
		},
	}
}

export type OffersResource = ReturnType<typeof createOffersResource>
