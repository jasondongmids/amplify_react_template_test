import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean().default(false)
    })
    .authorization((allow) => [allow.owner()]),

  TESTUserGameHx: a.model({
      username: a.string(),
      number1: a.integer(),
      number2: a.integer(),
      operation: a.string().default('+'),
      correct_answer: a.integer(),
      user_answer: a.integer(),
      is_correct: a.boolean(),
      time_spent: a.integer(),
    })
    .authorization((allow) => [allow.owner()]),

    // following steps here: https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/
    UserStateHx: a.customType({
      user_stat: a.string().required(),
      stat: a.string().required(),
      current_streak: a.integer(),
      total_questions: a.integer(),
      state: a.integer(),
      prev_is_slow: a.integer(),
      prev_is_correct: a.integer(),
      elapsed_time_total: a.integer(),
      timestamp_created: a.datetime()
    }),

    addUserState: a
      .mutation()
      .arguments({
        user_stat: a.string().required(),
        stat: a.string().required(),
        current_streak: a.integer(),
      })
      .returns(a.ref("UserStateHx"))
      .authorization(allow => [allow.publicApiKey()])
      .handler(
        a.handler.custom({
          dataSource: "UserStateHxTable3",
          entry: "./addUserState.js",
        })
      )
    // getUserState: a
    //   .query()
    //   .arguments({id: a.string().required()})
    //   .returns(a.ref("UserStateHx"))
    //   .authorization(allow => [allow.publicApiKey()])
    //   .handler(
    //     a.handler.custom({
    //       dataSource: "UserStateHxTable",
    //       entry: "./getUserState.js"
    //     })
    //   )

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
