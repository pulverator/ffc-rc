# FFC Reality Checker – Workflow

## Repository

GitHub Repository:

https://github.com/pulverator/ffc-rc

Der aktuelle Stand auf GitHub gilt immer als gemeinsame Arbeitsbasis.

---

## Projektstruktur

```text
index.html
css/
js/
img/
reality-checks/
```

Bildnamen:

```text
<seitenname>--<beschreibung>.<ext>
```

Beispiele:

```text
fuellmich--fuelli-schmollt.png
umbele-town--logo.png
flacherde--laser.png
```

---

## Entwicklungsworkflow

### 1. Lokal entwickeln

Arbeitsordner:

```text
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

```text
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

## Zusammenarbeit mit KI-Unterstützung

Arbeitsregel:

> **Immer auf dem aktuellen GitHub-Stand arbeiten.**

Vor einer neuen Aufgabe:

1. Änderungen committen.
2. Änderungen nach GitHub pushen.
3. Neue Aufgabe mit folgendem Hinweis starten:

> **Arbeite auf dem aktuellen GitHub-Stand.**

Die Unterstützung liefert danach nur die geänderten oder neuen Dateien zurück, nicht mehr das komplette Projekt.

---

## ZIP-Workflow für gelieferte Updates

Gelieferte ZIP-Dateien enthalten **keinen zusätzlichen Projektordner** mehr.

Beispiel:

```text
css/
js/
img/
reality-checks/
index.html
WORKFLOW.md
```

### Sicherer Import per Terminal

ZIP entpacken, dann den Inhalt mit `ditto` in den Projektordner kopieren.

Beispiel:

```bash
ditto ~/Downloads/2026-06-30--2209--ffc-rc--add-flacherde/ ~/Library/Mobile\ Documents/com~apple~CloudDocs/20--Schwurbelhausen/ffc-reality-checker/ffc-rc/
```

ditto ~/xx--transfer/ .


`ditto` führt Ordner zusammen und überschreibt Dateien gleichen Namens, löscht aber keine vorhandenen Dateien im Zielordner.

### Wichtig

Nicht komplette Ordner per Finder mit «Ersetzen» über bestehende Ordner ziehen. Das kann bestehende Dateien im Zielordner entfernen.

Nach dem Kopieren immer prüfen:

```bash
git status
```

---

## Änderungen zurücksetzen

Noch nicht commitete Änderungen können auf den letzten Commit zurückgesetzt werden:

```bash
git restore .
```

Untracked files werden dadurch nicht gelöscht. Diese bei Bedarf manuell löschen.

---

## Benennung der Update-ZIP-Dateien

Alle gelieferten ZIP-Dateien verwenden folgendes Schema nach lokaler Projektzeit:

```text
YYYY-MM-DD--HHMM--ffc-rc--beschreibung.zip
```

Beispiele:

```text
2026-06-30--1845--ffc-rc--add-flacherde.zip
2026-06-30--1930--ffc-rc--fix-doctype.zip
2026-07-01--0915--ffc-rc--add-bhakdi.zip
```

So lassen sich mehrere Updates am gleichen Tag eindeutig unterscheiden.

---

## Projektregeln

- Immer `<!DOCTYPE html>` verwenden.
- Schweizer Rechtschreibung.
- Dateinamen nur in Kleinbuchstaben.
- Wörter mit Bindestrich trennen.
- Bildnamen: `<seitenname>--<beschreibung>`.
- Neue Reality Checks als eigene HTML-Datei in `reality-checks/`.
- GitHub ist immer die Referenz für den aktuellen Projektstand.
