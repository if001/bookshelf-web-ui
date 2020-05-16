import Axios from 'axios';

const rakutenBaseURL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
const rakutenKoboBaseURL = 'https://app.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426';
const appID = '1035362638897131844';
const affiliateId = '188fe732.33eb93bf.188fe733.aaced19b';

export default {
    search(query: RakutenSearchQuery) {
        return Axios.get(rakutenBaseURL,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: query.make(),
            },
        );
    },
    searchEbook(query: RakutenSearchQuery) {
        return Axios.get(rakutenKoboBaseURL,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: query.make(),
            },
        );
    },
};

interface Query { [key: string]: any; }
export class RakutenSearchQuery {
    private readonly title: string;
    private readonly author: string;
    private isbn: string;
    private page: number;
    private perPage: number;
    private sort: string | null;

    constructor(title: string, author: string, isbn: string, page: number, perPage: number, sort: string | null) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.page = page;
        this.perPage = perPage;
        this.sort = sort;
    }

    public setPaginate(page: number, perPage: number) {
        this.page = page;
        this.perPage = perPage;
    }
    public setISBN(isbn: string) {
        this.isbn = isbn;
    }
    public setSort(sort: string) {
        this.sort = sort;
    }
    public make(): Query {
        const p: Query = {
            applicationId: appID,
            affiliateId,
            page: this.page,
            hits: this.perPage,
            outOfStockFlag: 1,
        };
        // outOfStockFlag
        // 売り切れ商品も表示させない: 0
        // 売り切れ商品も表示させる: 1

        if (this.title.length !== 0) {
            p.title = this.title;
        }
        if (this.author.length !== 0) {
            p.author = this.author;
        }
        if (this.isbn.length !== 0) {
            p.isbn = this.isbn;
        }
        if (this.sort !== null) {
            p.sort = this.sort;
        }
        return p;
    }
}
export function makeEmptyQuery(): RakutenSearchQuery {
    return new RakutenSearchQuery(
        '',
        '',
        '',
        1,
        1,
        null,
    );
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
