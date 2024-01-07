// Importación de módulos necesarios
import express from "express"; // Express para crear el servidor y manejar rutas
import { createServer } from "http"; // Módulo HTTP para crear un servidor HTTP
import { Server as WebSocketServer } from "socket.io"; // Socket.io para WebSocket
import Routes from "./routes/index.js"; // Importación de rutas definidas en otro archivo

// Creación de una instancia de Express
const app = express();
const port = process.env.PORT || 8080; // Definición del puerto de escucha

// Configuración de rutas
app.use("/api/sismo", express.json(), Routes.sismoRouter); // Ruta para manejar sismos
app.use("/api/listSismos", express.json(), Routes.listSismosRouter); // Ruta para manejar listado de sismos

// Crear un servidor HTTP para Express
const httpServer = createServer(app); // Creación del servidor HTTP basado en la aplicación Express

// Configurar Socket.io con el servidor HTTP
// Inicialización del servidor WebSocket con configuración de CORS
const io = new WebSocketServer(httpServer, {
  cors: {
    origin: "*", // Permite cualquier origen (ajustar según necesidad)
    methods: ["GET", "POST"], // Métodos HTTP permitidos para CORS
  },
});

// Configuración de Socket.io para manejar eventos WebSocket
io.on("connection", (socket) => {
  // Evento de conexión de un usuario
  console.log("a user connected", socket.id);

  // Manejar la unión a una sala
  socket.on("join", (room) => {
    console.log(`user ${socket.id} joined ${room}`);
    socket.join(room);
  });

  // Manejar el envío de mensajes
  socket.on("message", (room, msg) => {
    io.to(room).emit("message", msg); // Reenvío del mensaje a la sala correspondiente
    console.log("message:", msg);
    console.log("room:", room);
  });

  // Manejar la desconexión de un usuario
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Iniciar el servidor para escuchar en el puerto configurado
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`); // Mensaje de confirmación de inicio del servidor
});
