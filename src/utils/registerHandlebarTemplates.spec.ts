import { registerHandlebarTemplates } from './registerHandlebarTemplates';

describe('registerHandlebarTemplates', () => {
    it('should return correct templates', () => {
        const templates = registerHandlebarTemplates();
        expect(templates.index).toBeDefined();
        expect(templates.exports.model).toBeDefined();
        expect(templates.exports.schema).toBeDefined();
        expect(templates.exports.service).toBeDefined();
        expect(templates.core.apiError).toBeDefined();
        expect(templates.core.apiRequestOptions).toBeDefined();
        expect(templates.core.apiResult).toBeDefined();
        expect(templates.core.functions).toBeDefined();
        expect(templates.core.openAPI).toBeDefined();
        expect(templates.core.request).toBeDefined();
        expect(templates.core.requestFetch).toBeDefined();
        expect(templates.core.requestXhr).toBeDefined();
    });
});
