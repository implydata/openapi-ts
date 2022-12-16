import browser from './scripts/browser';
import { cleanup } from './scripts/cleanup';
import { compileWithTypescript } from './scripts/compileWithTypescript';
import { copyAsset } from './scripts/copyAsset';
import { generateClient } from './scripts/generateClient';
import server from './scripts/server';

describe('client', () => {
    beforeAll(async () => {
        cleanup('client');
        await generateClient('client', 'v3');
        copyAsset('index.html', 'client/index.html');
        copyAsset('main.ts', 'client/main.ts');
        compileWithTypescript('client');
        await server.start('client');
        await browser.start();
    }, 30000);

    afterAll(async () => {
        await browser.stop();
        await server.stop();
    });

    it('requests token', async () => {
        await browser.exposeFunction('tokenRequest', jest.fn().mockResolvedValue('MY_TOKEN'));
        const result = await browser.evaluate(async () => {
            const { ApiClient } = (window as any).api;
            const client = new ApiClient({
                token: (window as any).tokenRequest,
                username: undefined,
                password: undefined,
            });
            return await client.simple.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('uses credentials', async () => {
        const result = await browser.evaluate(async () => {
            const { ApiClient } = (window as any).api;
            const client = new ApiClient({
                token: undefined,
                username: 'username',
                password: 'password',
            });
            return await client.simple.getCallWithoutParametersAndResponse();
        });
        expect(result.headers.authorization).toBe('Basic dXNlcm5hbWU6cGFzc3dvcmQ=');
    });

    it('supports complex params', async () => {
        const result = await browser.evaluate(async () => {
            const { ApiClient } = (window as any).api;
            const client = new ApiClient();
            return await client.complex.complexTypes({
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
            const { ApiClient } = (window as any).api;
            const client = new ApiClient();
            return await client.parameters.callWithParameters({
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
                const { ApiClient } = (window as any).api;
                const client = new ApiClient();
                const controller = new AbortController();
                const promise = client.simple.getCallWithoutParametersAndResponse({
                    signal: controller.signal,
                });
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
                const { ApiClient } = (window as any).api;
                const client = new ApiClient();
                await client.error.testErrorCode({ status: 500 });
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
                const { ApiClient } = (window as any).api;
                const client = new ApiClient();
                await client.error.testErrorCode({ status: 409 });
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
});
