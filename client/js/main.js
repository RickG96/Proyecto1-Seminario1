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

nuevoGrupo = function() {
    let idGrupo = document.getElementById("grupoId").value;
    
    if(idGrupo != "" && imgBase64 != "") {
        axios.post('https://mc8lu3qkh1.execute-api.us-east-2.amazonaws.com/V1/asistencia/insertar', {
            id: idGrupo,
            base64: imgBase64
        })
        .then(response => {
            alert('Grupo creado con éxito!');
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

getImager64G = function() {
    let inputImg = document.getElementById('inputGrupo');

    let file = inputImg.files[0];
    reader = new FileReader();

    reader.onloadend = function() {
        imgBase64 = reader.result.split(",")[1];
        console.log(imgBase64);
    }

    reader.readAsDataURL(file);
}

let urlImg = "https://imagesemi1proc.s3.us-east-2.amazonaws.com/";

getEstudiantes = function() {
    axios.get('http://localhost:3000/estudiante/listado')
        .then(res => {
            console.log(res.data.Items);
            
            
            for(i = 0; i < res.data.Items.length; i++) {
                let divEstudiantes = document.getElementById('estudiantes');
                let nuevo = document.createElement('div');
                nuevo.innerHTML = 
                    `<div class="col" style="padding-top: 15px">
                        <div class="card" style="width: 15rem;">
                            <img src="${ urlImg + res.data.Items[i].image.S }" class="card-img-top" style="height: 13rem" alt="...">
                            <div class="card-body">
                                <p class="card-text">${res.data.Items[i].id.S}</p>
                            </div>
                        </div>
                    </div>`;
                    divEstudiantes.appendChild(nuevo);
            }
            
        })
        .catch(err => {
            console.log(err);
        })
}

let urlImgGrp = "https://imagesemi1proc.s3.us-east-2.amazonaws.com/";

getGrupos = function() {
    axios.get('https://mc8lu3qkh1.execute-api.us-east-2.amazonaws.com/V1/asistencia/imagen')
        .then(res => {
            console.log(res.data);
            
            
            for(i = 0; i < res.data.length; i++) {
                let divEstudiantes = document.getElementById('grupos');
                let nuevo = document.createElement('div');
                nuevo.innerHTML = 
                    `<div class="col" style="padding-top: 15px">
                        <div class="card" style="width: 15rem;">
                            <img src="${ urlImgGrp + res.data[i].S }" class="card-img-top" style="height: 13rem" alt="...">
                            <div class="card-body">
                                <p class="card-text">Grupo ${ i }</p>
                            </div>
                        </div>
                    </div>`;
                    divEstudiantes.appendChild(nuevo);
            }
            
        })
        .catch(err => {
            console.log(err);
        })
}

getDatos = function() {
    getGrupos();
    getEstudiantes();
}