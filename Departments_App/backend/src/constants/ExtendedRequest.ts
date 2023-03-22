import { Request } from 'express';
import { Query, ParamsDictionary } from 'express-serve-static-core';

export interface ExtendedRequest<
    P extends ParamsDictionary = {},
    ReqBody = null,
    ReqQuery extends Query = {},
    Locals = null
> extends Request {
    body: ReqBody;
    query: ReqQuery;
    params: P;

    user?: {
        userId: number;
        userRole: string;
        userFirstName: string;
        userLastName: string;
    };
    cookies: {
        rt?: string;
        jwt?: string;
    };
}
