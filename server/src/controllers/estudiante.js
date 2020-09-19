const awsKeys = new require('../conexion/conexion');
const AWS = require('aws-sdk');
const S3 = new AWS.S3(awsKeys.S3);
const Rekognition = new AWS.Rekognition(awsKeys.Rekognition);
const DynamoDB = new AWS.DynamoDB(awsKeys.DynamoDB); 
var uuid = require('uuid');

const post_registro = (req, res) => {
    //fin de conexion 
    let id = req.body.id;
    let base64String = req.body.base64;
    //Decodificar imagen 
    let imagenDecodificada = Buffer.from(base64String, 'base64');
    //Bucket 
    var imageId = `${uuid()}.jpg`;
    var filepath = `estudiantes/${imageId}`;
    var uploadParamsS3 = {
        Bucket: 'imagesemi1proc',
        Key: filepath,
        Body: imagenDecodificada,
        ACL: 'public-read',
    };
    S3.upload(uploadParamsS3, function sync(err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': err })
        } else {
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
            Rekognition.indexFaces(params, function (err, data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': err })
                } else {
                   var params = {
                        TableName: "Estudiantes",
                        Item: {
                            "id": { S: id },
                            "image": {S: filepath} 
                        }
                    }
                    DynamoDB.putItem(params, function (err, data) {
                        if (err) {
                            console.log('Error uploading file:', err);
                            res.send({ 'message': err })
                        } else {
                            console.log('Upload success at:', data);
                            res.send({ 'message': data })
                        }
                    });
                }
            });
        }
    });
}

const get_listado = (req, res) => {
    let params = {
        TableName: "Estudiantes",
    }
    DynamoDB.scan(params, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data); 
        }
    });
}

module.exports = {
    post_registro: post_registro,
    get_listado: get_listado
}