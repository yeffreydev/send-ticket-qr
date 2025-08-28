const QRCode = require("qrcode");

async function generarQR(nombres, nro) {
 
  const qrData = `NOMBRES: ${nombres}\nNRO: ${nro}`;

  // Generar QR en memoria como Buffer (PNG)
  const qrBuffer = await QRCode.toBuffer(qrData, {
    type: "png",
    width: 400,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return qrBuffer;
}

module.exports = generarQR;
