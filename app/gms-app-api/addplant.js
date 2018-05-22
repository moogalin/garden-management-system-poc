import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
  success,
  failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "All_Plants.dev",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      plantId: uuid.v1(),
      name: data.name,
      qty: data.qty,
      date: data.date,
      age: data.age,
      sunlight: data.sunlight,
      MAC: data.MAC,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    console.log(e);
    callback(null, failure({
      status: false
    }));
  }
}
