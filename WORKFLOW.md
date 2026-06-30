# FFC Reality Checker – Workflow

## Repository

GitHub Repository:

https://github.com/pulverator/ffc-rc

Der aktuelle Stand auf GitHub gilt immer als gemeinsame Arbeitsbasis.

---

## Projektstruktur

```
index.html
css/
js/
img/
reality-checks/
```

Bildnamen:

```
<seitenname>--<beschreibung>.<ext>
```

Beispiele:

```
fuellmich--fuelli-schmollt.png
umbele-town--logo.png
flacherde--laser.png
```

---

## Entwicklungsworkflow

### 1. Lokal entwickeln

Arbeitsordner:

```
ffc-rc
```

Testen mit **Live Server** in VS Code.

---

### 2. Git-Status prüfen

```bash
git status
```

Kontrollieren, ob nur die erwarteten Dateien geändert wurden.

---

### 3. Änderungen übernehmen

```bash
git add .
```

---

### 4. Commit erstellen

```bash
git commit -m "Kurze Beschreibung der Änderung"
```

Beispiele:

```
Add Umbele Town
Add Flat Earth teaser
Improve hover animation
```

---

### 5. Änderungen veröffentlichen

```bash
git push
```

Danach ist GitHub Pages automatisch aktuell.

---

## Zusammenarbeit mit ChatGPT

Arbeitsregel:

> **Immer auf dem aktuellen GitHub-Stand arbeiten.**

Vor einer neuen Aufgabe:

1. Änderungen committen
2. `git push`
3. ChatGPT informieren:

> **Arbeite auf dem aktuellen GitHub-Stand.**

ChatGPT liefert danach nur die geänderten oder neuen Dateien zurück (nicht mehr das komplette Projekt).

---

## Git-Grundbefehle

Status anzeigen

```bash
git status
```

Änderungen übernehmen

```bash
git add .
```

Commit erstellen

```bash
git commit -m "Beschreibung"
```

GitHub aktualisieren

```bash
git push
```

---

## Ziel

GitHub dient als zentrale Projektversion.

Versionierte ZIP-Dateien (`v19`, `v20` usw.) werden nicht mehr verwendet.