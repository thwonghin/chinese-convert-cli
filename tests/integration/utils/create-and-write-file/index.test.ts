import * as path from 'path';
import * as fs from 'fs';
import { createAndWriteFile } from '@/utils';

interface TestParams {
    filepath: string;
    isError: boolean;
}

const tempDirectoryPath = path.resolve(__dirname, 'temp');
const existingFileName = 'existing.txt';

async function initSetup(): Promise<void> {
    await fs.promises.rmdir(tempDirectoryPath, {
        recursive: true,
    });
    await fs.promises.mkdir(tempDirectoryPath);
    await fs.promises.writeFile(
        path.resolve(tempDirectoryPath, existingFileName),
        '',
    );
}

afterAll(async () => {
    await fs.promises.rmdir(tempDirectoryPath, {
        recursive: true,
    });
});

describe('createAndWriteFile', () => {
    describe.each`
        condition                      | filepath
        ${'directory does not exists'} | ${'1/2/3/4/test.txt'}
        ${'directory exists'}          | ${'test2.txt'}
        ${'file exists'}               | ${existingFileName}
    `('when $condition', (testParams: TestParams) => {
        beforeAll(async () => {
            await initSetup();

            await createAndWriteFile({
                filePath: path.resolve(tempDirectoryPath, testParams.filepath),
                content: 'test-content',
            });
        });

        it('should write file with correct content', async () => {
            const result = await fs.promises.readFile(
                path.resolve(tempDirectoryPath, testParams.filepath),
                'utf8',
            );

            expect(result).toBe('test-content');
        });
    });
});
