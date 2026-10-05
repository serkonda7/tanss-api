import type { Client } from '../../generated/client/types.gen'
import { getApiV1ErpProjects, getApiV1ErpStocks } from '../../generated/sdk.gen'
import type {
	GetApiV1ErpProjectsResponse,
	GetApiV1ErpStocksResponse,
} from '../../generated/types.gen'
import { ensureData } from '../../shared/errors'

/**
 * ERP backend catalog (`/api/v1/erp/...`): projects and stocks resolved
 * through the factory-configured ERP service. Returns an empty list when no
 * ERP service is configured.
 */
export function createCatalogResource(client: Client) {
	return {
		/**
		 * List projects from the configured ERP backend.
		 */
		async projects(): Promise<GetApiV1ErpProjectsResponse> {
			return ensureData(await getApiV1ErpProjects({ client }), 'erp.catalog.projects')
		},
		/**
		 * List stocks (warehouses/inventories) from the configured ERP backend.
		 */
		async stocks(): Promise<GetApiV1ErpStocksResponse> {
			return ensureData(await getApiV1ErpStocks({ client }), 'erp.catalog.stocks')
		},
	}
}

export type CatalogResource = ReturnType<typeof createCatalogResource>
