import {makeAutoObservable} from "mobx"
import AuthService from '../services/authService'

export default class Store {
    isLoading = false
    errorText = ''

    constructor() {
        makeAutoObservable(this);
    }

    setIsLoading(bool) {
        this.isLoading = bool
    }
    setErrorText(str) {
        this.errorText = str
    }

    async login(email, password) {
        this.setIsLoading(true);
        this.setErrorText('');
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('access_token', response.data.access_token)
        } catch (e) {
            this.setErrorText(e.response?.data?.detail)
            console.log(e.response?.data?.detail);
        } finally {
            this.setIsLoading(false)
        }
    };

    async registration(email, password, password2, nickname) {
        this.setIsLoading(true);
        this.setErrorText('');
        try {
            const response = await AuthService.registration(email, password, password2, nickname);
            return true
        } catch (e) {
            this.setErrorText(e.response?.data?.detail)
            console.log(e.response?.data?.detail);
            return false
        } finally {
            this.setIsLoading(false)
        }
    };

    async confirm(option, token) {
        this.setIsLoading(true)
        this.errorText = ''
        try {
            await AuthService.confirm(option, token)
            return true
        } catch (e) {
            this.setErrorText(e.response?.data?.detail)
            return false
    } finally {
        this.setIsLoading(false)
    }}
}