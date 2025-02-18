import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { aws_dynamodb } from "aws-cdk-lib"; 

export const backend = defineBackend({
  auth,
  data,
});

// These steps create a schema? and datasource in AWS AppSync
const extDataSourcesStack = backend.createStack("ExternalDataSources");

const extTable = aws_dynamodb.Table.fromTableName(
  extDataSourcesStack,
  "UserStatsTestName", // name for construct; not used
  "UserStatsTest" // name for table
)

backend.data.addDynamoDbDataSource(
  "UserStateHxTable3", // name as it appears in AWS AppSync API
  extTable
)