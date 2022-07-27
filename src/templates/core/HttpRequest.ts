/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApiRequestOptions } from './ApiRequestOptions';
import { BaseHttpRequest } from './BaseHttpRequest';
import type { OpenAPIConfig } from './OpenAPI';
import { request as __request } from './requestFetch';

export class HttpRequest extends BaseHttpRequest {
    constructor(config: OpenAPIConfig) {
        super(config);
    }

    /**
     * Request method
     * @param options The request options from the service
     * @returns Promise<T>
     * @throws ApiError
     */
    public override request<T>(options: ApiRequestOptions): Promise<T> {
        return __request(this.config, options);
    }
}
