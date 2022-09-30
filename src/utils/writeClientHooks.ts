import { resolve } from 'path';

import type { Service } from '../client/interfaces/Service';
import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { formatCode as f } from './formatCode';
import { formatIndentation as i } from './formatIndentation';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate react-query hooks for Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param reactQueryImport Import path for react-query
 */
export const writeClientHooks = async (
    services: Service[],
    templates: Templates,
    outputPath: string,
    indent: Indent,
    postfix: string,
    reactQueryImport: string
): Promise<void> => {
    for (const service of services) {
        const file = resolve(outputPath, `${service.name}Hooks.ts`);
        const templateResult = templates.exports.hooks({ ...service, postfix, reactQueryImport });
        await writeFile(file, i(f(templateResult), indent));
    }

    const file = resolve(outputPath, 'ServiceContext.tsx');
    const templateResult = templates.exports.context({ services, postfix });
    await writeFile(file, i(f(templateResult), indent));
};
