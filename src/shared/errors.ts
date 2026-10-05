export interface TanssApiErrorDetails {
	status?: number
	body: unknown
	request?: Request
	response?: Response
}

/**
 * Error thrown by the client facades (`TanssClient`, `TanssErpClient`) when
 * TANSS answers with a non-2xx status.
 *
 * The generated SDK returns `{ data } | { error }` unions; the facades
 * converts the error branch into this exception so callers can use plain
 * `try/catch` instead of checking every response.
 */
export class TanssApiError extends Error {
	readonly status?: number
	readonly body: unknown
	readonly request?: Request
	readonly response?: Response

	constructor(message: string, details: TanssApiErrorDetails) {
		super(message)
		this.name = 'TanssApiError'
		this.status = details.status
		this.body = details.body
		this.request = details.request
		this.response = details.response
	}
}

/**
 * @deprecated Use {@link TanssApiError}. Kept as an alias so existing
 * `instanceof ErpApiError` checks keep working.
 */
export const ErpApiError = TanssApiError
/** @deprecated Use {@link TanssApiError}. */
export type ErpApiError = TanssApiError

type ApiResult<TData, TError> = {
	data: TData | undefined
	error: TError | undefined
	request?: Request
	response?: Response
}

/**
 * Unwrap a generated-SDK result: return `data` on success, throw an
 * `TanssApiError` (with HTTP status when available) otherwise.
 */
export function ensureData<TData, TError>(
	result: ApiResult<TData, TError>,
	context: string,
): TData {
	if (result.error !== undefined) {
		const status = result.response?.status
		throw new TanssApiError(
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
 * throwing an `TanssApiError` otherwise (for 204 No Content endpoints).
 */
export function ensureSuccess<TError>(
	result: { error: TError | undefined; request?: Request; response?: Response },
	context: string,
): void {
	if (result.error !== undefined) {
		const status = result.response?.status
		throw new TanssApiError(
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
