const crypto = require('crypto');

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDXjw/NGAjuLFklx/W0cDZTCiyMJj8LB2rB7Bc+4mDI6D+wcvmB
+EaPmJ4VfJeDX602tnOs4ETQ0Zx856jv5cYdXE1d37E1MrmZ2P7TCUPfmU9ZSKvH
Q19zN7XCMckrLNf+9f7GVrpue6k1NR6liJNut2eAqvizOQUitC3fsELB2wIDAQAB
AoGAMgOpoOagu9JiZNe+dL1MfXvw1hvRqNdxt8j1o8uWtUbd8CzdI4Ddrle05jtg
VEUQxY8Ty9rFXMYlzv1ZP0BK9PvAkeqErVRUUASvlwMWGmllr04STeJiMBvOopke
+R9gal6ZN9N/nQDNY8dRrBZTo4Cq79E9kJ/xaZxTmAYbiQECQQD7a3tb+VyPZMO2
n5nGrOaWHKqMkoda49/8gWQiJ5QQLNnYFetkfQoHojYISCy4a99g0ZQsgjOBZBnP
W6sU4HCbAkEA23xWwwsMtcFiuirE+6j2IA1lo6j91Y72FtPTecToL4gy56OWR3ho
uPHxUxBC30+hlSwnwHfhtTzfC5b48nbnwQJBALwh4V0hazGhpRGyu87+8kzBhp1J
yB8rBSBdciBcnV69MQWQ4WOAbVDpAKWR3GTj03MPYGEtzHy1+to/LfWhPKECQEMf
7LzrxTBU+2eqKuI4U0WMM1hxF2hXt4VVtShZgxT+V2smSZCED6r4O3DG2VzIUsd3
YJTpVPsDqcc2nd4xZUECQQDQwiukLXJ4y0yHPqSNpNksjg6FSjrr5Wu6CdazGQ1+
KZ0FwCldxBL8tGU2QzLY6Ee7yWvdKmpwjODOF3T8gEhs
-----END RSA PRIVATE KEY-----`;

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXjw/NGAjuLFklx/W0cDZTCiyM
Jj8LB2rB7Bc+4mDI6D+wcvmB+EaPmJ4VfJeDX602tnOs4ETQ0Zx856jv5cYdXE1d
37E1MrmZ2P7TCUPfmU9ZSKvHQ19zN7XCMckrLNf+9f7GVrpue6k1NR6liJNut2eA
qvizOQUitC3fsELB2wIDAQAB
-----END PUBLIC KEY-----`;

module.exports = {
    encrypt: (plainMessage) => {
        return crypto.publicEncrypt(PUBLIC_KEY, Buffer.from(plainMessage, 'utf8') ).toString('base64');
    },

    decrypt: (encryptedMessage) => {
        return crypto.privateDecrypt(PRIVATE_KEY, Buffer.from(encryptedMessage, 'base64'));
    }
}