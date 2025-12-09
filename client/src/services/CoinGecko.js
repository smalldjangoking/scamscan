import { $api_no_auth } from "../http/auth"


export default class CoinGecko {
    static async cryptoList(page, filterQuery, perPage) {

        if (filterQuery) {
            return $api_no_auth.get("https://api.coingecko.com/api/v3/search", {
                params: {
                    query: filterQuery,
                },
            });
        }

        return $api_no_auth.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: perPage,
                page: page,
            },
        });
    }
}
