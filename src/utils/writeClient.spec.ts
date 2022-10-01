import type { Client } from '../client/interfaces/Client';
import { Indent } from '../Indent';
import { mkdir, rmdir, writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClient } from './writeClient';

jest.mock('./fileSystem');

describe('writeClient', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [],
        };

        const templates: Templates = {
            index: () => 'index',
            exports: {
                model: () => 'model',
                schema: () => 'schema',
                service: () => 'service',
                hooks: () => 'hooks',
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

        await writeClient(
            client,
            templates,
            './dist',
            true,
            true,
            true,
            true,
            true,
            Indent.SPACE_4,
            'Service',
            'react-query'
        );

        expect(rmdir).toBeCalled();
        expect(mkdir).toBeCalled();
        expect(writeFile).toBeCalled();
    });
});
