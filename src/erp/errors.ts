export interface ErpApiErrorDetails {
	status?: number
	body: unknown
	request?: Request
	response?: Response
}

/**
 * Error thrown by the ERP facade when TANSS answers with a non-2xx status.
 *
 * The generated SDK returns `{ data } | { error }` unions; the facade
 * converts the error branch into this exception so callers can use plain
 * `try/catch` instead of checking every response.
 */
export class ErpApiError extends Error {
	readonly status?: number
	readonly body: unknown
	readonly request?: Request
	readonly response?: Response

	constructor(message: string, details: ErpApiErrorDetails) {
		super(message)
		this.name = 'ErpApiError'
		this.status = details.status
		this.body = details.body
		this.request = details.request
		this.response = details.response
	}
}

type ErpResult<TData, TError> = {
	data: TData | undefined
	error: TError | undefined
	request?: Request
	response?: Response
}

/**
 * Unwrap a generated-SDK result: return `data` on success, throw an
 * `ErpApiError` (with HTTP status when available) otherwise.
 */
export function ensureErpData<TData, TError>(
	result: ErpResult<TData, TError>,
	context: string,
): TData {
	if (result.error !== undefined) {
		const status = result.response?.status
		throw new ErpApiError(
			status !== undefined ? `${context} failed with status ${status}` : `${context} failed`,
			{
				status,
				body: result.error,
				request: result.request,
				response: result.response,
			},
		)
	}
	return result.data as TData
}

/**
 * Assert a generated-SDK call without a response body succeeded,
 * throwing an `ErpApiError` otherwise (for 204 No Content endpoints).
 */
export function ensureErpSuccess<TError>(
	result: { error: TError | undefined; request?: Request; response?: Response },
	context: string,
): void {
	if (result.error !== undefined) {
		const status = result.response?.status
		throw new ErpApiError(
			status !== undefined ? `${context} failed with status ${status}` : `${context} failed`,
			{
				status,
				body: result.error,
				request: result.request,
				response: result.response,
			},
		)
	}
}
