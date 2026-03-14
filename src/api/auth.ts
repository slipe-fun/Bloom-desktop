import {ApiHelper} from "./ApiHelper.ts";
import {API_URL} from "../constants/api_url";

const api = new ApiHelper();

export const authApi = {
  processEmail: async (email: string) => {
    const exists = await api.request<{ exists: boolean }>(
      {
        method: "GET",
        url: `${API_URL}/user/exists`,
        params: {email},
      },
      async () => ({exists: false})
    );

    if (exists.exists) {
      await api.request(
        {
          method: "POST",
          url: `${API_URL}/auth/request-code`,
          data: {email},
        },
        async () => ({success: true})
      );
    } else {
      await api.request(
        {
          method: "POST",
          url: `${API_URL}/auth/register`,
          data: {email},
        },
        async () => ({success: true})
      );
    }

    return {success: true};
  },

  verifyCode: async (email: string, code: string) => {
    return await api.request(
        {
          method: "POST",
          url: `${API_URL}/auth/verify-code`,
          data: {email, code},
        },
        async () => ({success: true, session_id: 5, user: {id: 4, date: new Date(), username: "hello"}, token: "mock_token_123"})
      );
  },

  completeSignUp: async (email: string, nickname: string, password: string) => {
    return api.request(
      {},
      async () => ({success: true})
    );
  },
};
