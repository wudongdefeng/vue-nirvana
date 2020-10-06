import CryptoJS from 'crypto-js';

export default {
    // 南瓜加密
    nanguaencrypt(word) {
        let key = CryptoJS.enc.Utf8.parse("5qDVqrIFASQ7NZSc");
        let iv = CryptoJS.enc.Utf8.parse("6666184153728923");
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv });
        return encrypted.ciphertext.toString().toUpperCase();
    },
    // 南瓜解密
    nanguadecrypt(word) {
        let key = CryptoJS.enc.Utf8.parse("5qDVqrIFASQ7NZSc");
        let iv = CryptoJS.enc.Utf8.parse("6666184153728923");
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    },
    // 卡布奇洛加密
    capucciloEncrypt(word) {
        let key = CryptoJS.enc.Utf8.parse("1234567898882222");
        let iv = CryptoJS.enc.Utf8.parse("8NONwyJtHesysWpM");
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv });
        return encrypted.ciphertext.toString().toUpperCase();
    },
    // 卡布奇洛解密
    capucciloDecrypt(word) {
        let key = CryptoJS.enc.Utf8.parse("1234567898882222");
        let iv = CryptoJS.enc.Utf8.parse("8NONwyJtHesysWpM");
        let decrypt = CryptoJS.AES.decrypt(word, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return decrypt.toString(CryptoJS.enc.Utf8);
    }
}