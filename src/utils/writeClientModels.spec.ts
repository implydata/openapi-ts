import { EOL } from 'os';

import type { Model } from '../client/interfaces/Model';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientModels } from './writeClientModels';

jest.mock('./fileSystem');

describe('writeClientModels', () => {
    it('should write to filesystem', async () => {
        const models: Model[] = [
            {
                export: 'interface',
                name: 'User',
                type: 'User',
                base: 'User',
                template: null,
                link: null,
                description: null,
                isDefinition: true,
                isReadOnly: false,
                isRequired: false,
                isNullable: false,
                imports: [],
                enum: [],
                enums: [],
                properties: [],
            },
        ];

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

        await writeClientModels(models, templates, '/', Indent.SPACE_4);

        expect(writeFile).toBeCalledWith('/User.ts', `model${EOL}`);
    });
});
