import { equal, deepEqual } from 'assert';
import licenseFiles from '../lib/license-files';

describe('license files detector', function () {
    it('should export a function', function () {
        equal(typeof licenseFiles, 'function');
    });

    it('no files', function () {
        deepEqual(licenseFiles([]), []);
    });

    it('no license files', function () {
        deepEqual(licenseFiles(['.gitignore', '.travis.yml', 'TODO']), []);
    });

    it('one license candidate', function () {
        deepEqual(licenseFiles(['LICENSE', '.gitignore', 'src']), ['LICENSE']);
    });

    it('multiple license candidates detected in the right order', function () {
        deepEqual(licenseFiles(['COPYING', '.gitignore', 'LICENCE', 'LICENSE', 'src', 'README']), [
            'LICENSE',
            'LICENCE',
            'COPYING',
            'README',
        ]);
    });

    it('extensions have no effect', function () {
        deepEqual(licenseFiles(['LICENCE.txt', '.gitignore', 'src']), ['LICENCE.txt']);
    });

    it('lower/upper case has no effect', function () {
        deepEqual(licenseFiles(['LiCeNcE', '.gitignore', 'src']), ['LiCeNcE']);
    });

    it('LICENSE-MIT gets matched', function () {
        deepEqual(licenseFiles(['LICENSE', '.gitignore', 'LICENSE-MIT', 'src']), ['LICENSE', 'LICENSE-MIT']);
    });

    it('only the first LICENSE-* file gets matched', function () {
        deepEqual(licenseFiles(['license-foobar.txt', '.gitignore', 'LICENSE-MIT']), ['license-foobar.txt']);
    });
});
