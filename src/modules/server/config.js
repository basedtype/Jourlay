/* PARAMS */
const test = true;
const IP = '192.168.0.106';
const PORT = 80;
const TEST_IP = '192.168.0.103';
const TEST_PORT = 80

/* EXPORTS */
if (test === false) {
    exports.ip = TEST_IP;
    exports.port = TEST_PORT;
} else {
    exports.ip = IP;
    exports.port = PORT;
}