//ver mas informacion de metodos en 
//https://gourabp17.github.io/codespace/#/aws/su4dz-qgr1y 


const AWS = require('aws-sdk'); 

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: 'AKIA4NNOQMEWLXGJJRMA',
    secretAccessKey: '9e2aWIBNLaon6LOlm3XTTHSamWcvR1hPWnuhj/q0' 
}); 

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {

    var input = {
        "id": "example-1@gmail.com", 
        "created_by": "clientUser", 
        "created_on": new Date().toString(),
        "updated_by": "clientUser", 
        "updated_on": new Date().toString(), 
        "is_deleted": false
    };
    var params = {
        TableName: "Estudiantes",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
    });
}

save();

/*
const docDynamo = new AWS.DynamoDB.DocumentClient(); 
let fetchOneByKey = function(){
    const params = {
        TableName: 'Estudiantes',
        Item: {
         id: 'Campa',
         password: 'admin123'
        }
    }; 

    docDynamo.get(params, function(err,data){
        if(err){
            console.log()
        }
    }); 
}

const saveData = async() => {
    const params = {
       TableName: 'Estudiantes',
       Item: {
        id: 'Campa',
        password: 'admin123'
       }
    }; 

    try{
        await docDynamo.put(params).promise(); 
    } catch(e){
        console.error('DynamoDB Error',e); 
    }

}; 

saveData(); 

searchFaces
compareFaces 


*/