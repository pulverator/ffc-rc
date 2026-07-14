/* ==========================================================================
   Elemente und Datenquelle
   ========================================================================== */

const chartRoot = document.querySelector("[data-trend-chart]");
const tableBody = document.querySelector("[data-trend-table-body]");
const latestTelegramElement = document.querySelector("[data-latest-telegram]");
const latestDateElement = document.querySelector("[data-latest-date]");

const dataSource = chartRoot?.dataset.source;


/* ==========================================================================
   Hilfsfunktionen
   ========================================================================== */

const parseCsv = (csvText) => {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split(",").map((header) => header.trim());

  return dataLines
    .map((line) => {
      const values = line.split(",").map((value) => value.trim());

      return headers.reduce((item, header, index) => {
        item[header] = values[index] ?? "";
        return item;
      }, {});
    })
    .map((item) => ({
      date: new Date(`${item.date}T00:00:00`),
      isoDate: item.date,
      telegram: parseNumber(item.telegram),
      youtube: parseNumber(item.youtube)
    }))
    .filter((item) => !Number.isNaN(item.date.getTime()))
    .sort((a, b) => a.date - b.date);
};

const parseNumber = (value) => {
  const cleanedValue = String(value)
    .trim()
    .replace(/[’'\s]/g, "");

  if (!/^\d+$/.test(cleanedValue)) {
    return null;
  }

  return Number(cleanedValue);
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "–";
  }

  return new Intl.NumberFormat("de-CH")
    .format(value)
    .replace(/'/g, "’");
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);

const formatLongDate = (date) =>
  new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);


/* ==========================================================================
   Tabelle aus CSV erzeugen
   ========================================================================== */

const renderTable = (data) => {
  if (!tableBody) {
    return;
  }

  const descendingData = [...data].sort((a, b) => b.date - a.date);

  tableBody.innerHTML = descendingData
    .map((item) => `
      <tr>
        <td>${formatDate(item.date)}</td>
        <td>${formatNumber(item.telegram)}</td>
        <td>${formatNumber(item.youtube)}</td>
      </tr>
    `)
    .join("");
};


/* ==========================================================================
   Aktuellsten Wert im Seitenkopf einsetzen
   ========================================================================== */

const renderLatestValue = (data) => {
  const latestItem = data.at(-1);

  if (!latestItem) {
    return;
  }

  if (latestTelegramElement) {
    latestTelegramElement.textContent = formatNumber(latestItem.telegram);
  }

  if (latestDateElement) {
    latestDateElement.textContent = formatLongDate(latestItem.date);
  }
};


/* ==========================================================================
   Diagrammdaten vorbereiten
   ========================================================================== */

const createScale = (values) => {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum || 1;
  const padding = range * 0.16;

  return {
    minimum: minimum - padding,
    maximum: maximum + padding
  };
};

const renderChart = (data) => {
  if (!chartRoot) {
    return;
  }

  const telegramValues = data
    .map((item) => item.telegram)
    .filter(Number.isFinite);

  const youtubeValues = data
    .map((item) => item.youtube)
    .filter(Number.isFinite);

  if (telegramValues.length === 0 || youtubeValues.length === 0) {
    chartRoot.innerHTML = `
      <p class="trend-chart__error">
        Für das Diagramm sind noch nicht genügend Daten vorhanden.
      </p>
    `;
    return;
  }

  const width = 720;
  const height = 360;

  const margin = {
    top: 28,
    right: 68,
    bottom: 62,
    left: 68
  };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const telegramScale = createScale(telegramValues);
  const youtubeScale = createScale(youtubeValues);

  const xPosition = (index) => {
    if (data.length === 1) {
      return margin.left + plotWidth / 2;
    }

    return margin.left + (index / (data.length - 1)) * plotWidth;
  };

  const yPosition = (value, scale) => {
    const ratio =
      (value - scale.minimum) /
      (scale.maximum - scale.minimum);

    return margin.top + plotHeight - ratio * plotHeight;
  };

  const buildSeries = (key, scale) => {
    const points = data
      .map((item, index) => {
        const value = item[key];

        if (!Number.isFinite(value)) {
          return null;
        }

        return {
          x: xPosition(index),
          y: yPosition(value, scale),
          value,
          label: formatDate(item.date)
        };
      })
      .filter(Boolean);

    const path = points
      .map((point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

    return {
      path,
      points
    };
  };

  const telegramSeries = buildSeries("telegram", telegramScale);
  const youtubeSeries = buildSeries("youtube", youtubeScale);


/* ==========================================================================
   SVG-Elemente erzeugen
   ========================================================================== */

  const gridSteps = 4;

  const grid = Array.from({ length: gridSteps + 1 }, (_, index) => {
    const ratio = index / gridSteps;
    const y = margin.top + ratio * plotHeight;

    const telegramValue =
      telegramScale.maximum -
      ratio * (telegramScale.maximum - telegramScale.minimum);

    const youtubeValue =
      youtubeScale.maximum -
      ratio * (youtubeScale.maximum - youtubeScale.minimum);

    return `
      <line
        class="trend-chart__grid-line"
        x1="${margin.left}"
        y1="${y}"
        x2="${width - margin.right}"
        y2="${y}"
      />

      <text
        class="trend-chart__axis-label"
        x="${margin.left - 10}"
        y="${y + 4}"
        text-anchor="end"
      >${formatNumber(Math.round(telegramValue))}</text>

      <text
        class="trend-chart__axis-label"
        x="${width - margin.right + 10}"
        y="${y + 4}"
        text-anchor="start"
      >${formatNumber(Math.round(youtubeValue))}</text>
    `;
  }).join("");

  const dateLabels = data
    .map((item, index) => `
      <text
        class="trend-chart__date-label"
        x="${xPosition(index)}"
        y="${height - 28}"
      >${formatDate(item.date)}</text>
    `)
    .join("");

  const createPoints = (series, className, seriesName) =>
    series.points
      .map((point) => `
        <circle
          class="trend-chart__point ${className}"
          cx="${point.x}"
          cy="${point.y}"
          r="5"
        >
          <title>${seriesName}: ${formatNumber(point.value)} am ${point.label}</title>
        </circle>
      `)
      .join("");


/* ==========================================================================
   Diagramm in den HTML-Platzhalter einsetzen
   ========================================================================== */

  chartRoot.innerHTML = `
    <svg
      class="trend-chart__svg"
      viewBox="0 0 ${width} ${height}"
      role="img"
      aria-labelledby="trend-svg-title trend-svg-description"
    >
      <title id="trend-svg-title">Entwicklung der Abonnentenzahlen</title>

      <desc id="trend-svg-description">
        Telegram und Youtube werden mit getrennten Werteskalen dargestellt.
        Die Werte stammen aus der CSV-Datei.
      </desc>

      ${grid}

      <line
        class="trend-chart__axis-line"
        x1="${margin.left}"
        y1="${margin.top}"
        x2="${margin.left}"
        y2="${height - margin.bottom}"
      />

      <line
        class="trend-chart__axis-line"
        x1="${width - margin.right}"
        y1="${margin.top}"
        x2="${width - margin.right}"
        y2="${height - margin.bottom}"
      />

      <line
        class="trend-chart__axis-line"
        x1="${margin.left}"
        y1="${height - margin.bottom}"
        x2="${width - margin.right}"
        y2="${height - margin.bottom}"
      />

      <path
        class="trend-chart__line trend-chart__line--telegram"
        d="${telegramSeries.path}"
      />

      <path
        class="trend-chart__line trend-chart__line--youtube"
        d="${youtubeSeries.path}"
      />

      ${createPoints(
        telegramSeries,
        "trend-chart__point--telegram",
        "Telegram"
      )}

      ${createPoints(
        youtubeSeries,
        "trend-chart__point--youtube",
        "Youtube"
      )}

      ${dateLabels}
    </svg>

    <div class="trend-chart__legend">

      <span class="trend-chart__legend-item">
        <span
          class="trend-chart__legend-marker trend-chart__legend-marker--telegram"
        ></span>
        Telegram, linke Skala
      </span>

      <span class="trend-chart__legend-item">
        <span
          class="trend-chart__legend-marker trend-chart__legend-marker--youtube"
        ></span>
        Youtube, rechte Skala
      </span>

    </div>

    <p class="trend-chart__note">
    </p>
  `;
};


/* ==========================================================================
   CSV laden und Seite initialisieren
   ========================================================================== */

const initializeTrendPage = async () => {
  if (!chartRoot || !dataSource) {
    return;
  }

  try {
    const response = await fetch(dataSource);

    if (!response.ok) {
      throw new Error(`CSV konnte nicht geladen werden: ${response.status}`);
    }

    const csvText = await response.text();
    const data = parseCsv(csvText);

    renderLatestValue(data);
    renderTable(data);
    renderChart(data);
  } catch (error) {
    console.error(error);

    chartRoot.innerHTML = `
      <p class="trend-chart__error">
        Die CSV-Daten konnten nicht geladen werden.
      </p>
    `;
  }
};

initializeTrendPage();
