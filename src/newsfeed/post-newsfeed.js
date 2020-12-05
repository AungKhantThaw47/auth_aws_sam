const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.postNewsfeed = async(event) => {
    
    const body = {
         workspaceId : event.workspaceId,
         workerId : event.body.workerId,
         Postdate : Date.now(),
         data : event.body.data,
         postId : event.workspaceId +  event.body.workerId + Date.now()
    };
    var params = {
        TableName: tableName,
        Item: body  //body is a JSON object contains workerId, workerspaceId, date, postid, data
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}