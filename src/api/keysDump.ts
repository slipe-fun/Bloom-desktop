import {ApiHelper} from "./ApiHelper.ts";
import {API_URL} from "../constants/api_url";

const api = new ApiHelper();

export const keysDumpApi = {
  get: async (token: string) => {
    return await api.request(
        {
          method: "GET",
          url: `${API_URL}/chats/keys/private`,
          headers: {
            "Authorization": "Bearer " + token
          }
        },
        async () => ({ciphertext:"1", nonce:"2", salt:"3", user_id:5})
      );
  },
};
