const axios = require('axios');

login = function() {
    let user = document.getElementById("usuario").value;
    let password = document.getElementById("contrasenia").value;

    let ingreso = {
        usuario: user,
        contrasenia: password
    }

    axios.post('http://localhost:3000/iniciosesion', ingreso)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        })
}

registro = function() {
    let password1 = document.getElementById("registroPassword1").value;
    let password2 = document.getElementById("registroPassword2").value;

    if(password1 === password2) {
        let user = document.getElementById("registroUsuario").value;

        let nuevoUsuario = {
            usuario: user,
            contrasenia: password1
        }

        axios.post('http://localhost:3000/nuevousuario', nuevoUsuario)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            })
    } else {
        alert("Las contraseñas no coinciden 😐");
    }
}