# Publicacion de APP_Maristas

## 1. Carpeta correcta

La raiz del repositorio debe ser exactamente:

```text
D:\Codex\New project\01_PROYECTOS_APPS\APP_Maristas
```

Al abrir el repositorio en GitHub deben verse directamente `index.html`, `src`, `assets`, `api` y `package.json`. No subir la carpeta padre `01_PROYECTOS_APPS`.

## 2. Publicar en GitHub Desktop

1. Abrir GitHub Desktop.
2. Elegir **File > Add local repository**.
3. Seleccionar `D:\Codex\New project\01_PROYECTOS_APPS\APP_Maristas`.
4. Si solicita crear el repositorio, elegir **Create a repository here** sin cambiar la carpeta.
5. Escribir un resumen, por ejemplo `Version inicial APP Maristas`.
6. Pulsar **Commit to main**.
7. Pulsar **Publish repository**.

El repositorio puede ser privado si Hostinger tiene autorizacion para leerlo.

## 3. Conectar Hostinger con GitHub

1. En Hostinger abrir el sitio y entrar a **Git** o **Git deployments**.
2. Conectar el repositorio de GitHub.
3. Elegir la rama `main`.
4. Usar como directorio de publicacion `public_html`.
5. No indicar comando de build: esta aplicacion se publica directamente.
6. Ejecutar el despliegue.

El archivo `index.html` debe quedar directamente dentro de `public_html`, no dentro de otra carpeta `APP_Maristas`.

## 4. Publicacion manual alternativa

Si se usa el administrador de archivos o FTP, copiar a `public_html`:

```text
index.html
.htaccess
assets/
src/
api/
```

Los archivos `README.md`, `DEPLOY.md`, `package.json` y `scripts/` se conservan en GitHub, pero no son necesarios para servir la web.

## 5. Publicidades

En Hostinger, `api/ads.php` lee automaticamente todas las imagenes PNG, JPG, JPEG y WebP colocadas dentro de `assets/ads`. La imagen institucional sigue apareciendo primero y luego las publicidades se ordenan aleatoriamente en cada visita.

## 6. Validacion previa

```powershell
npm run check
npm run dev
```

Abrir `http://localhost:4173/` y comprobar las tres cuentas de prueba.

## Aviso sobre esta version

La autenticacion y los datos se guardan actualmente en el navegador mediante `localStorage`. Sirve para esta prueba publicada, pero no es autenticacion segura multiusuario. Antes de usar datos reales se necesitara conectar la app a una base de datos y autenticacion del servidor.
