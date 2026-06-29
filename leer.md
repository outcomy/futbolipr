Subí esta carpeta como contenido público del sitio:
D:\APP_Maristas_Stuff\APP_Maristas_codex\deploy\public_html
Si Hostinger lee el repo completo desde GitHub, tenés dos opciones:
Configurar en Hostinger el directorio público como:
deploy/public_html

Si Hostinger no deja elegir carpeta, entonces en GitHub conviene que el contenido de deploy/public_html quede en la raíz del repo.

Pasos exactos
Subí a GitHub la carpeta completa:
D:\APP_Maristas_Stuff\APP_Maristas_codex

En Hostinger, conectá ese repo.

Si te pregunta “publish directory” o “directorio público”, poné:
deploy/public_html

Confirmá que queden publicados estos archivos:
index.html
assets/
data/db.json
api/

Entrá al dominio y probá primero en ventana incógnito.

Importante: en esta versión los equipos/jugadores/logos quedan como base inicial publicada. Pero si un administrador cambia cosas desde la web, todavía no queda compartido para todos hasta conectar el guardado online con api/save.php. Esa parte está preparada, pero no activada aún.
