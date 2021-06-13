export class ProductListRequestModel {
    take: number;
    skip: number;
    searchString: string;
    orderByField: string;
    orderByDirection: string;
}