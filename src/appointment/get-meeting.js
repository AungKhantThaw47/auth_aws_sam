const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.getAppointment = async(event, context, callback) => {
    const workspaceid = event.pathParameters.workspaceid; 
    var params = {
        TableName: tableName,
        FilterExpression: 'workspaceid=:myworkspaceid',
        ExpressionAttributeValues: { ":myworkspaceid": workspaceid }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data.Items);
    const response = {
        statusCode: 200,
        body: item
    };
    return response;
}