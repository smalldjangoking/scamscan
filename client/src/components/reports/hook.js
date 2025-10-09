import { useQuery } from '@tanstack/react-query'

export function useReports({browse = {}, search = '', page = 1, pageSize = 10}) {
  let token = ''
  if (browse?.show == 'user' && browse?.token) {
    token = browse.token
  }

  return useQuery({
    queryKey: ['reports', { search, page, pageSize, browse }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      })

    if (search) params.append('search', search)
  

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