import {Book} from '@/api';

export interface BookState {}
export class BookStateNotRead implements BookState {}
export class BookStateReading implements BookState {}
export class BookStateEnd implements BookState {}

export function getBookState(b: Book): BookState {
    switch (b.read_state) {
        case 1: return BookStateNotRead;
        case 2: return BookStateReading;
        case 3: return BookStateEnd;
        default: return BookStateNotRead;
    }
}
