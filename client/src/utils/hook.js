import {useQuery, useMutation } from '@tanstack/react-query'

export function useReports({browse = {}, page = 1, pageSize = 10, filterQuery = {}, debouncedSearch = ''}) {
    let token = ''
    if (browse?.show == 'user' && browse?.token) {
        token = browse.token
    }

    return useQuery({
        queryKey: ['reports', {debouncedSearch, page, pageSize, browse, filterQuery}],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pageSize.toString(),
            })

            if (debouncedSearch) params.append('search', debouncedSearch)
            Object.entries(filterQuery).forEach(([key, value]) => {
                params.append(key, value)
            })


            const res = await fetch(`/api/reports/all?${params}`, {
                headers: {
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
                }
            })
            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)
            return res.json()
        },
        keepPreviousData: true,
    })
}


export function useAddress({value, subject}) {

    return useQuery({
        queryKey: ['addresses', {value, subject}],
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

export function useComments({report_id, comment_page}) {

    return useQuery({
        queryKey: ['comments', {report_id, comment_page}],
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


export function useAddrReports({page = 1, pageSize = 10, address_id = ''}) {
    return useQuery({
        queryKey: ['reports', {page, pageSize, address_id}],
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
        queryFn: async () => {
            const res = await fetch(`/api/reports/id/${id}`)
            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)
            return res.json()
        },
        keepPreviousData: true,
        enabled: !!id,
    })
}

