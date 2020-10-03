import {Content} from '@/rakutenAPI';

export interface SearchResultWithCheck {
    isbn: string;
    title: string;
    author: string;
    smallImageUrl: string;
    mediumImageUrl: string;
    publisherName: string;
    itemPrice: string;
    itemUrl: string;
    affiliateUrl: string;
    isChecked: boolean;
    isAlreadyRegister: boolean;
}

export function itemToResultWithCheck(item: Content): SearchResultWithCheck {
    return {
        isbn: item.isbn,
        title: item.title,
        author: item.author,
        smallImageUrl: item.smallImageUrl,
        mediumImageUrl: item.mediumImageUrl,
        publisherName: item.publisherName,
        itemPrice: item.itemPrice,
        itemUrl: item.itemUrl,
        affiliateUrl: item.affiliateUrl,
        isChecked: false,
        isAlreadyRegister: false,
    } as SearchResultWithCheck;
}
