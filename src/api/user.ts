
import { ApiHelper } from "./ApiHelper.ts";
import { API_URL } from "../constants/api_url";

const api = new ApiHelper();

export const userApi = {
    editUsername: async (token: string, username: string): Promise<any> => {
        return await api.request(
            {
                method: "POST",
                url: `${API_URL}/user/edit`,
                data: { username },
                headers: {
                    "Authorization": "Bearer " + token,
                }
            },
            async () => ({ id: 4, date: new Date(), username: "hello" })
        );
    }
};