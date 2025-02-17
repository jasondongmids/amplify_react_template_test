import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
    const userStat = util.autoId();
    const stat = util.time.nowISO8601(); // https://docs.aws.amazon.com/appsync/latest/devguide/time-helpers-in-util-time-js.html
    
    const item = {
        current_streak: ctx.arguments.current_streak,
    };

    return ddb.put({
        key: { user_stat: `STATE#${userStat}`, stat },
        item: item
    });
}

export function response(ctx) {
    return ctx.result
}