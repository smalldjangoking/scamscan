import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import reportService from "../services/reportService"
import UserService from "../services/userService";
import commentService from "../services/commentService"
import CoinGecko from "../services/CoinGecko"
import AddressService from "../services/addressService"
import AuthService from "../services/authService"
import axios from "axios"


export function useReports({ user_id, userOnly = false, page = 1, pageSize = 10, filterQuery = {}, debouncedSearch = '' }) {
    console.log(user_id, userOnly)
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
            const { data } = await axios.get("/api/scan/address", {
                params: {
                    value: value.toString(),
                    subject: subject.toString()
                }
            })
            return data
        },
        keepPreviousData: true,
        enabled: !!value && !!subject,
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
            const { data } = await axios.get(`/api/scan/${address_id}/reports`, {
                params: {
                    page: page.toString(),
                    page_size: pageSize.toString(),
                }
            })
            return data
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
                throw new Error(`Request failed with status ${res.status}`);
            }

            const data = await res.json();
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reportId, comment, mainCommentId }) => {
            const { data } = await commentService.createComment(
                reportId,
                comment,
                mainCommentId
            );
            return data
        },

        onSuccess: (newComment, { reportId, mainCommentId }) => {
            setValue("comment", "");

            queryClient.invalidateQueries({
                queryKey: ["report_comments", reportId],
            });

        },
    });
}


export function useInfinityComments(reportId) {
    return useInfiniteQuery({
        queryKey: ["report_comments", reportId],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await commentService.getComments(reportId, pageParam);
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


export function useInfinityCryptoList({ queryWord = '', enabled = false }) {
    const perPage = 100


    return useInfiniteQuery({
        queryKey: ["InfinityCryptoList"],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await CoinGecko.cryptoList(pageParam, queryWord, perPage)
            if (Array.isArray(data)) {
                return data;
            }

            if (data && Array.isArray(data.coins)) {
                return data.coins;
            }

            return [];
        },
        enabled,
        getNextPageParam: (lastPage, allPages) => {

            if (queryWord) {
                return undefined;
            }
            if (!Array.isArray(lastPage)) {
                return undefined;
            }
            if (lastPage.length < perPage) {
                return undefined;
            }
            return allPages.length + 1;
        },
    })
}


export function useTokenCheck() {
    return useMutation({
        mutationFn: async ({ option, token }) => {
            const res = await AuthService.tokenConfirm(option, token)
            return res
        },
    })
}


export function useChangePassword() {
    return useMutation({
        mutationFn: async ({ token, password }) => {
            const res = await AuthService.changePassword(token, password);
            return res;
        },
    });
}

export function deleteReport({ successToast, failedToast }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reportId }) => {
            const res = await reportService.deleteReport(reportId)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["reports"],
            });

            if (successToast) {
                successToast('Report Was Deleted!')
            }

        },
        onError: () => {
            failedToast('An error! Report Was not deleted!')
        }
    })
}

export function deleteAccount({ failedToast }) {
    return useMutation({
        mutationFn: async () => {
            const res = await UserService.deleteUser()
            return res
        },
        onError: () => {
            failedToast("An Error! Account wasn't deleted!")
        }
    })
}


export function likeDislikeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ addressId, value }) => {
            const res = await AddressService.createLikesDislikes(addressId, value)
            return res
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['address', 'likeDislike', variables.addressId],
            });
        }
    })
}

export function useLikeDislike(addressId) {
    return useQuery({
        queryKey: ['address', 'likeDislike', addressId],
        enabled: !!addressId,
        keepPreviousData: true,
        queryFn: async () => {
            const { data } = await AddressService.getLikesDislikes(addressId)
            return data
        },
    });
}
