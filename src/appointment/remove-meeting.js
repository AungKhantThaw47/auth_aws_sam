const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;

var AWS = require('aws-sdk');

exports.removemeeting = async(event) => {
    //get task from table
    
    const meetingId = event.pathParameters.meetingid;
 
    
    var params = {
        TableName: tableName,
        FilterExpression: 'meetingId =:myId',
        ExpressionAttributeValues: { ':myId': meetingId }
    };
    const task_data_result = await docClient.scan(params).promise();
    const task_data = task_data_result.Items[0];
     
    //send report to staging table
    var Updateparams = {
         TableName: tableNameTwo,
         Item: task_data
     };
    const result = await docClient.put(Updateparams).promise();

    
    //delete task from current task table
    var Deleteparams = {
        TableName: tableName, //currenttask table
        Key: {
             "meetingId": meetingId
         },
         ConditionExpression: 'meetingId =:myId',
         ExpressionAttributeValues: { ':myId': meetingId }
     };
     const result2 = await docClient.delete(Deleteparams).promise();

    
    //const response = "WORK HARD!";
    const response = {
        statusCode: 200,
        body: "IT WORKS!"
    };
    
    // // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}