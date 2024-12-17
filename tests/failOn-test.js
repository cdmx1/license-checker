import { equal } from 'assert';
import { join } from 'path';
import { spawn } from 'child_process';

describe('bin/license-checker-rseidelsohn', function () {
    this.timeout(8000);
    it('should exit 1 if it finds a single license type (MIT) license due to --failOn MIT', function (done) {
        spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn'), '--failOn', 'MIT'], {
            cwd: join(__dirname, '../'),
            stdio: 'ignore',
        }).on('exit', function (code) {
            equal(code, 1);
            done();
        });
    });

    it('should exit 1 if it finds forbidden licenses license due to --failOn MIT;ISC', function (done) {
        spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn'), '--failOn', 'MIT;ISC'], {
            cwd: join(__dirname, '../'),
            stdio: 'ignore',
        }).on('exit', function (code) {
            equal(code, 1);
            done();
        });
    });

    it('should give warning about commas if --failOn MIT,ISC is provided', function (done) {
        var proc = spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn'), '--failOn', 'MIT,ISC'], {
            cwd: join(__dirname, '../'),
            stdio: 'pipe',
        });
        var stderr = '';
        proc.stdout.on('data', function () {});
        proc.stderr.on('data', function (data) {
            stderr += data.toString();
        });
        proc.on('close', function () {
            equal(
                stderr.indexOf('--failOn argument takes semicolons as delimeters instead of commas') >= 0,
                true,
            );
            done();
        });
    });
});
