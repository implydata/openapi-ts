import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { formatIndentation as i } from './formatIndentation';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate OpenAPI core files, this includes the basic boilerplate code to handle requests.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 */
export const writeClientCore = async (
    client: Client,
    templates: Templates,
    outputPath: string,
    indent: Indent
): Promise<void> => {
    const context = {
        server: client.server,
        version: client.version,
    };
    await writeFile(resolve(outputPath, 'ApiError.ts'), i(templates.core.apiError(context), indent));
    await writeFile(resolve(outputPath, 'ApiRequestOptions.ts'), i(templates.core.apiRequestOptions(context), indent));
    await writeFile(resolve(outputPath, 'ApiResult.ts'), i(templates.core.apiResult(context), indent));
    await writeFile(resolve(outputPath, 'functions.ts'), i(templates.core.functions(context), indent));
    await writeFile(resolve(outputPath, 'OpenAPI.ts'), i(templates.core.openAPI(context), indent));
    await writeFile(resolve(outputPath, 'request.ts'), i(templates.core.request(context), indent));
    await writeFile(resolve(outputPath, 'requestFetch.ts'), i(templates.core.requestFetch(context), indent));
    await writeFile(resolve(outputPath, 'requestXhr.ts'), i(templates.core.requestXhr(context), indent));
};
