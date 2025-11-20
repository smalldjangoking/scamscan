import { makeAutoObservable } from "mobx";
import AuthService from "../services/authService";
import UserService from "../services/userService";

export default class Store {
  isLoading = false;
  errors = new Set();
  successAlerts = ''
  accessToken = localStorage.getItem("access_token") || null;

  constructor() {
    makeAutoObservable(this);

    window.addEventListener("storage", (event) => {
      if (event.key === "access_token") {
        this.accessToken = event.newValue;
      }
    });
  }

  setAccessToken(token) {
    localStorage.setItem("access_token", token);
    this.accessToken = token;
  }

  removeAccessToken() {
    localStorage.removeItem("access_token");
    this.accessToken = null;
  }

  setIsLoading(val) {
    this.isLoading = val;
  }

  addError(msg) {
    this.errors.add(String(msg));
  }

  setSuccessAlerts(msg) {
    this.successAlerts = msg
  }

  clearErorrs() {
    this.errors.clear();
  }

  errorValid(e) {
    this.clearErorrs();
    const res = e?.response;
    const detail = res?.data?.detail;

    if (Array.isArray(detail)) {
      detail.forEach(item => this.addError(item?.loc[1] + ': ' + item?.msg || item?.message || JSON.stringify(item)));
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
    this.clearErorrs();
    try {
      const res = await AuthService.login(email, password);
      this.setAccessToken(res.data.access_token)
    } catch (e) {
      if (e?.response?.status === 403) {
        this.setSuccessAlerts(e?.response?.detail)
      } else {
        this.errorValid(e)
      }
    } finally {
      this.setIsLoading(false);
    }
  }

  async registration(email, password, password2, nickname) {
    this.setIsLoading(true);
    try {
      await AuthService.registration(
        email,
        password,
        password2,
        nickname
      );

      return true;
    } catch (e) {
      this.errorValid(e)
    } finally {
      this.setIsLoading(false);
    }
  }

  async passwordTokenReq(email) {
    this.setIsLoading(true);
    try {
      const res = await AuthService.passwordTokenReq(email);

      if (res.data.status === "ok") {
        this.setSuccessAlerts("Reset link sent!");
      }
    } catch (e) {
      this.errorValid(e)
    } finally {
      this.setIsLoading(false);
    }
  }

  async logout() {
    try {
      const res = await AuthService.logout();

      if (res.status === 200) {
        this.removeAccessToken();
      }
    } catch (e) {
      this.errorValid(e)
    }
  }

  async me() {
    this.setIsLoading(true)
    try {
      return await UserService.me();
    }
    catch (e) {
      this.errorValid(e)
      console.log(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  async tokenCheck(option, token) {
    this.setIsLoading(true);
    try {
      const res = await AuthService.tokenConfirm(option, token);
      console.log(res)

      if (option === 'email') {
        if (res.status === 200) {
          this.setSuccessAlerts(res.data.detail)
        }
      }

    } catch (e) {
      this.errorValid(e)
    } finally {
      this.setIsLoading(false);
    }
  }
}
