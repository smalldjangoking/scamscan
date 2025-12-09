import $api from '../http/auth'

export default class AddressService {
    static async createLikesDislikes(addressId, value) {
        return $api.post(`/scan/${addressId}/vote`, { value })
    }
    static async getLikesDislikes(addressId) {
        return $api.get(`/scan/${addressId}/votes`)
    }
}
