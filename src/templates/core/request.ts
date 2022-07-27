import type { ApiRequestOptions } from './ApiRequestOptions';
import type { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import { request as requestFetch } from './requestFetch';

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): CancelablePromise<T> => {
    if (options.onDownloadProgress || options.onUploadProgress) {
        return import('./requestXhr').then(({ request: requestXhr }) =>
            requestXhr(config, options)
        ) as CancelablePromise<T>;
    }

    return requestFetch(config, options);
};
