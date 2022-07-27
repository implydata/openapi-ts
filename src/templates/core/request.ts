import type { ApiRequestOptions } from './ApiRequestOptions';
import type { OpenAPIConfig } from './OpenAPI';
import { request as requestFetch } from './requestFetch';

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns Promise<T>
 * @throws ApiError
 */
export const request = async <T>(config: OpenAPIConfig, options: ApiRequestOptions): Promise<T> => {
    if (options.onDownloadProgress || options.onUploadProgress) {
        const { request: requestXhr } = await import('./requestXhr');
        return requestXhr(config, options);
    }

    return requestFetch(config, options);
};
