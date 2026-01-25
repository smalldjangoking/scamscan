import { makeAutoObservable, reaction } from "mobx";
import AuthService from "../services/authService";
import { jwtDecode } from "jwt-decode";

export default class Store {
  isLoading = false;
  errors = new Set();
  successAlerts = ''
  accessToken = localStorage.getItem("access_token") || null;
  newMemberAlert = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.accessToken,
      (token) => {
        if (token) {
          localStorage.setItem("access_token", token);
        } else {
          localStorage.removeItem("access_token");
        }
      }
    );

    window.addEventListener("storage", (event) => {
      if (event.key === "access_token" && event.newValue !== this.accessToken) {
        this.accessToken = event.newValue;
      }
    });

    setInterval(() => {
      if (!this.accessToken) return null;
      const lsToken = localStorage.getItem("access_token");

      if (!lsToken) {
        this.logout();
      }
      if (lsToken !== this.accessToken) {
        this.logout();
      }
    }, 2000);
  }

  get userId() {
    if (!this.accessToken) return null;

    try {
      const payload = jwtDecode(this.accessToken);
      return Number(payload?.sub) ?? null;
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
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

  setNewMemberAlert(bool) {
    this.newMemberAlert = bool || !this.newMemberAlert
  }

  clearErorrs() {
    this.errors.clear();
  }

  errorValid(e) {
    this.clearErorrs();
    const res = e?.response;
    const detail = res?.data?.detail?.msg;
    const selfDetail = res?.data?.detail;
    const reason = res?.data?.detail?.[0].ctx?.reason;
    const pydanticErrorMsg = res?.data?.detail?.[0]?.msg?.split(',')[1];

    if (reason) {
      this.addError(reason);
    } else if (detail) {
      this.addError(detail);
    }
    else if (selfDetail && typeof selfDetail === "string") {
      this.addError(selfDetail);
    }
    else if (pydanticErrorMsg) {
      this.addError(pydanticErrorMsg);
    }
  }

  async login(email, password, rememberMe) {
    this.setIsLoading(true);
    this.clearErorrs();
    try {
      const res = await AuthService.login(email, password, rememberMe);
      this.setAccessToken(res.data.access_token)
    } catch (e) {
      this.errorValid(e)
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
      this.setNewMemberAlert();
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
}
