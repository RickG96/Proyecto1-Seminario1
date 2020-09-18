const axios = require('axios');

login = function() {
    let user = document.getElementById("usuario").value;
    let password = document.getElementById("contrasenia").value;

    let ingreso = {
        id: user
    }

    axios.get('http://localhost:3000/sesion/login?id=' + user)
        .then(response => {
            if(response.data.Item.password === password) {
                console.log('login');
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
            alert('bienvenido: ' + response.data.respuesta.FaceMatches[0].Face.ExternalImageId);
        } catch(error) {
            alert("Error usuario desconocido 😐");
        }
    })
    .catch(error => {
        console.error(error);
    })
}