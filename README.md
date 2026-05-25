# React + TypeScript + Vite

Logger Albion Online es una herramienta web desarrollada con React y TypeScript, diseñada específicamente para facilitar la gestión del botín (loot) a los jugadores de Albion Online.

Su propósito principal es automatizar la visualización, comparación y consolidación del loot obtenido del suelo por cualquier scout o grupo. La aplicación funciona procesando los archivos CSV generados y exportados por la StatisticsAnalysisTool, de manera que toma los registros en bruto, identifica los objetos por su ID y suma sus cantidades para entregar un balance final limpio y fácil de interpretar.

## 🚀 Instrucciones de Uso
Para utilizar la aplicación, sigue estos pasos:

Exportar los datos: Utiliza la StatisticsAnalysisTool en Albion Online para generar el registro de tu sesión y expórtalo en formato JSON (Recomendable) o CSV.

Cargar el archivo: Abre Logger Albion Online y utiliza la interfaz para subir el archivo CSV que acabas de generar.

Procesamiento automático: La aplicación leerá el documento de forma instantánea. Si encuentra múltiples entradas para un mismo objeto, sumará las cantidades automáticamente.

Visualizar resultados: Revisa el panel de resultados final, donde podrás comparar el botín total obtenido, facilitando así su análisis e inspeccion.

## ✨ Funcionalidades Principales
Procesamiento de Archivos: Capacidad para leer y procesar rápidamente los documentos exportables nativos de la aplicacion StatisticsAnalysisTool.

Agrupación Inteligente de Ítems: El algoritmo detecta ítems duplicados en el registro (basado en el ID único del objeto) y consolida las cantidades, evitando que tengas que sumar manualmente.

Visualización de Datos Clara: Interfaz de usuario intuitiva que muestra el resultado final del loot de forma organizada y comparativa.

Stack Tecnológico Moderno: Construida sobre React y Vite para una carga extremadamente rápida, y fuertemente tipada con TypeScript para garantizar un procesamiento de datos sin errores de cálculo o lectura.

## Recuerda que se encuentra desplegado y puedes acceder desde este link [Logger.app](https://logger-albion-online.vercel.app)

## 🛠️ Guia de instalacion en ambiente local
Si deseas clonar este proyecto y probarlo en tu entorno local, asegúrate de tener [Node.js](https://nodejs.org/) instalado y sigue estos pasos:
1. **Clona el repositorio:**
```
   bash
   git clone https://github.com/jose1409/Logger-Albion-Online.git
   cd Logger-Albion-Online
```
2. **Instala las dependencias:**
```
   npm install
```
3. **Inicia el servidor de desarrollo:**
```
   npm run dev
```
