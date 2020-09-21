import Axios from 'axios';

const googleBookBaseURL = 'https://www.googleapis.com/books/v1/volumes';

export default {
    googleAPI: {
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
                p.q = q.join('+');
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
    }
};


// google interface
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
