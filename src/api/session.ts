
import { ApiHelper } from "./ApiHelper.ts";
import { API_URL } from "../constants/api_url";

const api = new ApiHelper();

export const sessionApi = {
    get: async (token: string): Promise<any> => {
        return await api.request(
            {
                method: "GET",
                url: `${API_URL}/session`,
                headers: {
                    "Authorization": "Bearer " + token
                }
            },
            async () => ({ ciphertext: "1", nonce: "2", salt: "3", user_id: 5 })
        );
    },
    uploadSessionKeys: async (token: string, keys: { ed_public_key: string; ecdh_public_key: string; kyber_public_key: string }): Promise<any> => {
        return await api.request(
            {
                method: "POST",
                url: `${API_URL}/session/add-keys`,
                data: {
                    identity_pub: keys.ed_public_key,
                    ecdh_pub: keys.ecdh_public_key,
                    kyber_pub: keys.kyber_public_key,
                },
                headers: {
                    "Authorization": "Bearer " + token,
                }
            },
            async () => ({ ciphertext: "1", nonce: "2", salt: "3", user_id: 4 })
        );
    },
};