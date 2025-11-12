import { makeAutoObservable } from "mobx";
import AuthService from "../services/authService";

export default class Store {
  isLoading = false;
  errors = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(val) {
    this.isLoading = val;
  }

  addError(msg) 
    if (!msg) return;
    this.errors.add(String(msg))}

  errorValid(e) {
    const res = e?.response;
    const detail = res?.data?.detail;

    if (Array.isArray(detail)) {
      detail.forEach(item => this.addError(item?.msg || item?.message || JSON.stringify(item)));
    } else if (typeof detail === "string") {
      this.addError(detail);
    } else if (detail && typeof detail === "object") {
      this.addError(detail?.msg || detail?.message || JSON.stringify(detail));
    } else if (res) {
      this.addError(`HTTP ${res.status} ${res.statusText ?? ""}`.trim());
    } else {
      this.addError("Network error");
    }
  }

  async login(email, password) {
    this.setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("access_token", response.data.access_token);
    } catch (e) {

      } else {
        this.errors.add(e.response.data.detail)
      }
    } finally {
      this.setIsLoading(false);
    }
  }

  async registration(email, password, password2, nickname) {
    this.setIsLoading(true);
    try {
      const response = await AuthService.registration(
        email,
        password,
        password2,
        nickname
      );
      return true;
    } catch (e) {
      this.setErrorText(e.response?.data?.detail || "Invalid or expired token");
      return false;
    } finally {
      this.setIsLoading(false);
    }
  }

  async passwordTokenReq(email) {
    this.setIsLoading(true);
    try {
      const res = await AuthService.passwordTokenReq(email);

      if (res.data.status === "ok") {
        this.setVerifyText("Reset link sent!");
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      set.setIsLoading(false);
    }
  }

  async tokenCheck(option, token) {
    this.setIsLoading(true);
    try {
      await AuthService.tokenConfirm(option, token);
    } catch (e) {
    } finally {
      this.setIsLoading(false);
    }
  }
}
