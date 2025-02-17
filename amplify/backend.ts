import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { aws_dynamodb } from "aws-cdk-lib"; 

export const backend = defineBackend({
  auth,
  data,
});

const extDataSourcesStack = backend.createStack("ExternalDataSources");

const extTable = aws_dynamodb.Table.fromTableName(
  extDataSourcesStack,
  "UserStatsTest",
  "UserStateHxTable"
)

backend.data.addDynamoDbDataSource(
  "UserStateHxTable",
  extTable
)