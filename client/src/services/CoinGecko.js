import axios from "axios";


export default class CoinGecko {
    static async cryptoList(page, filterQuery, perPage) {

        if (filterQuery) {
            return axios.get("https://api.coingecko.com/api/v3/search", {
                params: {
                    query: filterQuery,
                },
            });
        }

        return axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: perPage,
                page: page,
            },
        });
    }
}
