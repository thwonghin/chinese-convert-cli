import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { FanHuaJi } from '@/libs/fanhuaji';
import { Converter, ConvertResponse } from '@/libs/fanhuaji/types';

const axiosMock = new MockAdapter(axios);

function mockConvertResponse(data: any) {
    axiosMock.onPost('https://api.zhconvert.org/convert').reply(200, data);
}

describe('FanHuaJi', () => {
    let fanhuaji: FanHuaJi;
    let res: ConvertResponse;
    let error: Error;

    describe('when the API response is code === 0', () => {
        beforeAll(async () => {
            fanhuaji = new FanHuaJi();
            mockConvertResponse({ code: 0 });

            try {
                res = await fanhuaji.convert({
                    text: 'test',
                    converter: Converter.HK,
                });
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error = e;
            }
        });

        afterAll(() => {
            axiosMock.reset();
        });

        it('should call API with correct params', () => {
            expect(axiosMock.history.post[0].baseURL).toBe(
                'https://api.zhconvert.org',
            );
            expect(axiosMock.history.post[0].url).toBe('/convert');
            expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
                text: 'test',
                converter: Converter.HK,
            });
        });

        it('should return correct result', () => {
            expect(res).toEqual({
                code: 0,
            });
        });
    });

    describe('when the API response is code !== 0', () => {
        beforeAll(async () => {
            fanhuaji = new FanHuaJi();
            mockConvertResponse({ code: 100, msg: 'Unknown Error' });

            try {
                res = await fanhuaji.convert({
                    text: 'test',
                    converter: Converter.HK,
                });
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error = e;
            }
        });

        afterAll(() => {
            axiosMock.reset();
        });

        it('should call API with correct params', () => {
            expect(axiosMock.history.post[0].baseURL).toBe(
                'https://api.zhconvert.org',
            );
            expect(axiosMock.history.post[0].url).toBe('/convert');
            expect(JSON.parse(axiosMock.history.post[0].data)).toEqual({
                text: 'test',
                converter: Converter.HK,
            });
        });

        it('should have correct error message', () => {
            expect(error.message).toBe('Unknown Error (100)');
        });
    });
});
