const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.postNewsfeed = async(event) => {

    const eventBody = JSON.parse(event.body)
    const workspaceId = event.pathParameters.workspaceid
    const workerId = eventBody.workerId
    const data = eventBody.data
    const body = {
        workspaceId: workspaceId,
        workerId: workerId,
        Postdate: Date.now(),
        data: data,
        postId: workspaceId + workerId + Date.now()
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