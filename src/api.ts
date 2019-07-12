import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.VUE_APP_API_URL_BASE,
});

function getToken(): string {
    const token = localStorage.getItem('token');
    if (token !== null) {
        return token;
    } else {
        return '';
    }

}

export default {
    // accounts: {
    //     login(email: string, password: string) {
    //         return axios({
    //             method: 'POST',
    //             url: '/accounts/login',
    //             data: {
    //                 email,
    //                 password,
    //             },
    //         });
    //     },
    //
    //     logout() {
    //         return axios({
    //             method: 'POST',
    //             headers: {'Authorization': `Bearer ${getToken()}`},
    //             url: '/accounts/logout',
    //             data: {},
    //         });
    //     },
    //     own() {
    //         return axios({
    //             method: 'GET',
    //             headers: {'Authorization': `Bearer ${getToken()}`},
    //             url: '/accounts/own',
    //         });
    //     },
    // },

    book: {
        get(id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'GET',
                url: `/book/${id}`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
        startRead(id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'PUT',
                url: `/book/${id}/state/start`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
        },
        endRead(id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'PUT',
                url: `/book/${id}/state/end`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
            });
        },
        delete(id: number) {
            return axios.request<{}>({
                method: 'DELETE',
                url: `/book/${id}`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
    },
    books: {
        list(page: number | null, perPage: number | null, sortKey: string | null, filter: string | null) {
            const p: { [key: string]: any; } = {};
            if (page != null && perPage != null) {
                p.page = page;
                p.per_page = perPage;
            }
            if (sortKey != null) {
                p.sort_key = sortKey;
            }
            if (filter != null) {
                p.status = filter;
            }
            return axios.request<ContentResult<PaginateBooks>>({
                method: 'GET',
                headers: {'Authorization': `Bearer ${getToken()}`},
                url: '/books',
                params: p,
            });
        },
        create(data: any) {
            return axios({
                method: 'POST',
                headers: {'Authorization': `Bearer ${getToken()}`},
                url: '/books',
                data,
            });
        },
        update(data: any) {
            return axios({
                method: 'PUT',
                headers: {'Authorization': `Bearer ${getToken()}`},
                url: '/books',
                data,
            });
        },
    },
    description: {
        get(id: number) {
            return axios.request<MultiContentResult<Description>>({
                method: 'GET',
                url: `/book/${id}/description`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
        create(id: number, data: any) {
            return axios.request<ContentResult<Description>>({
                method: 'POST',
                url: `/book/${id}/description`,
                headers: {'Authorization': `Bearer ${getToken()}`},
                data,
            });
        },
        delete(id: number) {
            return axios.request<{}>({
                method: 'DELETE',
                url: `/description/${id}`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
    },
    author: {
        getCounted() {
            return axios.request<MultiContentResult<Author>>({
                method: 'GET',
                url: `/counted_authors`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
        create(data: any) {
            return axios.request<ContentResult<Author>>({
                method: 'POST',
                url: `/author`,
                headers: {'Authorization': `Bearer ${getToken()}`},
                data,
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
    title: string;
    author: Author | null;
    publishedAt: string | null;
    publisher: string | null;
    accountId: number | null;
    start_at: string | null;
    end_at: string | null;
    nextBookId: number | null;
    prevBookId: number | null;
    categories: Category[];
    created_at: string;
    updated_at: string;
}

export interface PaginateBooks {
    books: Book[];
    total_count: number;
}

export interface Description {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface DescriptionForm {
    book_id: number;
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
