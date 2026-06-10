# Johanna Journal

Eine private kleine Journal-App im Ivory/Gold/Gray-Look.

## Öffnen

Am einfachsten: `index.html` im Browser öffnen.

Noch schöner lokal mit kleinem Server:

```bash
python3 -m http.server 8000
```

Dann im Browser öffnen: `http://localhost:8000`

## Was drin ist

- Startscreen: “Welcome back, Johanna”
- verblassender Tag + Datum
- Emoji-Screen: “beschreibe deinen tag in 3 emojis”
- Text-Screen: “descibe what u where up to” + Foto-Upload
- Kalenderübersicht für Eintragstage
- Tage mit Fotos bekommen das erste Foto als Hintergrund
- Speicherung lokal im Browser via `localStorage`
- PWA-Manifest + Service Worker für installierbaren App-Charakter

## Farben

- Ivory: `#F7F2E8`
- Muted Gold: `#B89B5E`
- Warm Gray: `#D8D2C6`
- Deep Gray: `#2E2E2E`

## Fonts

- Playfair Display für Headlines
- Montserrat für UI und Text
