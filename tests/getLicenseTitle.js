import { equal, ok, notEqual } from 'assert';
import { isError } from 'util';
import getLicenseTitle from '../lib/getLicenseTitle';

describe('license parser', function () {
    it('should export a function', function () {
        equal(typeof getLicenseTitle, 'function');
    });

    it('should throw an error when called with a non-string argument', function (done) {
        try {
            getLicenseTitle({});
        } catch (err) {
            ok(isError(err));
            done();
        }
    });

    it('removes newlines from the argument', function () {
        equal(getLicenseTitle('unde\nfined'), 'Undefined');
    });

    it('undefined check', function () {
        equal(getLicenseTitle(undefined), 'Undefined');
    });

    it('MIT check', function () {
        const data = getLicenseTitle('asdf\nasdf\nasdf\nPermission is hereby granted, free of charge, to any');
        equal(data, 'MIT*');
    });

    it('MIT word check', function () {
        const data = getLicenseTitle('asdf\nasdf\nMIT\nasdf\n');
        equal(data, 'MIT*');
    });

    it('Non-MIT word check', function () {
        const data = getLicenseTitle('prefixMIT\n');
        notEqual(data, 'MIT*');
    });

    it('GPL word check', function () {
        let data;
        data = getLicenseTitle('GNU GENERAL PUBLIC LICENSE \nVersion 1, February 1989');
        equal(data, 'GPL-1.0*');
        data = getLicenseTitle('GNU GENERAL PUBLIC LICENSE \nVersion 2, June 1991');
        equal(data, 'GPL-2.0*');
        data = getLicenseTitle('GNU GENERAL PUBLIC LICENSE \nVersion 3, 29 June 2007');
        equal(data, 'GPL-3.0*');
    });

    it('Non-GPL word check', function () {
        let data;
        data = getLicenseTitle('preGNU GENERAL PUBLIC LICENSE \nVersion 1, February 1989');
        notEqual(data, 'GPL-1.0*');
        data = getLicenseTitle('preGNU GENERAL PUBLIC LICENSE \nVersion 2, June 1991');
        notEqual(data, 'GPL-2.0*');
        data = getLicenseTitle('preGNU GENERAL PUBLIC LICENSE \nVersion 3, 29 June 2007');
        notEqual(data, 'GPL-3.0*');
    });

    it('LGPL word check', function () {
        let data;
        data = getLicenseTitle('GNU LIBRARY GENERAL PUBLIC LICENSE\nVersion 2, June 1991');
        equal(data, 'LGPL-2.0*');
        data = getLicenseTitle('GNU LESSER GENERAL PUBLIC LICENSE\nVersion 2.1, February 1999');
        equal(data, 'LGPL-2.1*');
        data = getLicenseTitle('GNU LESSER GENERAL PUBLIC LICENSE \nVersion 3, 29 June 2007');
        equal(data, 'LGPL-3.0*');
    });

    it('BSD check', function () {
        const data = getLicenseTitle(
            'asdf\nRedistribution and use in source and binary forms, with or without\nasdf\n',
        );
        equal(data, 'BSD*');
    });

    it('BSD-Source-Code check', function () {
        const data = getLicenseTitle(
            'asdf\nRedistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\nasdf\n',
        );
        equal(data, 'BSD-Source-Code*');
    });

    it('BSD word check', function () {
        const data = getLicenseTitle('asdf\nasdf\nBSD\nasdf\n');
        equal(data, 'BSD*');
    });

    it('Non-BSD word check', function () {
        const data = getLicenseTitle('prefixBSD\n');
        notEqual(data, 'BSD*');
    });

    it('Apache version check', function () {
        const data = getLicenseTitle('asdf\nasdf\nApache License Version 2\nasdf\n');
        equal(data, 'Apache-2.0*');
    });

    it('Apache word check', function () {
        const data = getLicenseTitle('asdf\nasdf\nApache License\nasdf\n');
        equal(data, 'Apache*');
    });

    it('Non-Apache word check', function () {
        const data = getLicenseTitle('prefixApache License\n');
        notEqual(data, 'Apache*');
    });

    it('WTF check', function () {
        const data = getLicenseTitle('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE');
        equal(data, 'WTFPL*');
    });

    it('WTF word check', function () {
        const data = getLicenseTitle('asdf\nasdf\nWTFPL\nasdf\n');
        equal(data, 'WTFPL*');
    });

    it('Non-WTF word check', function () {
        const data = getLicenseTitle('prefixWTFPL\n');
        notEqual(data, 'WTFPL*');
    });

    it('ISC check', function () {
        const data = getLicenseTitle('asdfasdf\nThe ISC License\nasdfasdf');
        equal(data, 'ISC*');
    });

    it('Non-ISC word check', function () {
        const data = getLicenseTitle('prefixISC\n');
        notEqual(data, 'ISC*');
    });

    it('ISC word check', function () {
        const data = getLicenseTitle('asdf\nasdf\nISC\nasdf\n');
        equal(data, 'ISC*');
    });

    it('CC0-1.0 word check', function () {
        const data = getLicenseTitle(
            'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n\nYou can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.\n',
        );
        equal(data, 'CC0-1.0*');
    });

    it('Public Domain check', function () {
        let data = getLicenseTitle('Public Domain');
        equal(data, 'Public Domain');
        data = getLicenseTitle('public domain');
        equal(data, 'Public Domain');
        data = getLicenseTitle('Public domain');
        equal(data, 'Public Domain');
        data = getLicenseTitle('Public-Domain');
        equal(data, 'Public Domain');
        data = getLicenseTitle('Public_Domain');
        equal(data, 'Public Domain');
    });

    it('License at URL check', function () {
        let data = getLicenseTitle('License: http://example.com/foo');
        equal(data, 'Custom: http://example.com/foo');
        data = getLicenseTitle('See license at http://example.com/foo');
        equal(data, 'Custom: http://example.com/foo');
        data = getLicenseTitle('license: https://example.com/foo');
        equal(data, 'Custom: https://example.com/foo');
    });

    it('Likely not a license at URL check', function () {
        let data = getLicenseTitle('http://example.com/foo');
        equal(data, null);
        data = getLicenseTitle('See at http://example.com/foo');
        equal(data, null);
    });

    it('License at file check', function () {
        let data = getLicenseTitle('See license in LICENSE.md');
        equal(data, 'Custom: LICENSE.md');
        data = getLicenseTitle('SEE LICENSE IN LICENSE.md');
        equal(data, 'Custom: LICENSE.md');
    });

    it('Check for null', function () {
        const data = getLicenseTitle('this is empty, hi');
        equal(data, null);
    });

    describe('SPDX licenses', function () {
        it('should parse a basic SPDX license', function () {
            var data = ['MIT', 'LGPL-2.0', 'Apache-2.0', 'BSD-2-Clause'];
            data.forEach(function (licenseType) {
                equal(getLicenseTitle(licenseType), licenseType);
            });
        });

        it('should parse more complicated license expressions', function () {
            var data = [
                '(GPL-2.0+ WITH Bison-exception-2.2)',
                'LGPL-2.0 OR (ISC AND BSD-3-Clause+)',
                'Apache-2.0 OR ISC OR MIT',
            ];
            data.forEach(function (licenseType) {
                equal(getLicenseTitle(licenseType), licenseType);
            });
        });
    });
});
