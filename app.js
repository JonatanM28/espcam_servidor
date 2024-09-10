document.getElementById('capture-btn').addEventListener('click', async function () {
    const esp32Url = 'http://<IP_ESP32>/capture'; // Coloca la IP de tu ESP32-CAM

    try {
        // Hacer una solicitud al servidor ESP32-CAM
        const response = await fetch(esp32Url);
        const html = await response.text();

        // Extraer la imagen en Base64
        const base64Image = extractBase64Image(html);
        const coordinates = extractCoordinates(html);

        // Mostrar la imagen en la interfaz
        document.getElementById('captured-image').src = `data:image/jpeg;base64,${base64Image}`;

        // Mostrar las coordenadas en la interfaz
        document.getElementById('lat').textContent = coordinates.lat;
        document.getElementById('lon').textContent = coordinates.lon;
        document.getElementById('alt').textContent = coordinates.alt;

        // Guardar la imagen en el teléfono
        saveImage(base64Image, coordinates.lat, coordinates.lon);

    } catch (error) {
        console.error('Error al capturar la imagen:', error);
    }
});

// Función para extraer la imagen en Base64 del HTML devuelto por el ESP32-CAM
function extractBase64Image(html) {
    const startIndex = html.indexOf('data:image/jpeg;base64,') + 23;
    const endIndex = html.indexOf("'", startIndex);
    return html.substring(startIndex, endIndex);
}

// Función para extraer las coordenadas GPS del HTML devuelto por el ESP32-CAM
function extractCoordinates(html) {
    const latIndex = html.indexOf("Latitud:") + 8;
    const lonIndex = html.indexOf("Longitud:") + 9;
    const altIndex = html.indexOf("Altitud:") + 8;

    const lat = html.substring(latIndex, html.indexOf("<", latIndex)).trim();
    const lon = html.substring(lonIndex, html.indexOf("<", lonIndex)).trim();
    const alt = html.substring(altIndex, html.indexOf(" ", altIndex)).trim();

    return { lat, lon, alt };
}

// Función para descargar la imagen al dispositivo
function saveImage(base64Image, lat, lon) {
    const a = document.createElement('a');
    const fileName = `photo_${lat}_${lon}.jpg`;
    a.href = `data:image/jpeg;base64,${base64Image}`;
    a.download = fileName;
    a.click();
}
