import $api from '../http/auth'

export default class AuthService {
    static async login(email, password) {
        return $api.post('/auth/login', {email, password})
    }

    static async registration(email, password, password2, nickname) {
        return $api.post('/auth/create', {email, password, password2, nickname})
    }

    static async tokenConfirm(option, token) {
        return $api.patch(`/auth/${option}/verify/${token}`)
    }

    static async passwordTokenReq(email) {
        return $api.post('auth/password/token/create', {email})
    }
}