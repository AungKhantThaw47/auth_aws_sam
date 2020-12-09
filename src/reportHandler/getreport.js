const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.getReport = async(event) => {
    const workspaceId = event.pathParameters.workspaceid; //get workerId via parameter
    var params = {
        TableName: tableName, //report history table
        FilterExpression: 'workerspaceId = :myId',
        ExpressionAttributeValues: { ':myId': workspaceId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data.Items);
    const response = {
        statusCode: 200,
        body: JSON.stringify(item)
    };
    return response
}