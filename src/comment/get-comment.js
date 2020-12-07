const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.getComment = async(event, context, callback) => {
    //get workSpaceId, workerId, workerType 
    const postId = event.pathParameters.postid;
    var params = {
        TableName: tableName,
        FilterExpression: 'postId =  :mypostId',
        ExpressionAttributeValues: { ":mypostId": postId }
    };
    const data = await docClient.scan(params).promise();
    const item = JSON.stringify(data.Items);
    const response = {
        statusCode: 200,
        body: item
    };
    return response;
}