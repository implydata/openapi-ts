import * as api from './index';

class ApiClient {
    constructor(config?: Partial<api.OpenAPIConfig>) {
        for (const [key, value] of Object.entries(api)) {
            if (key.endsWith('Service')) {
                const name = key[0].toLowerCase() + key.slice(1, key.lastIndexOf('Service'));
                Object.defineProperty(this, name, {
                    value: new (value as any)(config),
                    enumerable: true,
                    writable: false,
                });
            }
        }
    }
}

(window as any).api = { ...api, ApiClient };
