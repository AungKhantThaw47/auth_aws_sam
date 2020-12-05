const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


exports.main = async(event, context, callback) => {
    var params = {
        TableName: tableName,
        Item: JSON.parse(event.body)
    };
    var result = await docClient.put(params).promise();
    const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item)
    };
}