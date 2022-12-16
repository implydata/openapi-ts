import type { Service } from '../client/interfaces/Service';
import { getServiceNames } from './getServiceNames';

describe('getServiceNames', () => {
    it('should return sorted list', () => {
        const john: Service = {
            name: 'John',
            operations: [],
            imports: [],
            errorImports: [],
        };
        const jane: Service = {
            name: 'Jane',
            operations: [],
            imports: [],
            errorImports: [],
        };
        const doe: Service = {
            name: 'Doe',
            operations: [],
            imports: [],
            errorImports: [],
        };

        const services = [john, jane, doe];

        expect(getServiceNames([])).toEqual([]);
        expect(getServiceNames(services)).toEqual(['Doe', 'Jane', 'John']);
    });
});
