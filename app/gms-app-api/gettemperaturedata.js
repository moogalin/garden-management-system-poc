import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: "Temperature_Data.dev",
    //IndexName: "MAC-sorted-by-userId-index",
    // 'KeyConditionExpression' defines the condition for the query
    // 'ExpressionAttributeValues' defines the value in the condition
    KeyConditionExpression: "MAC = :MAC",
    FilterExpression: "userId = :userId",
    ScanIndexForward: false,
    //FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":MAC": data.MAC,
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    console.log("RESULT:" + JSON.stringify(result));
    // Return the matching list of items in response body
    callback(null, success(result.Items));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
