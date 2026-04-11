import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
  static BASE_URL = "http://localhost:8082/api";
  static ENCRYPTION_KEY = "my_secret_key_123";

  static encrypt(data) {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  static decrypt(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.warn("Decryption failed");
      return null;
    }
  }

  // static saveToken(token) {
  //   if (!token) return;
  //   const encrypted = this.encrypt(token);
  //   localStorage.setItem("token", encrypted);
  // }

  // static getToken() {
  //   const encryptedToken = localStorage.getItem("token");
  //   if (!encryptedToken) return null;
  //   return this.decrypt(encryptedToken);
  // }

  // static saveRole(role) {
  //   if (!role) return;
  //   const encrypted = this.encrypt(role);
  //   localStorage.setItem("role", encrypted);
  // }

  // static getRole() {
  //   const encryptedRole = localStorage.getItem("role");
  //   if (!encryptedRole) return null;
  //   return this.decrypt(encryptedRole);
  // }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  // static isAuthenticated() {
  //   return !!this.getToken();
  // }

  // static isAdmin() {
  //   const role = this.getRole();
  //   // Handle both string and enum cases
  //   const roleStr = typeof role === "string" ? role.toUpperCase() : role;
  //   return roleStr === "ADMIN" || roleStr === "ROLE_ADMIN";
  //   // return role === "ADMIN";
  // }
  static saveToken(token) {
    if (!token) return;
    const encrypted = this.encrypt(token);
    localStorage.setItem("token", encrypted);
  }

  static getToken() {
    const encrypted = localStorage.getItem("token");
    return encrypted ? this.decrypt(encrypted) : null;
  }
  static saveRole(role) {
    if (!role) return;
    const roleStr = String(role).toUpperCase().trim();
    const encrypted = this.encrypt(roleStr);
    localStorage.setItem("role", encrypted);
    console.log("Saved role to localStorage:", roleStr); // for debugging
  }

  static getRole() {
    const encrypted = localStorage.getItem("role");
    if (!encrypted) return null;
    const decrypted = this.decrypt(encrypted);
    return decrypted ? decrypted.toUpperCase() : null;
  }

  static isAdmin() {
    const role = this.getRole();
    return role === "ADMIN" || role === "ROLE_ADMIN";
  }
  // static saveRole(role) {
  //   if (!role) return;
  //   const roleStr =
  //     typeof role === "object" ? role.name || role.toString() : role;
  //   const encrypted = this.encrypt(roleStr.toUpperCase());
  //   localStorage.setItem("role", encrypted);
  // }

  // static getRole() {
  //   const encrypted = localStorage.getItem("role");
  //   if (!encrypted) return null;
  //   const decrypted = this.decrypt(encrypted);
  //   return decrypted ? decrypted.toUpperCase() : null;
  // }

  // static isAdmin() {
  //   const role = this.getRole();
  //   return role === "ADMIN" || role === "ROLE_ADMIN";
  // }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /** Auth APIs */
  static async registerUser(registerData) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registerData,
    );
    return response.data;
  }

  static async loginUser(loginData) {
    const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
    return response.data; // Keep as is
  }

  // ... rest of your methods
}
