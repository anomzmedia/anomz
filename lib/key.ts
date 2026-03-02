import { ApiResponse } from "@/types/api";
import { User } from "@/types/types";
import { getToken } from "./auth";
import { useAuth } from "@/store/auth";

export const fetchUserPublicKey = async(username:string) => {
    let res = await fetch(`/api/user/${username}/public-key`);
    let json:ApiResponse<string> = await res.json();

    return json.data;
};

export const fetchUser = async(username:string) => {
    let res = await fetch(`/api/user/${username}`);
    let json:ApiResponse<User> = await res.json();

    return json.data;
};

// ==================== KEY PAIR ====================

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
        publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
        privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
}

// ==================== RSA ====================

export async function encryptWithRSA(data: ArrayBuffer | Uint8Array, recipientPublicKeyBase64: string): Promise<string> {
    const publicKeyBuffer = Uint8Array.from(atob(recipientPublicKeyBase64), c => c.charCodeAt(0));

    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
    );

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        data instanceof Uint8Array ? data : new Uint8Array(data)
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptWithRSA(encryptedBase64: string, privateKeyBase64: string): Promise<CryptoKey> {
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));

    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
    );

    return window.crypto.subtle.importKey(
        "raw",
        decrypted,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    );
}

// ==================== AES ====================

export async function encryptWithAES(plainText: string, aesKey: CryptoKey): Promise<{ content: string; iv: string }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        new TextEncoder().encode(plainText)
    );

    return {
        content: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv)),
    };
}

export async function decryptWithAES(encryptedBase64: string, ivBase64: string, aesKey: CryptoKey): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0)) },
        aesKey,
        Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
    );

    return new TextDecoder().decode(decrypted);
};

export const getConversationAES = async(conversationId:string,privateKey:string,userId:string) => {
    const token = getToken();

    let res = await fetch(`/api/conversation/${conversationId}/keys`,{
        headers:{
            Authorization:token,
        }
    });

    let json:ApiResponse<any[]> = await res.json();

    if(!json.data) return;

    let myConversationAesKey = json.data.find((e) => e.userId == userId).encryptedAesKey;
        
    const aesKey = await decryptWithRSA(myConversationAesKey, privateKey);
    return aesKey;
};

// ==================== VERIFY ====================

export async function verifyKeyPair(publicKeyBase64: string, privateKeyBase64: string): Promise<boolean> {
    try {
        const testData = new TextEncoder().encode("verify");

        const encrypted = await encryptWithRSA(testData, publicKeyBase64);

        const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["decrypt"]
        );

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
        );

        return new TextDecoder().decode(decrypted) === "verify";
    } catch {
        return false;
    }
}

// ==================== PASSWORD DERIVED KEY ====================

export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 310000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encryptPrivateKey(privateKeyBase64: string, password: string): Promise<{ encryptedPrivateKey: string; salt: string; iv: string }> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveKeyFromPassword(password, salt);

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0))
    );

    return {
        encryptedPrivateKey: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        salt: btoa(String.fromCharCode(...salt)),
        iv: btoa(String.fromCharCode(...iv)),
    };
}

export async function decryptPrivateKey(encryptedPrivateKeyBase64: string, saltBase64: string, ivBase64: string, password: string): Promise<string> {
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const aesKey = await deriveKeyFromPassword(password, salt);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        Uint8Array.from(atob(encryptedPrivateKeyBase64), c => c.charCodeAt(0))
    );

    return btoa(String.fromCharCode(...new Uint8Array(decrypted)));
}

export async function generateConversationKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function exportConversationKey(aesKey: CryptoKey): Promise<ArrayBuffer> {
    return window.crypto.subtle.exportKey("raw", aesKey);
}

export async function generateKeyFingerprint(publicKeyBase64: string): Promise<string> {
    const buffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0").toUpperCase())
        .join("")
        .match(/.{4}/g)!
        .join(" ");
}


export async function generateConversationFingerprint(
    members: { id: string; publicKey: string }[]
): Promise<string> {
    const sorted = [...members].sort((a, b) => a.id.localeCompare(b.id));

    const combined = sorted.map(m => m.publicKey).join("");

    const buffer = await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(combined)
    );

    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0").toUpperCase())
        .join("")
        .match(/.{4}/g)!
        .join(" ");
}

export async function getConversationMembersPublicKey(conversationId:string) {
    const token = getToken();
    
    let res = await fetch(`/api/conversation/${conversationId}/public-keys`,{
        headers:{
            Authorization:token,
        }
    });

    let json:ApiResponse<any[]> = await res.json();

    return json.data;
}