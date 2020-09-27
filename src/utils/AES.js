import CryptoJS from 'crypto-js';

export default {
    //随机生成指定数量的16进制key
    generatekey(num) {
        let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let key = "";
        for (var i = 0; i < num; i++) {
            let randomPoz = Math.floor(Math.random() * library.length);
            key += library.substring(randomPoz, randomPoz + 1);
        }
        return key;
    },

    //加密
    encrypt(word) {
        let key = CryptoJS.enc.Utf8.parse("5qDVqrIFASQ7NZSc");
        let iv = CryptoJS.enc.Utf8.parse("6666184153728923");
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv });
        return encrypted.ciphertext.toString().toUpperCase();
    },
    //解密
    decrypt(word) {
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
    }

}