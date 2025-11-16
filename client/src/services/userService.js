import $api from '../http/auth'


export default class UserService {
    static async me() {
        return $api.post('/user/me', {})
    }

    static async changePassword(password) {
        return $api.post('user/update/password', {'new_password': password})
    }

    static async updateUserInfo(data) {
        return $api.patch('/update/info', {...data})
    }
}