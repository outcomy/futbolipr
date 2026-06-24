# APP Maristas

Web app de Villa Maristas, temporada 2026. Esta version funciona como sitio estatico y puede publicarse directamente en Hostinger.

## Usuarios de prueba

- Usuario comun: `pablo pellizzoni` / `vale292408`
- Administrador: `administrador` / `admin2026`
- Organizador: `organizador` / `villa2026`

## Estructura principal

- `index.html`: entrada de la web.
- `src/`: codigo de la app, estilos y datos iniciales.
- `assets/`: imagenes reemplazables por carpeta.
- `api/ads.php`: lectura automatica de publicidades en Hostinger.
- `scripts/dev-server.js`: servidor local simple para probar.

## Probar local

```powershell
npm run dev
```

Abrir `http://localhost:4173/`.

## Publicar

Las instrucciones completas para GitHub, Hostinger y FTP estan en [DEPLOY.md](./DEPLOY.md).

No existe un paso de compilacion. Hostinger debe publicar la raiz del repositorio, donde se encuentra `index.html`.

## Assets reemplazables

Mantener los mismos nombres para reemplazar imagenes sin tocar codigo:

- Publicidades: `assets/ads/`
- Fondo: `assets/backgrounds/fondo.png`
- Banner principal: `assets/backgrounds/hero-main.png`
- Logo Villa: `assets/logos/villa-maristas.png`
- Logo Outcomy footer: `assets/logos/outcomy.png`
- Logo Outcomy impresion: `assets/logos/outcomy-print.png`

## Importante

Las cuentas y datos de esta version se almacenan en el navegador con `localStorage`. Antes de cargar datos reales o habilitar acceso publico definitivo se necesitara autenticacion de servidor y una base de datos.
