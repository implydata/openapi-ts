/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import type { OpenAPIConfig } from './OpenAPI';
import { getUrl, getFormData, getRequestBody, getHeaders, isSuccess, catchErrorCodes, isString } from './functions';

const getResponseBody = (xhr: XMLHttpRequest): any => {
    if (xhr.status !== 204) {
        try {
            const contentType = xhr.getResponseHeader('Content-Type');
            if (contentType) {
                const isJSON = contentType.toLowerCase().startsWith('application/json');
                if (isJSON) {
                    return JSON.parse(xhr.responseText);
                } else {
                    return xhr.responseText;
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    return undefined;
};

const getResponseHeader = (xhr: XMLHttpRequest, responseHeader?: string): string | undefined => {
    if (responseHeader) {
        const content = xhr.getResponseHeader(responseHeader);
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};

const sendRequest = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: FormData | undefined,
    headers: Headers
): Promise<XMLHttpRequest> => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, url, true);
    xhr.withCredentials = config.WITH_CREDENTIALS;

    headers.forEach((value, key) => {
        xhr.setRequestHeader(key, value);
    });

    return new Promise<XMLHttpRequest>((resolve, reject) => {
        xhr.onload = () => resolve(xhr);
        xhr.onabort = () => reject(new Error('Request aborted'));
        xhr.onerror = () => reject(new Error('Network error'));
        if (options.onDownloadProgress) {
            xhr.onprogress = options.onDownloadProgress;
        }
        if (options.onUploadProgress) {
            xhr.upload.onprogress = options.onUploadProgress;
        }
        if (options.signal) {
            options.signal.addEventListener('abort', () => xhr.abort());
        }
        xhr.send(body ?? formData);
    });
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
    const responseBody = getResponseBody(response);
    const responseHeader = getResponseHeader(response, options.responseHeader);

    const result: ApiResult = {
        url,
        ok: isSuccess(response.status),
        status: response.status,
        statusText: response.statusText,
        body: responseHeader ?? responseBody,
    };

    catchErrorCodes(options, result);

    return result.body;
};
