import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

//function to generate a SHA-256 hash of the key
function generateSHA256Hash(secreteKey: string): Buffer{
    return crypto.createHash("sha256").update(secreteKey).digest();
}

/**
 * @description this function is generating decrypted password
 * @returns decrypted password
 */
export function decrypt(
    encryptedPassword: string,
    secreteKey: string,
    ivHex: string
): string {
    try {
        const hashedKey = generateSHA256Hash(secreteKey);
        const iv = Buffer.from(ivHex, "hex");
        if(Buffer.byteLength(encryptedPassword, "hex") % 16 !==0) {
            throw new Error("Encrypted data length is not valid for AES block size");
        }
        const decipher = crypto.createDecipheriv("aes-256-cbc", hashedKey, iv);
        let decrypted = decipher.update(encryptedPassword, "hex", "utf-8");
        decrypted += decipher.final("utf-8");
        console.log("decrypting password");
        return decrypted;
    } catch (error) {
        console.error("error decrypting password", error);
        return "";
    }
}
// Generate a 32-byte secret key in a hex format
function generateSecretKey(): string {
    return crypto.randomBytes(32).toString("hex");
}

// Generate a random IV in hex format
function generateIv(): string {
    return crypto.randomBytes(16).toString("hex");
}

// Example usage
/* let secretKey = generateSecretKey();
const ivHex = generateIv();
console.log("Generated SecretKey:", secretKey);
console.log("Generated IV:", ivHex); */

export function encryptPassword(password: string, secretKey: string, ivHex: string): string {
    try {
        // Hash the secret key to produce a 256-bit AES key
        const hashedKey = generateSHA256Hash(secretKey);

        // Convert IV from hex
        const iv = Buffer.from(ivHex, "hex");

        // Create the cipher instance
        const cipher = crypto.createCipheriv("aes-256-cbc", hashedKey, iv);

        // Encrypt the password
        let encrypted = cipher.update(password, "utf8", "hex");
        encrypted += cipher.final("hex");

        return encrypted;
    } catch (error) {
        console.error("Error encrypting password:", error.message);
        throw error;
    }
}