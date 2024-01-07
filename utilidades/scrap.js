// Importación de Puppeteer, una biblioteca para controlar navegadores Headless Chrome/Chromium
import puppeteer from "puppeteer";

// Función para realizar web scraping y obtener el último sismo reportado
export const scrapLastSismo = async () => {
  // Lanzamiento del navegador con opciones específicas
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || null, // Ruta del ejecutable de Chrome, si está disponible en env
    headless: "new", // Ejecutar en modo headless (sin interfaz gráfica)
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Argumentos adicionales para la ejecución segura
  });

  // Abrir una nueva página en el navegador
  const page = await browser.newPage();

  // Navegar a la página del SSN
  await page.goto("http://www.ssn.unam.mx/");

  // Extraer información del último sismo usando la función evaluate de Puppeteer
  const lastSismo = await page.evaluate(() => {
    // Selección de elementos del DOM y extracción de datos
    const date = [...document.querySelectorAll(".date")];
    const time = [...document.querySelectorAll(".time")];
    const mag = [...document.querySelectorAll(".mag")];
    const episub = [...document.querySelectorAll(".epi-sub")];
    const loc = [...document.querySelectorAll(".loc")];
    const prof = [...document.querySelectorAll(".prof")];

    // Limpieza y estructuración de los datos extraídos
    const cleanDate = date[1].innerText.split("Fecha:  ")[1];
    const cleanTime = time[0].innerText.split("Hora:  ")[1];
    const cleanMag = mag[0].innerText.split("MAGNITUD: ")[1];
    const cleanlat = episub[1].innerText.split("Latitud:  ")[1];
    const cleanlon = episub[2].innerText.split("Longitud:  ")[1];
    const cleanloc = loc[0].innerText.split("LOCALIZACIÓN: ")[1];
    const cleanprof = prof[0].innerText.split("PROFUNDIDAD: ")[1];

    // Devolución de un objeto con los datos del último sismo
    return {
      date: cleanDate,
      time: cleanTime,
      mag: cleanMag,
      lat: cleanlat,
      lon: cleanlon,
      loc: cleanloc,
      prof: cleanprof,
    };
  });

  // Cerrar el navegador
  await browser.close();

  // Devolver los datos del último sismo
  return lastSismo;
};

// Función para realizar web scraping y obtener los últimos diez sismos reportados
export const scrapTenLastSismos = async () => {
  // Lanzamiento del navegador con opciones específicas
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || null, // Ruta del ejecutable de Chrome, si está disponible en env
    headless: "new", // Ejecutar en modo headless (sin interfaz gráfica)
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Argumentos adicionales para la ejecución segura
  });

  // Abrir una nueva página en el navegador
  const page = await browser.newPage();

  // Navegar a la página de sismos recientes del SSN
  await page.goto("http://www.ssn.unam.mx/sismicidad/ultimos/");

  // Extraer información de los últimos diez sismos
  const list = await page.evaluate(() => {
    const tr = document.getElementsByClassName("1days"); // Selección de filas de la tabla de sismos

    // Mapeo de cada fila a un objeto con los datos de cada sismo
    return Array.from(tr).map((row, index) => {
      return {
        id: ++index,
        magnitud: row.getElementsByClassName("latest-mag")[0].innerText.trim(),
        fecha: row.getElementsByClassName("text-center")[1].innerText.trim(),
        epicentro: row.getElementsByTagName("b")[0].innerText.trim(),
        latitud: row.getElementsByTagName("span")[2].innerText.trim(),
        longitud: row.getElementsByTagName("span")[3].innerText.trim(),
        profundidad: row
          .getElementsByClassName("text-center")[2]
          .innerText.trim(),
      };
    });
  });

  // Cerrar el navegador
  await browser.close();

  // Devolver la lista de los últimos diez sismos
  return list;
};
