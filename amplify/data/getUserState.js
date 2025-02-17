import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
    return ddb.query({
        query: {
            expression: "#us = :userStat",
            expressionNames: { "#us": "user_stat"},
            expressionValues: { ":userStat": ddb.attr(ctx.args.user_stat)},
        },
        scanIndexForward: false,
        limit: 1
     });
}

export const response = (ctx) => ctx.result;