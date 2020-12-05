const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.myTaskAll = async(event) => {
    //get workSpaceId, workerId, workerType 
    const workerId = event.workerId;
    var params = {
        TableName: tableName,
        FilterExpression: 'workerId = : myworkerId',
        ExpressionAttributeValues: { ':myworkerId': workerId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data);
}