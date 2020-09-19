const axios = require('axios');

login = function() {
    let user = document.getElementById("usuario").value;
    let password = document.getElementById("contrasenia").value;

    axios.get('http://localhost:3000/sesion/login?id=' + user)
        .then(response => {
            if(response.data.password === password) {
                alert('Bienvenido: ' + response.data.id + ' 😉');
                window.location.href = "landing.html";
            } else {
                alert("Contraseña no valida 😐");
            }
        })
        .catch(error => {
            alert("Error de ingreso 😐");
        })
}

registro = function() {
    let password1 = document.getElementById("registroPassword1").value;
    let password2 = document.getElementById("registroPassword2").value;

    if(password1 === password2) {
        let user = document.getElementById("registroUsuario").value;

        axios.post('http://localhost:3000/sesion/registro', {
                name: user,
                password: password1,
                base64: ""
            })
            .then(response => {
                console.log(response);
                if(response.data.message == 'uploaded') {
                    alert("Creado con exito");
                    window.location.href = "index.html";
                } else {
                    alert("Error 😐");
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        alert("Las contraseñas no coinciden 😐");
    }
}

desplegar = function() {
    document.getElementById("camara").style.display = 'block';
    document.getElementById("btnDesplegar").style.display = 'none';
}


registroImagen = function(canvas, user, password1) {
    axios.post('http://localhost:3000/sesion/registro', {
                name: user,
                password: password1,
                base64: canvas
            })
            .then(response => {
                console.log(response);
                if(response.data.message == 'uploaded') {
                    alert("Creado con exito");
                    window.location.href = "index.html";
                } else {
                    alert("Error 😐");
                }
            })
            .catch(error => {
                console.error(error);
            });
}

loginImagen = function(canvas) {
    axios.post('http://localhost:3000/sesion/loginface', {
        image: canvas
    })
    .then(response => {
        console.log(response)
        try {
            alert('Bienvenido: ' + response.data.respuesta.FaceMatches[0].Face.ExternalImageId + ' 😉');
            window.location.href = "landing.html";
        } catch(error) {
            alert("Error usuario desconocido 😐");
        }
    })
    .catch(error => {
        console.error(error);
    })
}

var imgBase64 = "";

nuevoEstudiante = function() {
    let idEstudiante = document.getElementById("inputId").value;
    
    if(idEstudiante != "" && imgBase64 != "") {
        axios.post('http://localhost:3000/estudiante/registro', {
            id: idEstudiante,
            base64: imgBase64
        })
        .then(response => {
            alert('Estudiante creado con éxito!');
        })
        .catch(err => {
            console.log(err);
        })
    } else {
        alert('Faltan datos...');
    }
}

getImager64 = function() {
    let inputImg = document.getElementById('inputFoto');

    let file = inputImg.files[0];
    reader = new FileReader();

    reader.onloadend = function() {
        imgBase64 = reader.result.split(",")[1];
        //console.log(imgBase64);
    }

    reader.readAsDataURL(file);
}