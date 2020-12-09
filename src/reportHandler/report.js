const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.reportTask = async(event) => {

    const eventBody = JSON.parse(event.body)

    var params = {
        TableName: tableName,
        FilterExpression: 'taskId = :myId',
        ExpressionAttributeValues: { ':myId':  eventBody.taskId }
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items[0];
    items.report = eventBody.report;
  
    var params = {
        TableName: tableNameTwo,
        Item: items 
    };

    const result = await docClient.put(params).promise();

    var Deleteparams = {
             TableName: tableName, 
             Key: {
                  "taskId": eventBody.taskId
              },
              ConditionExpression: "taskId =:mytaskId",
              ExpressionAttributeValues: { ':mytaskId':  eventBody.taskId }
          };
    const result2 = await docClient.delete(Deleteparams).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}