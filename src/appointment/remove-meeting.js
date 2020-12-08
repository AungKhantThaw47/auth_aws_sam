const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.removemeeting = async(event) => {
    //get meeting from table
    const eventBody = JSON.parse(event.body)
    const meetingId = eventBody.meetingId;
    var params = {
        TableName: tableName,
        FilterExpression: 'meetingId =:mymeetingId',
        ExpressionAttributeValues: { ':mymeetingId': meetingId }
    };
    const meeting_result = await docClient.scan(params).promise();
    const meeting = meeting_result.Item[0];
    
    //send report to historyTable
    var Updateparams = {
        TableName: tableNameTwo,
        Item: meeting
    };
    const result = await docClient.put(Updateparams).promise();


    //delete task from current task table
    var Deleteparams = {
        TableName: tableName, //currenttask table
        Key: {
            "meetingId": meetingId
        },
        ConditionExpression: "meetingId=:mymeetingId",
        ExpressionAttributeValues: { ":mymeetingId":meetingId }
    };
    const res1 = await docClient.delete(params).promise();

    const response = "WORK HARD!";
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}