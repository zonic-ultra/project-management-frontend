import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
  static BASE_URL = "http://localhost:8082/api";
  static ENCRYPTION_KEY = "my_secret_key_123";

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static encrypt(data) {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  static decrypt(data) {
    // try {
    const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
    // } catch (error) {
    //   console.warn("Decryption failed");
    //   return null;
    // }
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

  // static clearAuth() {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  // }

  //save token with encryption
  static saveToken(token) {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem("token", encryptedToken);
  }

  //retrieve token
  static getToken() {
    const encryptedToken = localStorage.getItem("token");

    if (!encryptedToken) return null;

    return this.decrypt(encryptedToken);
  }

  //save role
  static saveRole(role) {
    const encryptedRole = this.encrypt(role);
    localStorage.setItem("role", encryptedRole);
  }

  //retrieve role
  static getRole() {
    const encryptedRole = localStorage.getItem("role");

    if (!encryptedRole) return null;

    return this.decrypt(encryptedRole);
  }

  //
  // static clearAuth() {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  // }

  // static logout() {
  //   this.clearAuth();
  // }

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

  // static saveToken(token) {
  //   if (!token) return;
  //   const encrypted = this.encrypt(token);
  //   localStorage.setItem("token", encrypted);
  // }

  // static getToken() {
  //   const encrypted = localStorage.getItem("token");
  //   return encrypted ? this.decrypt(encrypted) : null;
  // }
  // static saveRole(role) {
  //   if (!role) return;
  //   const roleStr = String(role).toUpperCase().trim();
  //   const encrypted = this.encrypt(roleStr);
  //   localStorage.setItem("role", encrypted);
  //   console.log("Saved role to localStorage:", roleStr); // for debugging
  // }

  // static getRole() {
  //   const encrypted = localStorage.getItem("role");
  //   if (!encrypted) return null;
  //   const decrypted = this.decrypt(encrypted);
  //   return decrypted ? decrypted.toUpperCase() : null;
  // }

  // static isAdmin() {
  //   const role = this.getRole();
  //   return role === "ADMIN";
  // }
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

  // static isAuthenticated() {
  //   return !!this.getToken();
  // }

  /**  AUTH && USERS API */
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

  static async getLoggedInUsersInfo() {
    const response = await axios.get(`${this.BASE_URL}/users/current`, {
      headers: this.getHeader,
    });
    return response.data;
  }

  static async getMemberById(id) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get_member/${id}`,
      {
        headers: this.getHeader,
      },
    );
    return response.data;
  }

  static async updateMember(id, updateData) {
    const response = await axios.put(
      `${this.BASE_URL}/users/update_member/${id}`,
      updateData,
      {
        headers: this.getHeader,
      },
    );
    return response.data;
  }

  // static async deleteMember(id) {
  //   const response = await axios.delete(
  //     `${this.BASE_URL}/users/delete_member`,
  //     {
  //       headers: this.getHeader,
  //       params: { id: id },
  //     },
  //   );
  //   return response.data;
  // }

  static async deleteMember(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/users/delete_member`,
      {
        headers: this.getHeader(),
        params: { id: id },
      },
    );
    return response.data;
  }

  static async changePassword(id, passwordData) {
    const response = await axios.put(
      `${this.BASE_URL}/users/change_password/${id}`,
      passwordData,
      {
        headers: this.getHeader,
      },
    );
    return response.data;
  }

  static async getAllMembers() {
    const response = await axios.get(`${this.BASE_URL}/users/get_all_members`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getTotalMembers() {
    const response = await axios.get(`${this.BASE_URL}/users/total_members`);
    return response.data;
  }

  // !PROJECTS API

  static async getTotalProjects() {
    const response = await axios.get(
      `${this.BASE_URL}/projects/total_projects`,
    );
    return response.data;
  }

  static async getAllProjects() {
    const response = await axios.get(`${this.BASE_URL}/projects`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async createProject(projectData) {
    const response = await axios.post(
      `${this.BASE_URL}/projects/create`,
      projectData,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async updateProject(id, projectData) {
    const response = await axios.put(
      `${this.BASE_URL}/projects/update`,
      projectData,
      {
        headers: this.getHeader(),
        params: { id: id },
      },
    );
    return response.data;
  }

  static async deleteProject(id) {
    const response = await axios.delete(`${this.BASE_URL}/projects/delete`, {
      headers: this.getHeader(),
      params: { id: id },
    });
    return response.data;
  }

  static async getProjectById(id) {
    const response = await axios.get(`${this.BASE_URL}/projects/get_project`, {
      headers: this.getHeader(),
      params: { id: id },
    });
    return response.data;
  }

  //!TASKS API
  static async getAllTasks() {
    const response = await axios.get(`${this.BASE_URL}/tasks`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getTotalTasks() {
    const response = await axios.get(`${this.BASE_URL}/tasks/total_tasks`);
    return response.data;
  }

  /**AUTHENTICATION CHECKER */
  static clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static logout() {
    this.clearAuth();
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static isAdmin() {
    const role = this.getRole();
    return role === "ADMIN";
  }
}
