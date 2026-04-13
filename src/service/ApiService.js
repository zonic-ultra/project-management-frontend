import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
  static BASE_URL = process.env.REACT_APP_API_BASE_URL;
  static ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

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
    const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

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

  static async getMemberById(id) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get_member/${id}`,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async getLoggedInUsersInfo() {
    const response = await axios.get(`${this.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateProfile(id, updateData) {
    const response = await axios.put(
      `${this.BASE_URL}/users/update_member`,
      updateData,
      {
        headers: this.getHeader(),
        params: { id: id },
      },
    );
    return response.data;
  }

  static async changePassword(id, passwordData) {
    const response = await axios.patch(
      `${this.BASE_URL}/users/change_password`,
      passwordData,
      {
        headers: this.getHeader(),
        params: { id: id },
      },
    );
    return response.data;
  }

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

  static async addTask(taskData) {
    const response = await axios.post(
      `${this.BASE_URL}/tasks/create`,
      taskData,
      {
        headers: this.getHeader(),
      },
    );
    return response.data;
  }

  static async updateTask(id, taskData) {
    const response = await axios.put(
      `${this.BASE_URL}/tasks/update`,
      taskData,
      {
        headers: this.getHeader(),
        params: { id: id },
      },
    );
    return response.data;
  }

  static async getTaskById(id) {
    const response = await axios.get(`${this.BASE_URL}/tasks/find_by_id`, {
      headers: this.getHeader(),
      params: { id: id },
    });
    return response.data;
  }

  static async deleteTask(id) {
    const response = await axios.delete(`${this.BASE_URL}/tasks/delete`, {
      headers: this.getHeader(),
      params: { id: id },
    });
    return response.data;
  }

  static async updateTaskStatus(id, status, remarks = "") {
    const response = await axios.patch(
      `${this.BASE_URL}/tasks/update_status`,
      {
        newStatus: status,
        remarks: remarks,
      },
      {
        headers: this.getHeader(),
        params: { id },
      },
    );

    return response.data;
  }

  /**CHANGELOG API */
  static async getAllChangeLogs() {
    const response = await axios.get(`${this.BASE_URL}/change_logs`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteChangeLog(id) {
    const response = await axios.delete(`${this.BASE_URL}/change_logs/delete`, {
      headers: this.getHeader(),
      params: { id },
    });
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
