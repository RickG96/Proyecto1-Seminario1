const awsKeys = new require('../conexion/conexion');
const AWS = require('aws-sdk');
const S3 = new AWS.S3(awsKeys.S3);
const Rekognition = new AWS.Rekognition(awsKeys.Rekognition);
const DynamoDB = new AWS.DynamoDB(awsKeys.DynamoDB);
var uuid = require('uuid');

const post_registro = (req, res) => {
    let params = {
        TableName: "Estudiantes",
    }
    DynamoDB.scan(params, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            let id = req.body.id;
            let imagenDecodificada = Buffer.from(req.body.base64, 'base64');
            var filepath = `asistencia/${uuid()}.jpg`;
            var uploadParamsS3 = {
                Bucket: 'imagesemi1proc',
                Key: filepath,
                Body: imagenDecodificada,
                ACL: 'public-read',
            };
            S3.upload(uploadParamsS3, function sync(err, S3data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': err })
                } else {
                    var params = {
                        TableName: "Asistencia",
                        Item: {
                            "id": { S: id },
                            "image": { S: filepath },
                            "estudiantes": { L: [] }
                        }
                    }
                    DynamoDB.putItem(params, function (err, Ddata) {
                        if (err) {
                            console.log('Error uploading file:', err);
                            res.send({ 'message': err })
                        } else {
                            try {
                                data.Items.map(e => {
                                    var params = {
                                        SimilarityThreshold: 90,
                                        SourceImage: {
                                            S3Object: {
                                                Bucket: "imagesemi1proc",
                                                Name: e.image.S
                                            }
                                        },
                                        TargetImage: {
                                            Bytes: imagenDecodificada
                                        }
                                    };
                                    Rekognition.compareFaces(params, function (err, data) {
                                        if (err) {
                                            console.log(error);
                                        } else {
                                            //update :( 
                                            console.log({ "nombre": e.id.S, "FaceMatches": data.FaceMatches });
                                            if(data.FaceMatches.length > 0 ){
                                                var params = {
                                                    TableName: "Asistencia",
                                                    Key: { 'id' : {'S': id}}, 
                                                    UpdateExpression: 'SET estudiantes = list_append(estudiantes,:new_est)',
                                                    ExpressionAttributeValues: {
                                                        ':new_est': {
                                                            'L': [{'S':e.id.S}]
                                                        }
                                                    },
                                                    ReturnValues: 'UPDATED_NEW'
                                                }
                                                DynamoDB.updateItem(params, function(err,D2data){

                                                }); 
                                            }
                                        }
                                    });
                                });
                                res.json({ "response": "true" });
                            } catch (error) {
                                res.json(error);
                            }
                        }
                    });
                }
            });
        }
    });
}

const get_asistencia = (req, res) => {
    let params = {
        TableName: "Asistencia",
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
    get_asistencia: get_asistencia
}