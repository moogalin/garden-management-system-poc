import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
const params = {
    TableName: "All_Users.dev",
    // 'KeyConditionExpression' defines the condition for the query
    // 'ExpressionAttributeValues' defines the value in the condition
    KeyConditionExpression: "userId = :userId",
    //FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
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
