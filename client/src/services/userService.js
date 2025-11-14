import $api from '../http/auth'


export default class userService {
    static async me() {
        return $api.post('/user/me', {})
    }
}