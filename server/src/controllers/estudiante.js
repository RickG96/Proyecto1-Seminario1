const awsKeys = require('../conexion/conexion');
var uuid = require('uuid');

const post_registro = (req, res) => {
    //conexion aws
    const AWS = require('aws-sdk');
    //fin de conexion 
    let id = req.body.id;
    let base64String = req.body.base64;
    //Decodificar imagen 
    let imagenDecodificada = Buffer.from(base64String, 'base64');
    //insertar al bucket 
    const s3 = new AWS.S3(awsKeys.s3);
    var imageId = `${uuid()}.jpg`;
    var filepath = `estudiantes/${imageId}`;
    var uploadParamsS3 = {
        Bucket: 'imagesemi1proc',
        Key: filepath,
        Body: imagenDecodificada,
        ACL: 'public-read',
    };
    s3.upload(uploadParamsS3, function sync(err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': err })
        } else {
            const rekognition = new AWS.Rekognition(awsKeys.rekognition);
            var params = {
                CollectionId: "estudiantes",
                DetectionAttributes: [
                ],
                Image: {
                    Bytes: imagenDecodificada
                },
                ExternalImageId: id,
                MaxFaces: 1,
                QualityFilter: 'HIGH'
            }
            rekognition.indexFaces(params, function (err, data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': err })
                } else {
                    const baseAWS = require('aws-sdk');
                    baseAWS.config.update(awsKeys.dinamo);
                    const docClient = new baseAWS.DynamoDB.DocumentClient();
                    var params = {
                        TableName: "Estudiantes",
                        Item: {
                            "id": id,
                            "image": filepath
                        }
                    }
                    docClient.put(params, function (err, data) {
                        if (err) {
                            console.log('Error uploading file:', err);
                            res.send({ 'message': err })
                        } else {
                            console.log('Upload success at:', data.Location);
                            res.send({ 'message': data.Location })
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    post_registro: post_registro,
}