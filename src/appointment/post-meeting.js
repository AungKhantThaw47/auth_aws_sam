const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.postmeeting = async(event) => {

    const eventBody = JSON.parse(event.body);
    const meetingId = event.pathParameters.meetingId;
    const workspaceId = eventBody.workspaceId;
    const title = eventBody.title;
    const starttime = eventBody.starttime;
    const endtime = eventBody.endtime;
    const additionalInfo = eventBody.additionalInfo;
    const body = {
        meetingId : meetingId,
        workspaceId : workspaceId,
        title : title,
        starttime : starttime,
        endtime : endtime,
        additionalInfo : additionalInfo
    };
    var params = {
        TableName: tableName,
        Item: body 
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(eventBody)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}