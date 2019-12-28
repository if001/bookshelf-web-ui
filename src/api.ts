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
    rakuten: {
        search(title: string, author: string, page: number, perPage: number) {
            const p: { [key: string]: any; } = {
                applicationId: appID,
                affiliateId,
                page,
                hits: perPage,
                title,
                author,
            };

            return Axios.get(rakutenBaseURL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: p,
                },
            );
        },
        searchByTitle(title: string, page: number, perPage: number) {
            const p: { [key: string]: any; } = {
                applicationId: appID,
                affiliateId,
                page,
                hits: perPage,
                title,
            };

            return Axios.get(rakutenBaseURL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: p,
                },
            );
        },
        searchByAuthor(author: string, page: number, perPage: number) {
            const p: { [key: string]: any; } = {
                applicationId: appID,
                affiliateId,
                page,
                hits: perPage,
                author,
            };

            return Axios.get(rakutenBaseURL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: p,
                },
            );
        },
        searchByISBN(isbn: string) {
            const p: { [key: string]: any; } = {
                applicationId: appID,
                affiliateId,
                isbn,
            };

            return Axios.get(rakutenBaseURL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: p,
                },
            );
        },
    },
    googleBook: {
        search(title: string | null, author: string | null, isbn: string | null, page: number, perPage: number) {
            const p: { [key: string]: any; } = {
                startIndex: page,
                maxResult: perPage,
                Country: 'JP',
                orderBy: 'newest',
                // orderBy: 'relevance',
            };

            const q = [];
            if (title) {
                q.push(`intitle:${title}`);
            }
            if (author) {
                q.push(`inauthor:${author}`);
            }
            if (isbn) {
                q.push(`isbn:${isbn}`);
            }
            if (q.length !== 0) {
                p['q'] = q.join('+');
            }
            console.log(p);
            return Axios.get(googleBookBaseURL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: p,
                },
            );
        },
    },
};

const rakutenBaseURL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
const appID = '1035362638897131844';
const affiliateId = '188fe732.33eb93bf.188fe733.aaced19b';

const googleBookBaseURL = 'https://www.googleapis.com/books/v1/volumes';

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

export interface CountedName {
    name: string;
    count: number;
}

export interface CountedTime {
    time: string;
    count: number;
}

import {captureMessage, Severity} from '@sentry/browser';
export function errorRoute(errMsg: string) {
    getToken()
        .then(token => {
            // callback(errMsg)
            console.log("ok")
        })
        .catch((err) => {
            if (process.env.NODE_ENV === 'production') {
                captureMessage(errMsg, Severity.Error);
            }
            localStorage.clear();
            router.push('/');
        });
}

export interface SearchResultGoogle {
    items: ContentGoogle[];
    totalItems: number;
}

export interface ContentGoogle {    
    saleInfo: SalesInfo;
    volumeInfo: VolumeInfo;
}

export interface VolumeInfo {
    authors: string[];
    description: string;
    title: string;
    imageLinks: ImageLinks;
    publisher: string;
    industryIdentifiers: IndustryIdentifiers[];
}
export interface SalesInfo {
    listPrice: ListPrice;
}
export interface ListPrice {
    amount: number;
}
export interface ImageLinks {
    smallThumbnail: string;
    thumbnail: string;
}
export interface IndustryIdentifiers {
    type: string;
    identifier: string;
}
