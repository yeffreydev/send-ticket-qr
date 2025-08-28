

function htmlEmail(ticket,nombres) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#000000;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center" valign="top" 
            style="background-image: url('cid:bg'); background-size: cover; background-position: center;">

          <!--[if gte mso 9]>
          <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
              style="position:relative;top:0;width:675pt;height:500pt;mso-position-horizontal:center;"
              src="cid:bg" />
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"
              style="position:relative;top:0;width:675pt;height:500pt;mso-position-horizontal:center;">
            <v:fill type="frame" color="#000000" color2="#000000" opacity="60%" />
            <v:textbox inset="0,0,0,0">
          <![endif]-->

          <!-- Contenido encima -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" role="presentation" 
                 width="100%" style="max-width:900px; font-family:Arial, Helvetica, sans-serif; color:#ffffff; padding:100px 20px;">
            <tr>
              <!-- Columna izquierda -->
              <td valign="top" width="33%" style="padding:10px;">
                <img src="cid:logo" alt="logo" width="300" height="130" 
                     style="display:block; margin-bottom:10px;">
                <p style="font-size:20px; margin:0; color:#ffffff;">
                  September, 13 Th <span style="color: purple;">|</span> Sat 
                  <span style="color: purple;">|</span> 11 AM
                </p>
                <p style="font-size:20px; margin:0; color:#ffffff;">
                  Ameron Zurich Bellerive au Lac
                </p>
              </td>

              <!-- Columna central -->
              <td valign="middle" width="33%" align="center" style="padding:10px;">
                <p style="font-size:40px; font-weight:bold; margin:0; color:#ffffff;">${nombres}</p>
                <p style="font-size:20px; margin:10px 0; color:#ffffff;">
                  N° Tickets: <b>${ticket}</b>
                </p>
                <p style="font-size:18px; margin:5px 0; color:#ffffff;">Open Bar</p>
              </td>

              <!-- Columna derecha (QR) -->
              <td valign="middle" width="33%" align="center" style="padding:10px;">
                <img src="cid:qr" alt="qr" width="220" height="220" style="display:block;">
              </td>
            </tr>
          </table>

          <!--[if gte mso 9]>
            </v:textbox>
          </v:rect>
          <![endif]-->

        </td>
      </tr>
    </table>
  </body>
</html>



`;
}

module.exports = htmlEmail;