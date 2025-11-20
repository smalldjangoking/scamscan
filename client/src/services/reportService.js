import $api from '../http/auth'


export default class reportService {
    static getReports({ user_id, params }) {
        const basePath = user_id ? `/reports/users/${user_id}` : "/reports/all";
        return $api.get(basePath, { params });
    }

    static createReport(payload) {
        return $api.post('/reports/create', payload)
    }
}

