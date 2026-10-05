import type { Client } from '../../generated/client/types.gen'
import {
	deleteApiV1ComponentsComponentId,
	deleteApiV1PcsPcId,
	deleteApiV1PeripheriesPeripheryId,
	getApiV1ComponentsComponentId,
	getApiV1PcsPcId,
	getApiV1PeripheriesPeripheryId,
	postApiV1Components,
	postApiV1Pcs,
	postApiV1Peripheries,
	putApiV1Components,
	putApiV1ComponentsComponentId,
	putApiV1Pcs,
	putApiV1PcsPcId,
	putApiV1Peripheries,
	putApiV1PeripheriesPeripheryId,
} from '../../generated/sdk.gen'
import type {
	GetApiV1ComponentsComponentIdResponse,
	GetApiV1PcsPcIdResponse,
	GetApiV1PeripheriesPeripheryIdResponse,
	PostApiV1ComponentsData,
	PostApiV1ComponentsResponse,
	PostApiV1PcsData,
	PostApiV1PcsResponse,
	PostApiV1PeripheriesData,
	PostApiV1PeripheriesResponse,
	PutApiV1ComponentsComponentIdData,
	PutApiV1ComponentsComponentIdResponse,
	PutApiV1ComponentsData,
	PutApiV1ComponentsResponse,
	PutApiV1PcsData,
	PutApiV1PcsPcIdData,
	PutApiV1PcsPcIdResponse,
	PutApiV1PcsResponse,
	PutApiV1PeripheriesData,
	PutApiV1PeripheriesPeripheryIdData,
	PutApiV1PeripheriesPeripheryIdResponse,
	PutApiV1PeripheriesResponse,
} from '../../generated/types.gen'
import { ensureData, ensureSuccess } from '../../shared/errors'

export type CreatePcBody = PostApiV1PcsData['body']
export type UpdatePcBody = PutApiV1PcsPcIdData['body']
export type PcsListBody = PutApiV1PcsData['body']
export type CreatePeripheryBody = PostApiV1PeripheriesData['body']
export type UpdatePeripheryBody = PutApiV1PeripheriesPeripheryIdData['body']
export type PeripheriesListBody = PutApiV1PeripheriesData['body']
export type CreateComponentBody = PostApiV1ComponentsData['body']
export type UpdateComponentBody = PutApiV1ComponentsComponentIdData['body']
export type ComponentsListBody = PutApiV1ComponentsData['body']

/**
 * Device management (`/api/v1/pcs`, `/api/v1/peripheries`,
 * `/api/v1/components`): CRUD and filtered lists for pcs/servers,
 * peripheries and components.
 */
export function createDevicesResource(client: Client) {
	return {
		pcs: {
			/**
			 * List pcs/servers matching the given filter configuration.
			 */
			async list(body: PcsListBody): Promise<PutApiV1PcsResponse> {
				return ensureData(await putApiV1Pcs({ body, client }), 'tanss.devices.pcs.list')
			},
			/**
			 * Read the pc/server identified by `pcId`.
			 */
			async get(pcId: number): Promise<GetApiV1PcsPcIdResponse> {
				return ensureData(
					await getApiV1PcsPcId({ path: { pcId }, client }),
					'tanss.devices.pcs.get',
				)
			},
			/**
			 * Create a pc/server, including attached ip addresses and guarantee.
			 */
			async create(body: CreatePcBody): Promise<PostApiV1PcsResponse> {
				return ensureData(await postApiV1Pcs({ body, client }), 'tanss.devices.pcs.create')
			},
			/**
			 * Update the pc/server identified by `pcId`, including attached ip
			 * addresses and guarantee.
			 */
			async update(pcId: number, body: UpdatePcBody): Promise<PutApiV1PcsPcIdResponse> {
				return ensureData(
					await putApiV1PcsPcId({ path: { pcId }, body, client }),
					'tanss.devices.pcs.update',
				)
			},
			/**
			 * Delete the pc/server identified by `pcId`.
			 */
			async remove(pcId: number): Promise<void> {
				ensureSuccess(
					await deleteApiV1PcsPcId({ path: { pcId }, client }),
					'tanss.devices.pcs.remove',
				)
			},
		},
		peripheries: {
			/**
			 * List peripheries matching the given filter configuration.
			 */
			async list(body: PeripheriesListBody): Promise<PutApiV1PeripheriesResponse> {
				return ensureData(
					await putApiV1Peripheries({ body, client }),
					'tanss.devices.peripheries.list',
				)
			},
			/**
			 * Read the periphery identified by `peripheryId`.
			 */
			async get(peripheryId: number): Promise<GetApiV1PeripheriesPeripheryIdResponse> {
				return ensureData(
					await getApiV1PeripheriesPeripheryId({ path: { peripheryId }, client }),
					'tanss.devices.peripheries.get',
				)
			},
			/**
			 * Create a periphery, including attached ip addresses and guarantee.
			 */
			async create(body: CreatePeripheryBody): Promise<PostApiV1PeripheriesResponse> {
				return ensureData(
					await postApiV1Peripheries({ body, client }),
					'tanss.devices.peripheries.create',
				)
			},
			/**
			 * Update the periphery identified by `peripheryId`, including attached
			 * ip addresses and guarantee.
			 */
			async update(
				peripheryId: number,
				body: UpdatePeripheryBody,
			): Promise<PutApiV1PeripheriesPeripheryIdResponse> {
				return ensureData(
					await putApiV1PeripheriesPeripheryId({ path: { peripheryId }, body, client }),
					'tanss.devices.peripheries.update',
				)
			},
			/**
			 * Delete the periphery identified by `peripheryId`.
			 */
			async remove(peripheryId: number): Promise<void> {
				ensureSuccess(
					await deleteApiV1PeripheriesPeripheryId({ path: { peripheryId }, client }),
					'tanss.devices.peripheries.remove',
				)
			},
		},
		components: {
			/**
			 * List components matching the given filter configuration.
			 */
			async list(body: ComponentsListBody): Promise<PutApiV1ComponentsResponse> {
				return ensureData(
					await putApiV1Components({ body, client }),
					'tanss.devices.components.list',
				)
			},
			/**
			 * Read the component identified by `componentId`.
			 */
			async get(componentId: number): Promise<GetApiV1ComponentsComponentIdResponse> {
				return ensureData(
					await getApiV1ComponentsComponentId({ path: { componentId }, client }),
					'tanss.devices.components.get',
				)
			},
			/**
			 * Create a new component.
			 */
			async create(body: CreateComponentBody): Promise<PostApiV1ComponentsResponse> {
				return ensureData(
					await postApiV1Components({ body, client }),
					'tanss.devices.components.create',
				)
			},
			/**
			 * Update the component identified by `componentId`.
			 */
			async update(
				componentId: number,
				body: UpdateComponentBody,
			): Promise<PutApiV1ComponentsComponentIdResponse> {
				return ensureData(
					await putApiV1ComponentsComponentId({ path: { componentId }, body, client }),
					'tanss.devices.components.update',
				)
			},
			/**
			 * Delete the component identified by `componentId`.
			 */
			async remove(componentId: number): Promise<void> {
				ensureSuccess(
					await deleteApiV1ComponentsComponentId({ path: { componentId }, client }),
					'tanss.devices.components.remove',
				)
			},
		},
	}
}

export type DevicesResource = ReturnType<typeof createDevicesResource>
