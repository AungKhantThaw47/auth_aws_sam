const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;//c
const tableNameTwo = process.env.SAMPLE_TABLE_TWO;//t
const tableNameThree = process.env.SAMPLE_TABLE_THREE;//o
var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.controlTask = async(event) => {

    const eventBody = JSON.parse(event.body)

    if(eventBody.flag == "RESUBMIT"){
    var params = {
        TableName: tableNameTwo,
        FilterExpression: 'taskId = :myId',
        ExpressionAttributeValues: { ':myId':  eventBody.taskId }
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items[0];

  
    var params = {
        TableName: tableName,
        Item: items 
    };

    const result = await docClient.put(params).promise();

    var Deleteparams = {
             TableName: tableNameTwo, 
             Key: {
                  "taskId": eventBody.taskId
              },
              ConditionExpression: "taskId =:mytaskId",
              ExpressionAttributeValues: { ':mytaskId':  eventBody.taskId }
          };
    const result2 = await docClient.delete(Deleteparams).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };
    }else if(eventBody.flag == "ACCEPT"){
        var params = {
            TableName: tableNameTwo,
            FilterExpression: 'taskId = :myId',
            ExpressionAttributeValues: { ':myId':  eventBody.taskId }
        };
        const data = await docClient.scan(params).promise();
        const items = data.Items[0];
    
      
        var params = {
            TableName: tableNameThree,
            Item: items 
        };
    
        const result = await docClient.put(params).promise();
    
        var Deleteparams = {
                 TableName: tableNameTwo, 
                 Key: {
                      "taskId": eventBody.taskId
                  },
                  ConditionExpression: "taskId =:mytaskId",
                  ExpressionAttributeValues: { ':mytaskId':  eventBody.taskId }
              };
        const result2 = await docClient.delete(Deleteparams).promise();
        const response = {
            statusCode: 200,
            body: JSON.stringify(items)
        };
    }
    const work ={
        statusCode: 200,
        body: "It works"
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${work.statusCode} body: ${work.body}`);
    return work;
}