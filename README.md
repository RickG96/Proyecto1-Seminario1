# Proyecto 1 de Seminario de Sistemas

### Grupo 27

 - Ricardo Antonio Alvarado Ramirez - 201603157
 - Carlos Antonio Campaneros Benito - 201612274

## Herramientas utilizadas

 - Api Server
	 - NodeJs v 14.3
	 - NMP 6.14.8
	 - Express 4.17
	 - aws-sdk 2.752.0
	 - dynamoDB

 - Api Serveless
	 - HTML
	 - CSS
	 - JS

## Usuarios IEM

 - **userdynamo:** usuario con el que se accede a la base de datos.
 - **userrekognition:** usuario con el que se accede al servicio rekognition de aws.
 - **users3:** usuario que permite subir las fotos al bucket de S3

## Listado de puertos e instancias

 - **EC2-1:** puertos 22 y 3000
 - **EC2-2:** puertos 22 y 3000
 - **balanceador de carga:** puerto 3000