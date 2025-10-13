import {useQuery} from '@tanstack/react-query'

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


            const res = await fetch(`api/reports/all?${params}`, {
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

export function useScan({}) {
    return useQuery({
        queryKey: ['scan'],
        queryFn: async () => {
            const params = new URLSearchParams({

            })
            const res = await fetch(`api/scan/all?${params}`, {
            })
            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)
            return res.json()
        }
    })
}