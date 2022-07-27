/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import type { OpenAPIConfig } from './OpenAPI';
import { catchErrorCodes, getFormData, getHeaders, getRequestBody, getUrl, isString } from './functions';

const sendRequest = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: FormData | undefined,
    headers: Headers
): Promise<Response> => {
    const request: RequestInit = {
        headers,
        body: body ?? formData,
        method: options.method,
        signal: options.signal,
    };

    if (config.WITH_CREDENTIALS) {
        request.credentials = config.CREDENTIALS;
    }

    return await fetch(url, request);
};

const getResponseBody = async (response: Response): Promise<any> => {
    if (response.status !== 204) {
        try {
            const contentType = response.headers.get('Content-Type');
            if (contentType) {
                const isJSON = contentType.toLowerCase().startsWith('application/json');
                if (isJSON) {
                    return await response.json();
                } else {
                    return await response.text();
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    return undefined;
};

const getResponseHeader = (response: Response, responseHeader?: string): string | undefined => {
    if (responseHeader) {
        const content = response.headers.get(responseHeader);
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns Promise<T>
 * @throws ApiError
 */
export const request = async <T>(config: OpenAPIConfig, options: ApiRequestOptions): Promise<T> => {
    const url = getUrl(config, options);
    const formData = getFormData(options);
    const body = getRequestBody(options);
    const headers = await getHeaders(config, options);

    options.signal?.throwIfAborted();

    const response = await sendRequest(config, options, url, body, formData, headers);
    const responseBody = await getResponseBody(response);
    const responseHeader = getResponseHeader(response, options.responseHeader);

    const result: ApiResult = {
        url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: responseHeader ?? responseBody,
    };

    catchErrorCodes(options, result);

    return result.body;
};
