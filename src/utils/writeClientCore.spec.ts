import { EOL } from 'os';

import type { Client } from '../client/interfaces/Client';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';

jest.mock('./fileSystem');

describe('writeClientCore', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: '1.0',
            models: [],
            services: [],
        };

        const templates: Templates = {
            index: () => 'index',
            exports: {
                model: () => 'model',
                schema: () => 'schema',
                client: () => 'service',
                operation: () => 'operation',
            },
            core: {
                apiError: () => 'apiError',
                apiRequestOptions: () => 'apiRequestOptions',
                apiResult: () => 'apiResult',
                functions: () => 'functions',
                openAPI: () => 'openAPI',
                request: () => 'request',
                requestFetch: () => 'requestFetch',
                requestXhr: () => 'requestXhr',
            },
        };

        await writeClientCore(client, templates, '/', Indent.SPACE_4);

        expect(writeFile).toBeCalledWith('/ApiError.ts', `apiError${EOL}`);
        expect(writeFile).toBeCalledWith('/ApiRequestOptions.ts', `apiRequestOptions${EOL}`);
        expect(writeFile).toBeCalledWith('/ApiResult.ts', `apiResult${EOL}`);
        expect(writeFile).toBeCalledWith('/functions.ts', `functions${EOL}`);
        expect(writeFile).toBeCalledWith('/OpenAPI.ts', `openAPI${EOL}`);
        expect(writeFile).toBeCalledWith('/request.ts', `request${EOL}`);
        expect(writeFile).toBeCalledWith('/requestFetch.ts', `requestFetch${EOL}`);
        expect(writeFile).toBeCalledWith('/requestXhr.ts', `requestXhr${EOL}`);
    });
});
