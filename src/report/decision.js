const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE; //staging
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;  //history 
const tableNameThree = process.env.SAMPLE_TABLE_THREE //current

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.decision = async(event) => {
    //get task from table
    
    const taskId = event.body.taskId;
    const flag = event.body.flag;
    
    if(flag == "Accept"){
    var params = {
        TableName: tableName,
        FilterExpression: 'taskId =:mytaskId',
        ExpressionAttributeValues: { ':mytaskId': taskId }
    };
    const task_data_result = await docClient.scan(params).promise();
    const task_data = task_data_result.Items[0];
    

    //send report to history table
    var Updateparams = {
        TableName: tableNameTwo,
        Item: task_data
    };
    const result = await docClient.put(Updateparams).promise();


    //delete task from staging task table
    var Deleteparams = {
        TableName: tableName, //stagingtask table
        Key: {
            "taskId": taskId
        },
        ConditionExpression: "taskId = :mytaskId",
        ExpressionAttributeValues: { ":mytaskId": taskId }
    };
    const res1 = await docClient.delete(Deleteparams).promise();
    }
    else if(flag == "Resubmit"){
        var params = {
        TableName: tableName,
        FilterExpression: 'taskId =:mytaskId',
        ExpressionAttributeValues: { ':mytaskId': taskId }
    };
    const task_data_result = await docClient.scan(params).promise();
    const task_data = task_data_result.Items[0];
       
    
        //send report to current task table
        var Updateparams = {
            TableName: tableNameThree,
            Item: task_data
        };
        const result = await docClient.put(Updateparams).promise();
    
    
        //delete task from staging task table
        var Deleteparams = {
            TableName: tableName, //stagingtask table
            Key: {
                "taskId": taskId
            },
            ConditionExpression: "taskId = :mytaskId",
            ExpressionAttributeValues: { ":mytaskId": taskId }
        };
    const res2 = await docClient.delete(Deleteparams).promise();
    }
    else{
        const response = "[INFO] WRONG FLAG ! ";
    }
    const response = "WORK HARD!";
    
    
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}