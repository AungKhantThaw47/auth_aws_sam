const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.myTaskDetail = async(event) => {
    const taskId = event.pathParameters.taskId;
    var params = {
        TableName: tableName,
        FilterExpression: 'taskId = :taskDetailId',
        ExpressionAttributeValues: { ':taskDetailId': taskId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data.Items);
    const response = {
        statusCode: 200,
        body: item
    };
    return response
}