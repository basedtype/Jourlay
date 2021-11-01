import crypto = require('crypto')

export function sha256 (base?: string): string {
    const shasum = crypto.createHash('sha256')
    shasum.update(base || Math.random().toString(32));
    return shasum.digest('hex')
}