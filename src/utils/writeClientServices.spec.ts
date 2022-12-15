import { EOL } from 'os';

import type { Service } from '../client/interfaces/Service';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientServices } from './writeClientServices';

jest.mock('./fileSystem');

describe('writeClientServices', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
            },
        ];

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

        await writeClientServices(services, templates, '/', Indent.SPACE_4, 'Service');

        expect(writeFile).toBeCalledWith('/UserService.ts', `service${EOL}`);
    });
});
