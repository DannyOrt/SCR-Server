# SRC-Server

Proyecto está diseñado para proporcionar información en tiempo real sobre sismos recientes, utilizando web scraping para obtener datos del Servicio Sismológico Nacional de la UNAM. A continuación, se detalla la estructura y funcionalidad de los archivos principales del proyecto.

## Estructura del Proyecto

El proyecto consta de tres archivos principales:

Servidor Principal (index.js): Este archivo contiene la configuración y el lanzamiento del servidor principal utilizando Express y Socket.io. Establece la conexión con el cliente, maneja rutas API REST para obtener datos sobre sismos, y configura el servidor para utilizar WebSockets.

## Rutas (routes.js):
Define las rutas API REST para interactuar con los datos de sismos. Hay dos rutas principales:

- `/api/sismo:` Proporciona datos sobre el último sismo registrado.
- `/api/listSismos:` Devuelve una lista de los últimos dieciséis sismos.

## Web Scraping (scrap.js)
Contiene funciones para realizar web scraping en la página del Servicio Sismológico Nacional de la UNAM. Utiliza Puppeteer para extraer información sobre el último sismo (scrapLastSismo) y los últimos dieciséis sismos (scrapTenLastSismos).

## Funcionamiento
El servidor principal se inicia con Express y se configura para usar CORS, analizar JSON en solicitudes entrantes y servir archivos estáticos. Se crean dos rutas principales utilizando las funciones definidas en routes.js. Además, se configura un servidor WebSocket para comunicaciones en tiempo real.

