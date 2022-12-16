import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import { mkdir, rmdir } from './fileSystem';
import { isSubDirectory } from './isSubdirectory';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';
import { writeClientIndex } from './writeClientIndex';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeClientServices } from './writeClientServices';
import { writeOperations } from './writeOperations';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param exportCore Generate core client classes
 * @param exportClients Generate clients
 * @param exportModels Generate models
 * @param exportSchemas Generate schemas
 * @param exportOperations Generate request/response types
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param contextName Hook context name
 * @param reactQueryImport Import path for react-query
 */
export const writeClient = async (
    client: Client,
    templates: Templates,
    output: string,
    exportCore: boolean,
    exportClients: boolean,
    exportModels: boolean,
    exportSchemas: boolean,
    exportOperations: boolean,
    indent: Indent,
    postfix: string
): Promise<void> => {
    const outputPath = resolve(process.cwd(), output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathClients = resolve(outputPath, 'services');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathOperations = resolve(outputPath, 'operations');
    const outputPathSchemas = resolve(outputPath, 'schemas');

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    if (exportCore) {
        await rmdir(outputPathCore);
        await mkdir(outputPathCore);
        await writeClientCore(client, templates, outputPathCore, indent);
    }

    if (exportClients) {
        await rmdir(outputPathClients);
        await mkdir(outputPathClients);
        await writeClientServices(client.services, templates, outputPathClients, indent, postfix);
    }

    if (exportSchemas) {
        await rmdir(outputPathSchemas);
        await mkdir(outputPathSchemas);
        await writeClientSchemas(client.models, templates, outputPathSchemas, indent);
    }

    if (exportModels) {
        await rmdir(outputPathModels);
        await mkdir(outputPathModels);
        await writeClientModels(client.models, templates, outputPathModels, indent);
    }

    if (exportOperations) {
        await rmdir(outputPathOperations);
        await mkdir(outputPathOperations);
        await writeOperations(client.services, templates, outputPathOperations, indent, postfix);
    }

    if (exportCore || exportClients || exportSchemas || exportModels) {
        await mkdir(outputPath);
        await writeClientIndex(
            client,
            templates,
            outputPath,
            exportCore,
            exportClients,
            exportModels,
            exportSchemas,
            exportOperations,
            postfix
        );
    }
};
