import { sort } from './sort';
import { unique } from './unique';

/**
 * Set unique imports, sorted by name
 * @param service
 */
export const postProcessServiceImports = (imports: string[]): string[] => {
    return imports.filter(unique).sort(sort);
};
