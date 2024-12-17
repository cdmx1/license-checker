import { equal } from 'assert';
import { join } from 'path';
import { spawn } from 'child_process';

describe('bin/license-checker-rseidelsohn', function () {
    this.timeout(8000);

    it('should exit 0', function (done) {
        spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn')], {
            cwd: join(__dirname, '../'),
            stdio: 'ignore',
        }).on('exit', function (code) {
            equal(code, 0);
            done();
        });
    });
});
