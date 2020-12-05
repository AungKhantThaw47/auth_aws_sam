const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.submitReport = async(event) => {
    //get task from table
    const eventBody = JSON.parse(event.body)
    const taskId = eventBody.taskId;
    const report_data = eventBody.reportData;
    var params = {
        TableName: tableName,
        FilterExpression: 'taskId = : mytaskId',
        ExpressionAttributeValues: { ':mytaskId': taskId }
    };
    const task_data_result = await docClient.scan(params).promise();
    const task_data = task_data_result.Item;
    task_data.report_data = report_data

    //send report to historyTable
    var Updateparams = {
        TableName: tableNameTwo,
        Item: task_data
    };
    const result = await docClient.put(Updateparams).promise();


    //delete task from current task table
    var Deleteparams = {
        TableName: table, //currenttask table
        Key: {
            "taskId": taskId
        },
        ConditionExpression: "taskId = : mytaskId",
        ExpressionAttributeValues: { ":mytaskId": taskId }
    };
    docClient.delete(params);

    const response = "WORK HARD!";
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}