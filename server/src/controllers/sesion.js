const awsKeys = new require('../conexion/conexion');
const AWS = require('aws-sdk');
const S3 = new AWS.S3(awsKeys.S3);
const Rekognition = new AWS.Rekognition(awsKeys.Rekognition);
const DynamoDB = new AWS.DynamoDB(awsKeys.DynamoDB);
var uuid = require('uuid');

const get_login = (req, res) => {
    let id = req.query.id;
    let params = {
        TableName: "Profesores",
        Key: {
            "id": { S: id }
        }
    }
    DynamoDB.getItem(params, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            try {
                res.json({"id":data.Item.id.S,"password":data.Item.password.S});
            } catch (error) {
                res.json({}); 
            }
        }
    });
}

const post_login = (req, res) => {
    let image = req.body.image;
    let imagenDec = Buffer.from(image, 'base64');
    var params = {
        CollectionId: "profesores",
        FaceMatchThreshold: 95,
        Image: {
            Bytes: imagenDec
        },
        MaxFaces: 1
    };
    Rekognition.searchFacesByImage(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': err })
        } else {
            console.log('Upload success at:', data);
            try {
                if (data.FaceMatches[0].Similarity > 85) {
                    res.send({ "respuesta": data });
                } else {
                    res.send({ "respuesta": "falso" });
                }
            } catch (error) {
                res.send({ "respuesta": "falso" });
            }
        }
    });
}

const post_registro = (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let base64String = req.body.base64;
    //Decodificar imagen 
    if (base64String === "") {
        var params = {
            TableName: "Profesores",
            Item: {
                "id": { S: name },
                "password": { S: password }
            }
        }
        DynamoDB.putItem(params, function (err, data) {
            if (err) {
                console.log('Error uploading file:', err);
                res.send({ 'message': err })
            } else {
                console.log('Upload success at:', data);
                res.send({ 'message': 'uploaded' })
            }
        });
    } else {
        let imagenDecodificada = Buffer.from(base64String, 'base64');
        //insertar al bucket 
        var imageId = `${uuid()}.jpg`;
        var filepath = `profesores/${imageId}`;
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
                    CollectionId: "profesores",
                    DetectionAttributes: [
                    ],
                    Image: {
                        Bytes: imagenDecodificada
                    },
                    ExternalImageId: name,
                    MaxFaces: 1,
                    QualityFilter: 'HIGH'
                }
                Rekognition.indexFaces(params, function (err, data) {
                    if (err) {
                        console.log('Error uploading file:', err);
                        res.send({ 'message': err })
                    } else {
                        var params = {
                            TableName: "Profesores",
                            Item: {
                                "id": { S: name },
                                "password": { S: password },
                                "image": { S: filepath }
                            }
                        }
                        DynamoDB.putItem(params, function (err, data) {
                            if (err) {
                                console.log('Error uploading file:', err);
                                res.send({ 'message': err })
                            } else {
                                console.log('Upload success at:', data.Location);
                                res.send({ 'message': 'uploaded' })
                            }
                        });
                    }
                });
            }
        });
    }
}


//imagesemi1proc
//https://www.browserling.com/tools/image-to-base64 
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

const eliminar = (req, res) => {
    var params = {
        CollectionId: "estudiantes"
    };
    Rekognition.createCollection(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': 'failed' })
        } else {
            console.log('Upload success at:', data.Location);
            res.send({ 'message': 'uploaded' })
        }
    });
}

module.exports = {
    login: get_login,
    loginface: post_login,
    post_registro: post_registro,
    eliminar: eliminar
}

//https://github.com/FherHerand/semi1-lab-examples-1s-2020/blob/master/NodeServer/index.js
//https://medium.com/@thianlopezz/configuraci%C3%B3n-de-ambiente-de-producci%C3%B3n-para-una-aplicaci%C3%B3n-en-node-js-9f867b464ad9