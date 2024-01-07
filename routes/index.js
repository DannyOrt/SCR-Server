// Importación de módulos y funciones necesarias
import { Router } from "express"; // Router de Express para definir rutas
import { scrapLastSismo, scrapTenLastSismos } from "../utilidades/scrap.js"; // Funciones para obtener datos de sismos

// Creación de routers para diferentes rutas
const sismoRouter = Router(), // Router para manejar rutas relacionadas con el último sismo
  listSismosRouter = Router(); // Router para manejar rutas relacionadas con la lista de sismos

// Ruta para obtener información sobre el último sismo
sismoRouter.get("/", async (req, res) => {
  try {
    const lastSismo = await scrapLastSismo(); // Obteniendo el último sismo mediante scraping

    // Filtramos los datos para obtener sismos del día actual
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const dataToday = lastSismo.date === todayString;

    // Verificar si hay datos disponibles para el día actual
    if (!dataToday) {
      res.status(404).json({ message: "No hay datos" });
      return;
    }

    // Filtramos por los sismos de magnitud mayor o igual a 3
    const dataMagnitude = lastSismo.mag >= 3;

    // Verificar si hay sismos con la magnitud especificada
    if (!dataMagnitude) {
      res.status(404).json({ message: "No hay datos" });
      return;
    }

    // Filtrar si el sismo ocurrió en la hora actual con un margen de 2 minutos
    const hour = today.getHours();
    const minute = today.getMinutes();
    const [cleanHour, cleanMinute] = lastSismo.time.split(":");
    const dataHour = hour === parseInt(cleanHour);
    const dataTime = dataHour && minute - parseInt(cleanMinute) <= 2;

    // Verificar si hay sismos en el rango de tiempo especificado
    if (!dataTime) {
      res.status(404).json({ message: "No hay datos" });
      return;
    }

    // Enviar los datos del sismo si pasan todos los filtros
    res.status(200).json(lastSismo);
  } catch (e) {
    // Manejo de errores durante la obtención de datos
    console.log(e);
    res.status(404).json({ message: "No hay datos" });
  }
});

// Ruta para obtener una lista de los últimos diez sismos
listSismosRouter.get("/", async (req, res) => {
  try {
    const listSismos = await scrapTenLastSismos(); // Obteniendo los últimos diez sismos

    // Enviar la lista de sismos
    res.status(200).json(listSismos);
  } catch (e) {
    // Manejo de errores durante la obtención de datos
    console.log(e);
    res.status(404).json({ message: "No hay datos" });
  }
});

// Exportar los routers como un módulo
const routes = {
  sismoRouter,
  listSismosRouter,
};

export default routes;
