import { HttpClient } from './HttpClient';
import { Indent } from './Indent';
import { parse as parseV2 } from './openApi/v2';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { writeClient } from './utils/writeClient';

export { HttpClient } from './HttpClient';
export { Indent } from './Indent';

export type Options = {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    clientName?: string;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportOperations?: boolean;
    exportSchemas?: boolean;
    indent?: Indent;
    postfixServices?: string;
    postfixModels?: string;
    request?: string;
    write?: boolean;
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param options.input The relative location of the OpenAPI spec
 * @param options.output The relative location of the output directory
 * @param options.httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param options.clientName Custom client class name
 * @param options.useOptions Use options or arguments functions
 * @param options.useUnionTypes Use union types instead of enums
 * @param options.exportCore Generate core client classes
 * @param options.exportServices Generate services
 * @param options.exportModels Generate models
 * @param options.exportOperations Generate request/response types
 * @param options.exportSchemas Generate schemas
 * @param options.indent Indentation options (4, 2 or tab)
 * @param options.postfixServices Service name postfix
 * @param options.postfixModels Model name postfix
 * @param options.request Path to custom request file
 * @param options.write Write the files to disk (true or false)
 */
export const generate = async ({
    input,
    output,
    httpClient = HttpClient.FETCH,
    clientName,
    useOptions = false,
    useUnionTypes = false,
    exportCore = true,
    exportServices = true,
    exportModels = true,
    exportOperations = false,
    exportSchemas = false,
    indent = Indent.SPACE_4,
    postfixServices = 'Service',
    postfixModels = '',
    request,
    write = true,
}: Options): Promise<void> => {
    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates({
        httpClient,
        useUnionTypes,
        useOptions,
    });

    switch (openApiVersion) {
        case OpenApiVersion.V2: {
            const client = parseV2(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                httpClient,
                useOptions,
                useUnionTypes,
                exportCore,
                exportServices,
                exportModels,
                exportSchemas,
                exportOperations,
                indent,
                postfixServices,
                postfixModels,
                clientName,
                request
            );
            break;
        }

        case OpenApiVersion.V3: {
            const client = parseV3(openApi);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient(
                clientFinal,
                templates,
                output,
                httpClient,
                useOptions,
                useUnionTypes,
                exportCore,
                exportServices,
                exportModels,
                exportSchemas,
                exportOperations,
                indent,
                postfixServices,
                postfixModels,
                clientName,
                request
            );
            break;
        }
    }
};

export default {
    HttpClient,
    generate,
};
