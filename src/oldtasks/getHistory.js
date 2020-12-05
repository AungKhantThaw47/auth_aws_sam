const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.getHistory = async(event) => {
    const workerId = event.pathParameters.workerId; //get workerId via parameter
    var params = {
        TableName: tableName, //report history table
        FilterExpression: 'workerId = :myworkerId',
        ExpressionAttributeValues: { ':myworkerId': workerId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data.Items);
    const response = {
        statusCode: 200,
        body: item
    };
    return response
}