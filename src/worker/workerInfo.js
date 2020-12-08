const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.worker = async(event) => {
    //get workSpaceId, workerId, workerType 
    const workspaceId = event.pathParameters.workspaceid;
    var params = {
        TableName: tableName,
        FilterExpression: 'workSpaceOne = :myworkspaceId',
        ExpressionAttributeValues: { ':myworkspaceId': workspaceId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data);
    const response = {
        statusCode: 200,
        body: item
    };
    return response
}