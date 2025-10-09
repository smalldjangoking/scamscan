import { useQuery } from '@tanstack/react-query'

export function useReports({ search = '', page = 1, pageSize = 10, browse = 'browse' }) {
  return useQuery({
    queryKey: ['reports', { search, page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

    if (search) params.append('search', search)
    if (browse !== 'browse') {
      const token = localStorage.getItem('access_token')
    }


      const res = await fetch(`api/reports/all?${params}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)
      return res.json()
    },
    keepPreviousData: true,
  })
}