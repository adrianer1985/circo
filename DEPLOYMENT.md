# Publicación de Circo en GitHub Pages

Decisión del usuario (12/10/2026): publicar desde GitHub Pages y mantener los dominios y el correo en Arsys.

## Estado
- Código estático en la rama main; no necesita compilación.
- CNAME declara www.circochucherias.com.
- .nojekyll permite publicar los archivos estáticos sin Jekyll.
- Activación de Pages, configuración del dominio en Settings y DNS de Arsys pendientes de verificación. Estos archivos no activan por sí solos el servicio.
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
