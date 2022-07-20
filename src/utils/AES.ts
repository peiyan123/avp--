import CryptoJS from 'crypto-js';
export default {
  //加密
  // [B@36f6e879 加密码，前后端要统一
  //    encrypt(word, keyStr) {
  //      keyStr = keyStr ? keyStr : '[B@36f6e879';
  //      var key = CryptoJS.enc.Utf8.parse(keyStr);
  //      var srcs = CryptoJS.enc.Utf8.parse(word);
  //      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
  //        mode: CryptoJS.mode.ECB,
  //        padding: CryptoJS.pad.Pkcs7
  //      });
  //      return encrypted.toString();
  //    },
  aesMinEncrypt(key, iv, word) {
    const _word = CryptoJS.enc.Utf8.parse(word),
      _key = CryptoJS.enc.Utf8.parse(key),
      _iv = CryptoJS.enc.Utf8.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(_word, _key, {
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
};
