//NO SUBIR, LLAVES DE ACCESO A LOS SERVICIOSS
let awsKeys = {
    DynamoDB: {
        region: 'us-east-2',
        endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
        accessKeyId: 'AKIA4NNOQMEWLXGJJRMA',
        secretAccessKey: '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' 
    },
    S3: {
        region: 'us-east-2',
        accessKeyId: 'AKIA4NNOQMEWESFZGMEX',
        secretAccessKey: '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'
    },
    Rekognition: {
        region: 'us-east-2',
        apiVersion: '2016-06-27',
        accessKeyId: 'AKIA4NNOQMEWAOMZXZSM',
        secretAccessKey: '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'
    }

}

module.exports = awsKeys; 
