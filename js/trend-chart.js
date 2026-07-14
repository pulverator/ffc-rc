const chartRoot = document.querySelector("[data-trend-chart]");
const sourceTable = document.querySelector(".data-table");

if (chartRoot && sourceTable) {
  const rows = [...sourceTable.querySelectorAll("tbody tr")];

  const parseDate = (value) => {
    const [day, month, year] = value.trim().split(".").map(Number);
    return new Date(year, month - 1, day);
  };

  const parseNumber = (value) => {
    const cleanedValue = value
      .trim()
      .replace(/[’'\s]/g, "");

    if (!/^\d+$/.test(cleanedValue)) {
      return null;
    }

    return Number(cleanedValue);
  };

  const formatNumber = (value) =>
    new Intl.NumberFormat("de-CH").format(value).replace(/’/g, "’");

  const data = rows
    .map((row) => {
      const cells = row.querySelectorAll("td");

      return {
        label: cells[0]?.textContent.trim() ?? "",
        date: parseDate(cells[0]?.textContent ?? ""),
        telegram: parseNumber(cells[1]?.textContent ?? ""),
        youtube: parseNumber(cells[2]?.textContent ?? "")
      };
    })
    .filter((item) => !Number.isNaN(item.date.getTime()))
    .sort((a, b) => a.date - b.date);

  const telegramValues = data
    .map((item) => item.telegram)
    .filter(Number.isFinite);

  const youtubeValues = data
    .map((item) => item.youtube)
    .filter(Number.isFinite);

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

  const buildPath = (key, scale) => {
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
          label: item.label
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

  const telegramSeries = buildPath("telegram", telegramScale);
  const youtubeSeries = buildPath("youtube", youtubeScale);

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
      >${item.label}</text>
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
        Die Werte stammen direkt aus der nachfolgenden Tabelle.
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
      Fehlende Werte in der Tabelle werden im Diagramm automatisch ausgelassen.
    </p>
  `;
}
