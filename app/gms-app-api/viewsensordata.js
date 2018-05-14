
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: "SensorData_E47CF9063CA4",
    // 'KeyConditionExpression' defines the condition for the query
    // 'ExpressionAttributeValues' defines the value in the condition
    KeyConditionExpression: "Sensor = :Sensor",
    ExpressionAttributeValues: {
      ":Sensor": "Light"
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    callback(null, success(result.Items));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
