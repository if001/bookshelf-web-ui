import Axios from 'axios';
import store from '@/store';

const axios = Axios.create({
    baseURL: '//localhost:8081',
    //baseURL: process.env.VUE_APP_API_URL_BASE,
});

function getToken() {
    // return store.state.token;
    return 'hogehoge';
}

export default {
    accounts: {
        login(email: string, password: string) {
            return axios({
                method: 'POST',
                url: '/accounts/login',
                data: {
                    email,
                    password,
                },
            });
        },

        logout() {
            return axios({
                method: 'POST',
                url: '/accounts/logout',
                data: {},
                params: {
                    token: getToken(),
                },
            });
        },
        own() {
            return axios({
                method: 'GET',
                url: '/accounts/own',
                params: {
                    token: getToken(),
                },
            });
        },
    },

    book: {
        list() {
            return axios.request<MultiContentResult<Book>>({
                method: 'GET',
                url: '/books',
                params: {
                    token: getToken(),
                },
            });
        },
        create(data: any) {
            return axios({
                method: 'POST',
                url: '/books',
                params: {
                    token: getToken(),
                },
                data,
            });
        },
    },
    books: {
        get(id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'GET',
                url: `/book/${id}`,
                params: {
                    token: getToken(),
                },
            });
        },
        update(id: number, data: any) {
            return axios({
                method: 'PUT',
                url: `/book/${id}`,
                params: {
                    token: getToken(),
                },
                data,
            });
        },
        logicalDelete(id: number) {
            return axios({
                method: 'DELETE',
                url: `/book/${id}`,
                params: {
                    token: getToken(),
                },
            });
        },
    },
};


export interface ContentResult<T> {
    status: number;
    // message: string;
    content: T;
}

export interface MultiContentResult<T> {
    status: number;
    // message: string;
    content: T[];
    // totalCount: number;
}

export interface Book {
    id: number;
    name: string;
    author: Author | null;
    publishedAt: string | null;
    publisher: string | null;
    accountId: number | null;
    startAt: string | null;
    endAt: string | null;
    nextBookId: number | null;
    prevBookId: number | null;
    descriptions: Description[];
    categories: Category[];
    createdAt: string;
    updatedAt: string;
}

export interface Description {
    id: number;
    content: string;
}
export interface Category {
    id: number;
    name: string;
}

export interface Author {
    id: number;
    name: string;
}
