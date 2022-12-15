import type { Client } from '../client/interfaces/Client';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientIndex } from './writeClientIndex';

jest.mock('./fileSystem');

describe('writeClientIndex', () => {
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
                service: () => 'service',
                context: () => 'context',
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

        await writeClientIndex(client, templates, '/', true, true, true, true, 'Service');

        expect(writeFile).toBeCalledWith('/index.ts', 'index');
    });
});
