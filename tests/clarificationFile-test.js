import { equal } from 'assert';
import { join } from 'path';
import { init } from '../lib/index';
import { describe } from 'node:test';
import { spawn } from 'child_process';


describe('clarifications', function() {
    function parseAndClarify(parsePath, clarificationPath, result) {
        return function(done) {
            init(
                {
                    start: join(__dirname, parsePath),
                    clarificationsFile: join(__dirname, clarificationPath),
                    customFormat: {
                        "licenses": "",
                        "publisher": "",
                        "email": "",
                        "path": "",
                        "licenseFile": "",
                        "licenseText": ""
                    }
                },
                function(err, filtered) {
                    result.output = filtered;
                    done();
                },
            );
        };
    }

    let result = {};

    const clarifications_path = './fixtures/clarifications';

    before(parseAndClarify(clarifications_path, '../clarificationExample.json', result));

    it('should replace existing license', function() {
        const output = result.output['license-checker-rseidelsohn@0.0.0'];

        equal(output.licenseText, "Some mild rephrasing of an MIT license");
        equal(output.licenses, "MIT");
    });


    it('should exit 1 if the checksum does not match', function(done) {
        let data = "";
        let license_checker = spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn'), '--start', join(__dirname, clarifications_path), '--clarificationsFile', join(__dirname, clarifications_path, 'mismatch/clarification.json')], {
            cwd: join(__dirname, '../'),
        });

        license_checker.stderr.on('data', function(stderr) {
            data += stderr.toString();
        });

        license_checker.on('exit', function(code) {
            equal(code, 1);
            equal(data.includes("checksum mismatch"), true)
            done();
        });
    });


    it('should succeed if no checksum is specified', function(done) {
        let data = "";

        let license_checker = spawn('node', [join(__dirname, '../bin/license-checker-rseidelsohn'), '--start', join(__dirname, clarifications_path), '--clarificationsFile', join(__dirname, clarifications_path, 'example/noChecksum.json')], {
            cwd: join(__dirname, '../'),
        });

        license_checker.stdout.on("data", function(stdout) {
            data += stdout.toString();
        })

        license_checker.on('exit', function(code) {
            equal(code, 0);
            equal(data.includes("MIT"), true)
            equal(data.includes("MY_IP"), true)
            done();
        });
    })

    it('should snip the embedded license out of the README', function(done) {
        let data = "";

        let license_checker = spawn(
            'node',
            [
                join(__dirname, '../bin/license-checker-rseidelsohn'),
                '--start', join(__dirname, clarifications_path),
                '--clarificationsFile', join(__dirname, clarifications_path, 'weirdStart/clarification.json'),
                '--customPath', join(__dirname, clarifications_path, 'weirdStart/customFormat.json')
            ], {
            cwd: join(__dirname, '../'),
        });

        license_checker.stdout.on("data", function(stdout) {
            data += stdout.toString();
        })

        license_checker.on('exit', function(code) {
            equal(code, 0);
            equal(data.includes("README"), true)
            equal(data.includes("text text text describing the project"), false)
            equal(data.includes("# LICENSE"), true)
            equal(data.includes("Standard MIT license"), true)
            equal(data.includes("# And one more thing..."), false)
            equal(data.includes("More text AFTER the license because the real world is difficult :("), false)
            done();
        });
    })

    it('should snip the embedded license in the README to the end.', function(done) {
        let data = "";

        let license_checker = spawn(
            'node',
            [
                join(__dirname, '../bin/license-checker-rseidelsohn'),
                '--start', join(__dirname, clarifications_path),
                '--clarificationsFile', join(__dirname, clarifications_path, 'weirdStart/startOnlyClarification.json'),
                '--customPath', join(__dirname, clarifications_path, 'weirdStart/customFormat.json')
            ], {
            cwd: join(__dirname, '../'),
        });

        license_checker.stdout.on("data", function(stdout) {
            data += stdout.toString();
        })

        license_checker.on('exit', function(code) {
            equal(code, 0);
            equal(data.includes("README"), true)
            equal(data.includes("text text text describing the project"), false)
            equal(data.includes("# LICENSE"), true)
            equal(data.includes("Standard MIT license"), true)
            equal(data.includes("# And one more thing..."), true)
            equal(data.includes("More text AFTER the license because the real world is difficult :("), true)
            done();
        });
    })
});
