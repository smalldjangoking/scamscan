import {useQuery, useMutation } from '@tanstack/react-query'

export function useReports({browse = {}, page = 1, pageSize = 10, filterQuery = {}, debouncedSearch = '', address_id = ''}) {
    let token = ''
    if (browse?.show == 'user' && browse?.token) {
        token = browse.token
    }

    return useQuery({
        queryKey: ['reports', {debouncedSearch, page, pageSize, browse, filterQuery, address_id}],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pageSize.toString(),
            })

            if (debouncedSearch) params.append('search', debouncedSearch)
            if (address_id) params.append('address_id', address_id)
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


export function useAddress({value, subject, page = 1, pageSize = 10}) {

    return useQuery({
        queryKey: ['addresses', {value, subject, page, pageSize}],
        queryFn: async () => {
            const params = new URLSearchParams({
                value: value.toString(),
                subject: subject.toString(),
                page: page.toString(),
                page_size: pageSize.toString(),
            })

            const res = await fetch(`/api/scan/address?${params}`)

            if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`)

            return res.json()
        },
        keepPreviousData: true,
    })
}


export function useLogin({ onSuccess, onError } = {}) {

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!res.ok) {
          const error = new Error("Login failed");
          error.status = res.status; // 👈 добавляем статус!
          throw error;
      }


      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      return data;
    },
    onSuccess,
    onError,
  });
}


export function useRegister({ onSuccess, onError } = {}) {
    return useMutation({
        mutationFn: async ({ emailInput, passwordInput, password2Input, nicknameInput}) => {
            const res = await fetch("/api/auth/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailInput,
                    password: passwordInput,
                    password_confirmation: password2Input,
                    nickname: nicknameInput }),
            });

            if (!res.ok) {
                let message = '';
                try {
                    const data = await res.json();
                    message = data.detail || data.message || message;
                } catch {}

                if (message.length > 0) {
                    message = 'Server is unable to register. Try again later.';
                }
                const error = new Error(message);
                error.status = res.status;
                throw error;
            }

            const data = await res.json();
            return data;
        },
        onSuccess,
        onError,
    });
}

