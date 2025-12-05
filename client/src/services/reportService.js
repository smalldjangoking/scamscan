import $api from '../http/auth'


export default class reportService {
    static getReports({ user_id, params }) {
        if (user_id) {
            return $api.get(`/reports/users/${user_id}`, { params });
        }
        return $api.get("/reports/all", { params });
    }

    static createReport(payload) {
        return $api.post('/reports/create', payload)
    }

    static deleteReport(reportId) {
        return $api.delete(`/reports/delete/${reportId}`)
    }
}

