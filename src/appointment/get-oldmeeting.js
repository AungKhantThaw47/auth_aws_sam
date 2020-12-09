const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');

exports.getoldAppointment = async(event, context, callback) => {
    const workspaceid = event.pathParameters.workspaceid; 
    var params = {
        TableName: tableName,
        FilterExpression: 'workspaceId=:myworkspaceid',
        ExpressionAttributeValues: { ":myworkspaceid": workspaceid }
    };
    const data = await docClient.scan(params).promise();
    const item = data.Items;
    console.log(item);
    const response = {
        statusCode: 200,
        body:  JSON.stringify(item)
    };
    
    return response;
};