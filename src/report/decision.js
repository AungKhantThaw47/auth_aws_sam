const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE; //staging
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;  //history 
const tableNameThree = process.env.SAMPLE_TABLE_THREE //current

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.decision = async(event) => {
    //get task from table
    const eventBody = JSON.parse(event.body)
    const taskId = eventBody.taskId;
    const flag = eventBody.flag;
    
    if(flag == "Accept"){
    var params = {
        TableName: tableName,
        FilterExpression: 'taskId = :mytaskId',
        ExpressionAttributeValues: { ':mytaskId': taskId }
    };
    const task_data_result = await docClient.scan(params).promise();
    const task_data = task_data_result.Item;
    

    //send report to history table
    var Updateparams = {
        TableName: tableNameTwo,
        Item: task_data
    };
    const result = await docClient.put(Updateparams).promise();


    //delete task from staging task table
    var Deleteparams = {
        TableName: table, //stagingtask table
        Key: {
            "taskId": taskId
        },
        ConditionExpression: "taskId = :mytaskId",
        ExpressionAttributeValues: { ":mytaskId": taskId }
    };
    docClient.delete(params);
    }
    else if(flag == "Resubmit"){
        var params = {
            TableName: tableName,
            FilterExpression: 'taskId = :mytaskId',
            ExpressionAttributeValues: { ':mytaskId': taskId }
        };
        const task_data_result = await docClient.scan(params).promise();
        const task_data = task_data_result.Item;
       
    
        //send report to current task table
        var Updateparams = {
            TableName: tableNameThree,
            Item: task_data
        };
        const result = await docClient.put(Updateparams).promise();
    
    
        //delete task from staging task table
        var Deleteparams = {
            TableName: table, //stagingtask table
            Key: {
                "taskId": taskId
            },
            ConditionExpression: "taskId = :mytaskId",
            ExpressionAttributeValues: { ":mytaskId": taskId }
        };
        docClient.delete(params);
    }
    else{
        const response = "[INFO] WRONG FLAG ! ";
    }
    const response = "WORK HARD!";
    
    
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}