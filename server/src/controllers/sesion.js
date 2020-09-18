const awsKeys = require('../conexion/conexion');

const get_login = (req, res) => {
    const AWS = require('aws-sdk');
    AWS.config.update(awsKeys.dinamo);
    const docClient = new AWS.DynamoDB.DocumentClient(); 

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
            res.json(data);
        }
    });
}

const post_login = (req, res) => {/*
    const AWS = require('aws-sdk');

    let image = req.body.image;
    let imagenDec = Buffer.from(image, 'base64');
    var params = {
    };
    rekognition.listCollections(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
            res.send({ 'message': err })
        } else {
            console.log('Upload success at:', data.Location);
            res.send({ 'message': data.Location })
        }
    }); */ 
}


const post_registro = (req, res) => {
    //conexion aws
    const AWS2 = require('aws-sdk');
    AWS2.config.update(awsKeys.dinamo);
    const docClient = new AWS2.DynamoDB.DocumentClient();
    //fin de conexion 
    let name = req.body.name;
    let password = req.body.password;
    let base64String = req.body.base64;
    //Decodificar imagen 
    if (base64String === "") {
        AWS.config.update(awsKeys.dinamo);
        const docClient = new AWS.DynamoDB.DocumentClient(); 
        var params = {
            TableName: "Profesores", 
            Item: {
                "id": name,
                "password": password
            }
        }
        docClient.put(params,function(err,data){
            if (err) {
                console.log('Error uploading file:', err);
                res.send({ 'message': 'failed' })
            } else {
                console.log('Upload success at:', data.Location);
                res.send({ 'message': 'uploaded' })
            }
        }); 
    } else {
        res.json({"falta":"true"})
        /*
        const s3 = new AWS.S3(awsKeys.s3);
        const rekognition = new AWS.Rekognition(awsKeys.rekognition);* 


        /* 
        let imagenDecodificada = Buffer.from(base64String, 'base64');

        //parametros para s3 
        let bucketname = 'imagesemi1proc';
        let filepath = `estudiantes/${name}`;
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
        }); */
    }


}


//imagesemi1proc
//https://www.browserling.com/tools/image-to-base64 
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html

const eliminar = (req, res) => {
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