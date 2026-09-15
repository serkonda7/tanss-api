import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1Checklists,
	postApiErpV1ChecklistsAssignmentLinkTypeIdLinkIdChecklistId,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1ChecklistsData,
	GetApiErpV1ChecklistsResponse,
	PostApiErpV1ChecklistsAssignmentLinkTypeIdLinkIdChecklistIdResponse,
} from '../../generated/types.gen'
import { ensureErpData } from '../errors'

export type ChecklistsQuery = GetApiErpV1ChecklistsData['query']

export interface AssignChecklistArgs {
	linkTypeId: number
	linkId: number
	checklistId: number
}

/**
 * Checklists: pick a checklist and assign it to a ticket (or other entity).
 */
export function createChecklistsResource(client: Client) {
	return {
		/**
		 * List checklists, optionally filtered by company and/or department.
		 */
		async list(query?: ChecklistsQuery): Promise<GetApiErpV1ChecklistsResponse> {
			return ensureErpData(
				await getApiErpV1Checklists({ query, client }),
				'erp.checklists.list',
			)
		},
		/**
		 * Assign a checklist to a ticket (`linkTypeId: 11`).
		 */
		async assign(
			args: AssignChecklistArgs,
		): Promise<PostApiErpV1ChecklistsAssignmentLinkTypeIdLinkIdChecklistIdResponse> {
			const { linkTypeId, linkId, checklistId } = args
			return ensureErpData(
				await postApiErpV1ChecklistsAssignmentLinkTypeIdLinkIdChecklistId({
					path: { linkTypeId, linkId, checklistId },
					client,
				}),
				'erp.checklists.assign',
			)
		},
	}
}

export type ChecklistsResource = ReturnType<typeof createChecklistsResource>
