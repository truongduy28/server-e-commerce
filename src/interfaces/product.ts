export interface ProductFilterParams {
    title: string;
    categories: string[];
    colors: string[];
    sizes: string[];
    price: string // { start: number | null; end: number | null };
    page: number;
    pageSize: number;
}

export interface RangValue {
    start: number | null;
    end: number | null;
}

export interface GetMinAndMaxPrice {
    minPrice: number | undefined;
    maxPrice: number | undefined;
}