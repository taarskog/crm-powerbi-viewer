/**
 * Hashing based on djb2
 * @description Based on http://www.cse.yorku.ca/~oz/hash.html - not tested for quality as this is good enough for making data anonymous and still fairly unique.
 * @export
 * @param {string} data String to hash
 * @returns djb2 hash as hexadecimal string
 */
export default function hash(data: string): string {
    let hash = 5381;
    if (data == null) {
        throw new Error("Cannot hash null or undefined");
    }

    for (let i = 0; i < data.length; i++) {
        hash += (hash << 5) + data.charCodeAt(i);
    }

    return hash.toString(16);
}