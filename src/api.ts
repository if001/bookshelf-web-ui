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
        list(page: number | null, perPage: number | null, sortKey: string | null, state: string | null, isbn: string | null) {
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
    publisher: {
        getCounted() {
            return axios.request<MultiContentResult<Publisher>>({
                method: 'GET',
                url: `/counted_publisher`,
                headers: {'Authorization': `Bearer ${getToken()}`},
            });
        },
        create(data: any) {
            return axios.request<ContentResult<Publisher>>({
                method: 'POST',
                url: `/publisher`,
                headers: {'Authorization': `Bearer ${getToken()}`},
                data,
            });
        },
    },
    rakuten: {
        searchByTitle(title: string, page: number, perPage: number) {
            return Axios.get(
                `${rakutenBaseURL}?applicationId=${appID}&affiliateId=${affiliateId}&page=${page}&hits=${perPage}&title=${title}`,
                {
                    headers: {'Content-Type': 'application/json'},
                },
            );
        },
        searchByAuthor(author: string, page: number, perPage: number) {
            return Axios.get(
                `${rakutenBaseURL}?applicationId=${appID}&affiliateId=${affiliateId}&page=${page}&hits=${perPage}&author=${author}`,
                {
                    headers: {'Content-Type': 'application/json'},
                },
            );
        },
        searchByISBN(isbn: string) {
            return Axios.get(
                `${rakutenBaseURL}?applicationId=${appID}&affiliateId=${affiliateId}&isbn=${isbn}`,
                {
                    headers: {'Content-Type': 'application/json'},
                },
            );
        },

    },
};

const rakutenBaseURL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
const appID = '1035362638897131844';
const affiliateId = '188fe732.33eb93bf.188fe733.aaced19b';

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

export interface SearchResult {
    Items: Contents[];
    page: number;
    pageCount: number;
}

export interface Contents {
    Item: Content;
}

export interface Content {
    isbn: string;
    title: string;
    author: string;
    smallImageUrl: string;
    mediumImageUrl: string;
    largeImageUrl: string;
    publisherName: string;
    itemPrice: string;
    itemUrl: string;
    affiliateUrl: string;
    itemCaption: string;
}

import firebase from 'firebase/app';
import 'firebase/auth';
import router from '@/router';

interface UserData {
    stsTokenManager: ExpTime;
}
interface ExpTime {
    expirationTime: number;
}

export function getExpireTimeByFirebase(): number | null {
    const user = firebase.auth().currentUser;
    if (user != null) {
        const userData = user.toJSON() as UserData;
        return userData.stsTokenManager.expirationTime;
    }
    return null;
}

export function getExpireTimeByStorage(): number | null {
    const expTimeStr = localStorage.getItem('expTime');
    if (expTimeStr != null) {
        return parseInt(expTimeStr, 10);
    }
    return null;
}

export function doRefreshToken(): Promise<void> {
    console.log('refresh token');
    const user = firebase.auth().currentUser;
    console.log('user',user);
    return new Promise<void>((resolve, reject) => {
        if (user != null) {
            user.getIdToken()
                .then((idToken) => {
                    localStorage.setItem('token', idToken.toString());
                    resolve();
                })
                .catch(() => {
                    localStorage.clear();
                    reject();
                });
        } else {
            reject();
        }
    });
}

export function errorRoute(status: number, nextRoute: string | null) {
    const expTime = getExpireTimeByStorage();
    const now = new Date();
    console.log('exp:', expTime);
    console.log(Math.round(now.getTime()));
    if (expTime != null) {
        console.log(expTime < Math.round(now.getTime()));
    }

    if (status === 401 && expTime != null && expTime < Math.round(now.getTime())) {
        console.log('refresh');
        doRefreshToken()
            .then(() => {
                if (nextRoute === null) {
                    router.go(-1);
                } else {
                    console.log('next',nextRoute);
                    router.push(nextRoute);
                }
            })
            .catch(() => {
                console.log('refresh error');
                router.push('/login');
            });
    } else {
        // console.log('/books api error');
        localStorage.clear();
        router.push('/login');
    }
}
