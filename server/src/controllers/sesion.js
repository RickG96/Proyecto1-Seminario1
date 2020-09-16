const awsKeys = require('../conexion/conexion');
const AWS = require('aws-sdk');
const s3 = new AWS.S3(awsKeys.s3);
var rekognition = new AWS.Rekognition(awsKeys.rekognition);

//imagesemi1proc
const post_registro = (req, res) => {
    let body = req.body;
    let name = body.name;
    let base64String = body.base64;

    //Decodificar imagen 
    let imagenDecodificada = Buffer.from(base64String, 'base64');

    //parametros para s3 
    let bucketname = 'imagesemi1proc';
    let filepath = `images/${name}`;
    var uploadParamsS3 = {
        Bucket: bucketname,
        Key: filepath,
        Body: imagenDecodificada,
        ACL: 'public-read',
    };

    s3.upload(uploadParamsS3, function sync(err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': 'failed' })
        } else {
            console.log('Upload success at:', data.Location);
            res.send({ 'message': 'uploaded' })
        }
    });


}

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
        if (err){
            res.send({ 'message': err })
            console.log(err, err.stack); // an error occurred
        }else{
            res.send({ 'message': data }) 
            console.log(data);           // successful response
        }
    });
}

module.exports = {
    post_registro: post_registro,
    post_comparar: post_comparar
}