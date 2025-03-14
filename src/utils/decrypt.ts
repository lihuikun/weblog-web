import * as CryptoJS from 'crypto-js';

// 从环境变量中获取密钥，或者使用默认值
const secretKey = import.meta.env.VITE_CRYPTO_KEY;

/**
 * 扩展密钥到 32 字节
 * @param key - 原始密钥
 * @returns 扩展后的密钥
 */
function expandKey(key: string): string {
  if (key.length >= 32) {
    return key.substring(0, 32);
  }
  return key.padEnd(32, ' '); // 用空格填充到 32 字节
}

/**
 * 解密数据
 * @param encryptedData - 后端加密后的数据（Base64 编码）
 * @returns 解密后的数据
 */
export function decryptData(encryptedData: string): any {
  try {
    // 解析加密数据
    const [ivBase64, encrypted] = encryptedData.split(':');
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(secretKey).toString());

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('解密失败:', error);
    throw new Error('解密失败');
  }
}