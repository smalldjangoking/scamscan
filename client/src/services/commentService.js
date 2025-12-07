import $api from '../http/auth'


export default class commentService {
    static createComment(reportId, comment, mainCommentId) {
        return $api.post(`/report/comments/${reportId}/create`, { comment, parent_comment_id: mainCommentId ?? undefined })
    }

    static getComments(reportId, pageParam) {
        return $api.get(`/report/comments/${Number(reportId)}/all`, {
            params: {
                'page': pageParam
            }
        })
    }

    static deleteComment(commentId) {
        return $api.delete(`/report/comments/delete/${commentId}`)
    }
}


