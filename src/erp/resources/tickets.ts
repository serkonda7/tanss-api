import type { Client } from '../../generated/client/types.gen'
import {
	getApiErpV1TicketsStatus,
	getApiErpV1TicketsTypes,
	postApiErpV1Tickets,
	postApiErpV1TicketsTicketIdUpload,
} from '../../generated/sdk.gen'
import type {
	GetApiErpV1TicketsStatusResponse,
	GetApiErpV1TicketsTypesResponse,
	PostApiErpV1TicketsData,
	PostApiErpV1TicketsResponse,
	PostApiErpV1TicketsTicketIdUploadData,
	PostApiErpV1TicketsTicketIdUploadResponse,
} from '../../generated/types.gen'
import { ensureErpData } from '../errors'

export type CreateErpTicketBody = PostApiErpV1TicketsData['body']
export type UploadTicketFileBody = NonNullable<PostApiErpV1TicketsTicketIdUploadData['body']>

/**
 * Tickets as seen by ERP integrations: create tickets, resolve status/type
 * mappings, and upload documents or images into a ticket.
 */
export function createTicketsResource(client: Client) {
	return {
		/**
		 * Create a new ticket in the database.
		 */
		async create(body: CreateErpTicketBody): Promise<PostApiErpV1TicketsResponse> {
			return ensureErpData(await postApiErpV1Tickets({ body, client }), 'erp.tickets.create')
		},
		/**
		 * List all ticket states configured in TANSS (for status mapping).
		 */
		async statuses(): Promise<GetApiErpV1TicketsStatusResponse> {
			return ensureErpData(await getApiErpV1TicketsStatus({ client }), 'erp.tickets.statuses')
		},
		/**
		 * List all active ticket types configured in TANSS.
		 */
		async types(): Promise<GetApiErpV1TicketsTypesResponse> {
			return ensureErpData(await getApiErpV1TicketsTypes({ client }), 'erp.tickets.types')
		},
		/**
		 * Upload a document or image into the given ticket.
		 */
		async upload(
			ticketId: number,
			files: UploadTicketFileBody,
		): Promise<PostApiErpV1TicketsTicketIdUploadResponse> {
			return ensureErpData(
				await postApiErpV1TicketsTicketIdUpload({
					path: { ticketId },
					body: files,
					client,
				}),
				'erp.tickets.upload',
			)
		},
	}
}

export type TicketsResource = ReturnType<typeof createTicketsResource>
