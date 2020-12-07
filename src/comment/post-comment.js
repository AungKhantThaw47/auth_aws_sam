const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.postComment = async(event) => {

    const eventBody = JSON.parse(event.body)
    const postId = event.pathParameters.postid
    const workerId = eventBody.workerId
    const data = eventBody.data
    const body = {
        postId: postId,
        workerId: workerId,
        Postdate: Date.now(),
        data: data,
        commentId: postId + workerId + Date.now()
    };
    var params = {
        TableName: tableName,
        Item: body //body is a JSON object contains workerId, workerspaceId, date, postid, data
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(eventBody)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}