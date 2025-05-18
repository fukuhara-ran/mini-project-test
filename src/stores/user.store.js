import { defineStore } from 'pinia';
import { axiosWrapper } from '@/helper/axios-wrapper.js';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        users: [],
        user: null,
    }),
    actions: {
        async fetch() {
            let url = `${baseUrl}/profile`

            const users = await axiosWrapper.get(url);

            if (users) {
                this.users = users.data
            }
        },
        async add(data) {
          const user = await axiosWrapper.post(`${baseUrl}/profile`, data, true);

          this.user = user.data

          return user
        },
        async update(id, data) {
          return await axiosWrapper.put(`${baseUrl}/profile/${id}`, data, true);
        },
        async delete(id) {
          return await axiosWrapper.delete(`${baseUrl}/profile/${id}`, {}, true);
        },
    },
});
