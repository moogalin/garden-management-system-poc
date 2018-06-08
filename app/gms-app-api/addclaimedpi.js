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
    TableName: "Pis_Claimed.dev",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      MAC: data.MAC
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
