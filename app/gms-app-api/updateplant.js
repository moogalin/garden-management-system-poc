
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "All_Plants.dev",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      plantId: event.pathParameters.plantId
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET age = :age, #d = :date, #n = :name, qty = :qty, MAC = :MAC",
    ExpressionAttributeValues: {
      ":age": data.age ? data.age : null,
      ":date": data.date ? data.date : null,
      ":name": data.name ? data.name : null,
      ":qty": data.qty ? data.qty : null,
      ":MAC": data.MAC ? data.MAC : null
    },
    ExpressionAttributeNames: {
      "#d":"date",
      "#n":"name"
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
