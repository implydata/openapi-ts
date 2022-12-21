import browser from './scripts/browser';
import { cleanup } from './scripts/cleanup';
import { compileWithTypescript } from './scripts/compileWithTypescript';
import { copyAsset } from './scripts/copyAsset';
import { generateClient } from './scripts/generateClient';
import server from './scripts/server';

describe('v3', () => {
    beforeAll(async () => {
        cleanup('v3');
        await generateClient('v3', 'v3');
        copyAsset('index.html', 'v3/index.html');
        copyAsset('main.ts', 'v3/main.ts');
        compileWithTypescript('v3');
        await server.start('v3');
        await browser.start();
    }, 30000);

    afterAll(async () => {
        await browser.stop();
        await server.stop();
    });

    it('requests token', async () => {
        await browser.exposeFunction('tokenRequest', jest.fn().mockResolvedValue('MY_TOKEN'));
        const result = await browser.evaluate(async () => {
            const { OpenAPI, SimpleService } = (window as any).api;
            OpenAPI.token = (window as any).tokenRequest;
            OpenAPI.username = undefined;
            OpenAPI.password = undefined;
            return await new SimpleService().getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const result = await browser.evaluate(async () => {
            const { OpenAPI, SimpleService } = (window as any).api;
            OpenAPI.token = undefined;
            OpenAPI.username = 'username';
            OpenAPI.password = 'password';
            return await new SimpleService().getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('supports complex params', async () => {
        const result = await browser.evaluate(async () => {
            const { ComplexService } = (window as any).api;
            return await new ComplexService().complexTypes({
                first: {
                    second: {
                        third: 'Hello World!',
                    },
                },
            });
        });
        expect(result).toBeDefined();
    });

    it('support form data', async () => {
        const result = await browser.evaluate(async () => {
            const { ParametersService } = (window as any).api;
            return await new ParametersService().callWithParameters({
                parametersHeader: 'valueHeader',
                parameterQuery: 'valueQuery',
                parameterForm: 'valueForm',
                parameterCookie: 'valueCookie',
                parameterPath: 'valuePath',
                requestBody: {
                    prop: 'valueBody',
                },
            });
        });
        expect(result).toBeDefined();
    });

    it('can abort the request', async () => {
        let error;
        try {
            await browser.evaluate(async () => {
                const { SimpleService } = (window as any).api;
                const controller = new AbortController();
                const promise = new SimpleService().getCallWithoutParametersAndResponse({ signal: controller.signal });
                setTimeout(() => {
                    controller.abort();
                }, 10);
                await promise;
            });
        } catch (e) {
            error = (e as Error).message;
        }
        expect(error).toContain('CancelError: Request aborted');
    });

    it('should throw known error (500)', async () => {
        const error = await browser.evaluate(async () => {
            try {
                const { ErrorService } = (window as any).api;
                await new ErrorService().testErrorCode(500);
            } catch (e) {
                const error = e as any;
                return JSON.stringify({
                    name: error.name,
                    message: error.message,
                    url: error.url,
                    status: error.status,
                    statusText: error.statusText,
                    body: error.body,
                });
            }
            return;
        });

        expect(error).toBe(
            JSON.stringify({
                name: 'ApiError',
                message: 'Custom message: Internal Server Error',
                url: 'http://localhost:3000/base/api/v1.0/error?status=500',
                status: 500,
                statusText: 'Internal Server Error',
                body: {
                    status: 500,
                    message: 'hello world',
                },
            })
        );
    });

    it('should throw unknown error (409)', async () => {
        const error = await browser.evaluate(async () => {
            try {
                const { ErrorService } = (window as any).api;
                await new ErrorService().testErrorCode(409);
            } catch (e) {
                const error = e as any;
                return JSON.stringify({
                    name: error.name,
                    message: error.message,
                    url: error.url,
                    status: error.status,
                    statusText: error.statusText,
                    body: error.body,
                });
            }
            return;
        });
        expect(error).toBe(
            JSON.stringify({
                name: 'ApiError',
                message: 'Generic Error',
                url: 'http://localhost:3000/base/api/v1.0/error?status=409',
                status: 409,
                statusText: 'Conflict',
                body: {
                    status: 409,
                    message: 'hello world',
                },
            })
        );
    });

    it('it should parse query params', async () => {
        const result = await browser.evaluate(async () => {
            const { ParametersService } = (window as any).api;
            return (await new ParametersService().postCallWithOptionalParam({
                page: 0,
                size: 1,
                sort: ['location'],
            })) as Promise<any>;
        });
        expect(result.query).toStrictEqual({ parameter: { page: '0', size: '1', sort: 'location' } });
    });
});
