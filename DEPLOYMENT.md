# Publicación de Circo en GitHub Pages

Decisión del usuario (12/10/2026): publicar desde GitHub Pages y mantener los dominios y el correo en Arsys.

## Estado
- Código estático en la rama main; no necesita compilación.
- CNAME declara www.circochucherias.com.
- .nojekyll permite publicar los archivos estáticos sin Jekyll.
- Pages activado desde main, /(root), con dominio www.circochucherias.com y Enforce HTTPS activado (verificado en Settings el 12/10/2026).
- https://www.circochucherias.com/ abre correctamente. Comprobados ES/EN/FR, 16 imágenes sin errores de carga y /aviso-legal/.
- Arsys: guardados los cuatro registros A y el CNAME indicados abajo, sustituyendo la IP de aparcamiento y el A de www. Conservados los registros de correo.
- Comprobado también http://circochucherias.com/: redirige a https://www.circochucherias.com/. GitHub todavía muestra un aviso DNS de www anterior al cambio a CNAME; pendiente de revalidación del proveedor.
- .es: redirección permanente 301 guardada en Arsys; comprobados http://circochucherias.es/ y http://www.circochucherias.es/ hacia HTTPS del .com.
- HTTPS de origen .es no disponible: ERR_SSL_PROTOCOL_ERROR en https://circochucherias.es/. El usuario decidió mantener únicamente la redirección HTTP y rechazó contratar Redirección segura. Eliminado el complemento del carrito; no se ha contratado ningún servicio adicional.
- Buzón info@circochucherias.com creado por el usuario y confirmado mediante el mensaje de éxito de Arsys. Webmail: https://correo.arsys.es/. IMAP: imap.serviciodecorreo.es, SSL/TLS, puerto 993. SMTP: smtp.serviciodecorreo.es, SSL/TLS, puerto 465. Usuario: dirección completa. Pendiente de acceso del usuario al webmail y prueba de envío/recepción al propio buzón, autorizada por el usuario; todavía no enviada. No se almacena la contraseña.
- Conservar Vercel durante la transición hasta verificar el dominio en GitHub Pages.

## GitHub
En Settings > Pages del repositorio adrianer1985/circo:
1. Source: Deploy from a branch.
2. Branch: main; carpeta: /(root); guardar.
3. Custom domain: www.circochucherias.com; guardar antes de apuntar los DNS a GitHub.
4. Cuando el certificado esté disponible, activar Enforce HTTPS.

El sitio usa rutas de recursos desde / y está preparado para el dominio propio. Antes de conectar el dominio, la URL temporal con /circo/ puede mostrar recursos incompletos.

## Arsys: .com
Conservar los servidores DNS actuales y todos los registros del correo (MX, SPF, DKIM y DMARC). Cambiar solamente los registros web que entren en conflicto:
| Nombre | Tipo | Destino |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | adrianer1985.github.io |

No usar un CNAME para @ ni registros comodín. Revisar registros AAAA existentes para evitar destinos anteriores. Si existen restricciones CAA, comprobar que permiten letsencrypt.org.
GitHub redirige el dominio raíz .com a www cuando ambos están correctamente configurados.

## Arsys: .es
Configurar una redirección visible permanente HTTP 301 de circochucherias.es y www.circochucherias.es a https://www.circochucherias.com/.
No usar redirección enmarcada. Verificar también HTTPS en ambos dominios .es; un registro DNS por sí solo no crea una redirección HTTP.

## Verificación final
- Portada, imágenes, estilos y scripts; ES/EN/FR.
- /aviso-legal/, /privacidad/, /cookies/ y /firma-alberto2/.
- /boceto5/ vuelve a la portada mediante una redirección estática de navegador; Pages no aplica la redirección HTTP de vercel.json.
- HTTPS válido y redirecciones del .com sin www y ambos .es.
- Correo info@circochucherias.com: enviar y recibir.
- No afirmar que está publicado o conectado hasta verificarlo.

Documentación: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
