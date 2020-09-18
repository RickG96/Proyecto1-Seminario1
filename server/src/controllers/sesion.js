const awsKeys = require('../conexion/conexion');
var uuid = require('uuid');

const get_login = (req, res) => {
    let AWS = require('aws-sdk');
    AWS.config.update(awsKeys.dinamo);
    let docClient = new AWS.DynamoDB.DocumentClient();
    let id = req.query.id;
    let params = {
        TableName: "Profesores",
        Key: {
            "id": id
        }
    }
    docClient.get(params, function (err, data) {
        if (err) {
            res.json(err);
        } else {
            res.json(data.Location);
        }
    });
}

const post_login = (req, res) => {
    let AWS = require('aws-sdk');
    let rekognition = new AWS.Rekognition(awsKeys.rekognition);
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
    rekognition.searchFacesByImage(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': err })
        } else {
            console.log('Upload success at:', data);
            try {
                if(data.FaceMatches[0].Similarity > 85){
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
    //conexion aws
    let AWS = require('aws-sdk');
    //fin de conexion 
    let name = req.body.name;
    let password = req.body.password;
    let base64String = req.body.base64;
    //Decodificar imagen 
    if (base64String === "") {
        AWS.config.update(awsKeys.dinamo);
        let docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "Profesores",
            Item: {
                "id": name,
                "password": password
            }
        }
        docClient.put(params, function (err, data) {
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
        let s3 = new AWS.S3(awsKeys.s3);
        var imageId = `${uuid()}.jpg`;
        var filepath = `profesores/${imageId}`;
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
                let rekognition = new AWS.Rekognition(awsKeys.rekognition);
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
                rekognition.indexFaces(params, function (err, data) {
                    if (err) {
                        console.log('Error uploading file:', err);
                        res.send({ 'message': err })
                    } else {
                        let baseAWS = require('aws-sdk');
                        baseAWS.config.update(awsKeys.dinamo);
                        let docClient = new baseAWS.DynamoDB.DocumentClient();
                        var params = {
                            TableName: "Profesores",
                            Item: {
                                "id": name,
                                "password": password,
                                "image": filepath
                            }
                        }
                        docClient.put(params, function (err, data) {
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
    let AWS = require('aws-sdk');
    let rekognition = new AWS.Rekognition(awsKeys.rekognition);
    var params = {
        CollectionId: "profesores"
    };
    rekognition.createCollection(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': 'failed' })
        } else {
            console.log('Upload success at:', data.Location);
            res.send({ 'message': 'uploaded' })
        }
    });
}




/*

const post_comparar = (req, res) => {
    let body = req.body;
    let imagen1 = body.imagen1;
    let imagen2 = body.imagen2;

    var params = {
        SimilarityThreshold: 90,
        SourceImage: {
            S3Object: {
                Bucket: "imagesemi1proc",
                Name: imagen1
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: "imagesemi1proc",
                Name: imagen2
            }
        }
    };

    rekognition.compareFaces(params, function (err, data) {
        if (err) {
            res.send({ 'message': err })
            console.log(err, err.stack); // an error occurred
        } else {
            res.send({ 'message': data })
            console.log(data);           // successful response
        }
    });
} */

module.exports = {
    login: get_login,
    loginface: post_login,
    post_registro: post_registro,


    //post_comparar: post_comparar,

    eliminar: eliminar
}