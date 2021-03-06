import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.VUE_APP_API_URL_BASE,
});

import firebase from 'firebase/app';
import 'firebase/auth';
import router from '@/router';

export function getToken(): Promise<string> {
    const user = firebase.auth().currentUser;
    if (user != null) {
        return user.getIdToken();
    } else {
        return new Promise((resolve, reject) => reject('user not found'));
    }
}

export default {
    book: {
        get(token: string, id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'GET',
                url: `/book/${id}`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        getLimited(id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'GET',
                url: `/book_limited/${id}`,
            });
        },
        startRead(token: string,  id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'PUT',
                url: `/book/${id}/state/start`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        },
        endRead(token: string, id: number) {
            return axios.request<ContentResult<Book>>({
                method: 'PUT',
                url: `/book/${id}/state/end`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        },
        delete(token: string, id: number) {
            return axios.request<{}>({
                method: 'DELETE',
                url: `/book/${id}`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
    },
    books: {
        list(token: string, page: number | null, perPage: number | null, sortKey: string | null,
             state: string | null, isbn: string | null, book: string | null) {
            const p: { [key: string]: any; } = {};
            if (page != null && perPage != null) {
                p.page = page;
                p.per_page = perPage;
            }
            if (sortKey != null) {
                p.sort_key = sortKey;
            }
            if (state != null) {
                p.status = state;
            }
            if (isbn != null) {
                p.isbn = isbn;
            }
            if (book != null) {
                p.book = book;
            }
            return axios.request<ContentResult<PaginateBooks>>({
                method: 'GET',
                headers: {Authorization: `Bearer ${token}`},
                url: '/books',
                params: p,
            });
        },
        create(token: string, data: any) {
            return axios.request({
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`},
                url: '/books',
                data,
            });
        },
        createWith(token: string, data: PostBookForm) {
            return axios.request({
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`},
                url: '/books_with',
                data,
            });
        },
        update(token: string, data: any) {
            return axios.request({
                method: 'PUT',
                headers: {Authorization: `Bearer ${token}`},
                url: '/books',
                data,
            });
        },
        countedAuthorName(token: string) {
            return axios.request<ContentResult<CountedName[]>>({
                method: 'GET',
                url: `/books/counted/author`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        countedPublisherName(token: string) {
            return axios.request<ContentResult<CountedName[]>>({
                method: 'GET',
                url: `/books/counted/publisher`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        countedMonthly(token: string) {
            return axios.request<ContentResult<CountedTime[]>>({
                method: 'GET',
                url: `/books/counted/monthly`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        countedRegisterDaily(token: string) {
            return axios.request<ContentResult<CountedTime[]>>({
                method: 'GET',
                url: `/books/counted/daily/register`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        countedStartDaily(token: string) {
            return axios.request<ContentResult<CountedTime[]>>({
                method: 'GET',
                url: `/books/counted/daily/start`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        countedEndDaily(token: string) {
            return axios.request<ContentResult<CountedTime[]>>({
                method: 'GET',
                url: `/books/counted/daily/end`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
    },
    description: {
        get(token: string, id: number) {
            return axios.request<MultiContentResult<Description>>({
                method: 'GET',
                url: `/book/${id}/description`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        create(token: string, id: number, data: any) {
            return axios.request<ContentResult<Description>>({
                method: 'POST',
                url: `/book/${id}/description`,
                headers: {Authorization: `Bearer ${token}`},
                data,
            });
        },
        delete(token: string, id: number) {
            return axios.request<{}>({
                method: 'DELETE',
                url: `/description/${id}`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
    },
    author: {
        getCounted(token: string) {
            return axios.request<MultiContentResult<Author>>({
                method: 'GET',
                url: `/counted_authors`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        create(token: string, data: any) {
            return axios.request<ContentResult<Author>>({
                method: 'POST',
                url: `/author`,
                headers: {Authorization: `Bearer ${token}`},
                data,
            });
        },
    },
    publisher: {
        getCounted(token: string) {
            return axios.request<MultiContentResult<Publisher>>({
                method: 'GET',
                url: `/counted_publisher`,
                headers: {Authorization: `Bearer ${token}`},
            });
        },
        create(token: string, data: any) {
            return axios.request<ContentResult<Publisher>>({
                method: 'POST',
                url: `/publisher`,
                headers: {Authorization: `Bearer ${token}`},
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
    isbn: string | null;
    title: string;
    author: Author | null;
    publishedAt: string | null;
    accountId: number | null;
    publisher: Publisher | null;
    start_at: string | null;
    end_at: string | null;
    nextBookId: number | null;
    prevBookId: number | null;
    categories: Category[];
    small_image_url: string | null;
    medium_image_url: string | null;
    item_url: string | null;
    affiliate_url: string | null;
    created_at: string;
    updated_at: string;
    read_state: number;
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
    count: number;
}

export interface Publisher {
    id: number;
    name: string;
    count: number;
}

export interface CountedName {
    name: string;
    count: number;
}

export interface CountedTime {
    time: string;
    count: number;
}

export interface PostBookForm {
    isbn: string | null;
    title: string;
    author_name: string;
    publisher_name: string;
    medium_image_url: string;
    small_image_url: string;
    item_url: string;
    affiliate_url: string | null;
}

import {captureMessage, Severity} from '@sentry/browser';
export function errorRoute(errMsg: string) {
    getToken()
        .then((token) => {
            // callback(errMsg)
            console.log('ok');
        })
        .catch((err) => {
            if (process.env.NODE_ENV === 'production') {
                captureMessage(errMsg, Severity.Error);
            }
            localStorage.clear();
            router.push('/');
        });
}

