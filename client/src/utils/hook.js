import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query'
import reportService from "../services/reportService"
import UserService from "../services/userService.js";
import commentService from "../services/commentService.js"

export function useReports({ user_id, userOnly = false, page = 1, pageSize = 10, filterQuery = {}, debouncedSearch = '' }) {
    return useQuery({
        queryKey: ['reports', { debouncedSearch, page, pageSize, userOnly, filterQuery, user_id }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pageSize.toString(),
            })

            if (debouncedSearch) params.append('search', debouncedSearch)
            Object.entries(filterQuery).forEach(([key, value]) => {
                params.append(key, value)
            })

            const res = await reportService.getReports({
                user_id: userOnly ? user_id : null,
                params,
            });
            return res.data
        },
        keepPreviousData: true,
    })
}


export function useAddress({ value, subject }) {

    return useQuery({
        queryKey: ['addresses', { value, subject }],
        queryFn: async () => {
            const params = new URLSearchParams({
                value: value.toString(),
                subject: subject.toString(),
            })

            const res = await fetch(`/api/scan/address?${params}`)

            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)

            return res.json()
        },
        keepPreviousData: true,
    })
}

export function useComments({ report_id, page }) {

    return useQuery({
        queryKey: ['comments', { report_id, page }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: comment_page.toString(),
                report_id: report_id.toString(),
            })

            const res = await fetch(`/api/scan/address?${params}`)

            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)

            return res.json()
        },
        keepPreviousData: true,
    })
}


export function useAddrReports({ page = 1, pageSize = 10, address_id = '' }) {
    return useQuery({
        queryKey: ['reports', { page, pageSize, address_id }],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pageSize.toString(),
            })

            const res = await fetch(`/api/scan/${address_id}/reports?${params}`)
            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)
            return res.json()
        },
        keepPreviousData: true,
        enabled: !!address_id,
    })
}

export function useSingleReport(id) {
    return useQuery({
        queryKey: ['report', id],
        enabled: !!id,
        keepPreviousData: true,
        queryFn: async () => {
            const res = await fetch(`/api/reports/id/${id}`);

            if (!res.ok) {
                const text = await res.text();
                console.error("❌ useSingleReport bad response:", res.status, text);
                throw new Error(`Request failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log("✅ useSingleReport data:", data);
            return data;
        },
    });
}

export function useUserUpdate({ setUser, successToast, failedToast }) {
    return useMutation({
        mutationFn: async (userUpdateFields) => {
            const { data } = await UserService.updateUserInfo(userUpdateFields);
            return data;
        },

        onSuccess: (data, variables) => {
            successToast(data.message);

            setUser(prev => ({
                ...prev,
                ...variables,
            }));
        },

        onError: (error) => {
            const msg =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Something went wrong";

            failedToast(msg);
        }
    });
}

export function useUserPasswordChange({ setPwdDraft, setPasswordOpen, successToast, failedToast }) {
    return useMutation({
        mutationFn: async (password) => {
            const { data } = await UserService.changePassword(password);
            return data;
        },

        onSuccess: (data, variables) => {
            successToast(data.message);
            setPwdDraft({ old_password: "", new_password: "", confirm_password: "" });
            setPasswordOpen(false);
        },

        onError: (error) => {
            const msg =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Something went wrong";

            failedToast(msg);
        }
    });
}

export function useReportCreate() {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await reportService.createReport(payload);
            return data;
        }
    });
}



export function useCommentCreate({ setValue }) {
    return useMutation({
        mutationFn: async ({ reportId, comment, mainCommentId }) => {
            const { data } = await commentService.createComment(reportId, comment, mainCommentId);
            console.log(data)
            return data;
        },
        onSuccess: () => {
            setValue("comment", "");
        }
    });
}


export function useInfinityComments(reportId) {
    return useInfiniteQuery({
        queryKey: ["report_comments", reportId],
        queryFn: async ({ pageParam = 1 }) => {
            const {data} = await commentService.getComments(reportId, pageParam);
            return data
        },
        getNextPageParam: (lastPage, pages) => {
            const currentPage = pages.length;
            const totalPages = lastPage.total_pages;

            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: !!reportId
    })
}


