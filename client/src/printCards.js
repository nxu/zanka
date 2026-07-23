function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function cardHtml(card) {
  return `
    <div class="slot">
      <div class="card">
        <div class="card-title">${escapeHtml(card.name)}</div>
        <div class="card-divider"></div>
        <div class="card-task">${escapeHtml(card.task)}</div>
        <div class="card-points">${escapeHtml(card.points)} pont</div>
      </div>
    </div>`
}

function pageHtml(group, isLast) {
  const cards = group.map((card) => cardHtml(card)).join('')
  return `<div class="page${isLast ? ' last' : ''}">${cards}</div>`
}

const STYLES = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Nunito', Arial, Helvetica, sans-serif;
    color: #000;
    background: #fff;
    /* Match the true A4 content width (210mm - 15mm margin each side) so
       on-screen text wrapping (used by the fit script below) matches how
       it will actually wrap on the printed page, regardless of how wide
       the browser window happens to be. */
    max-width: 180mm;
    margin: 0 auto;
  }
  @page {
    size: A4 portrait;
    margin: 15mm;
  }
  /* Block layout, not flex: Chromium's print/PDF pagination has long-standing
     bugs honoring break-inside/page-break-inside on children of a flex
     container, which let a card get sliced across two pages. Plain block
     children with margin-based spacing paginate reliably instead. */
  .page {
    break-after: page;
    page-break-after: always;
  }
  .page.last {
    break-after: auto;
    page-break-after: auto;
  }
  .slot {
    width: 100%;
    height: 87mm;
    padding: 4mm;
    border: 1pt dashed #999;
    box-sizing: border-box;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  /* Overlap by exactly the border width so two adjacent slots' cut lines sit
     on top of each other as one line, instead of two separate lines with a
     gap between them - one cut separates both cards instead of two. */
  .slot + .slot {
    margin-top: -1pt;
  }
  .card {
    width: 100%;
    height: 100%;
    border: 1.5pt solid #000;
    border-radius: 3mm;
    padding: 6mm 8mm;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .card-title {
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: 19pt;
    line-height: 1.15;
  }
  .card-divider {
    border-top: 1pt solid #000;
    opacity: 0.5;
    margin: 3mm 0;
  }
  .card-task {
    flex: 1 1 auto;
    overflow: hidden;
    line-height: 1.4;
    white-space: pre-line;
  }
  .card-points {
    flex: 0 0 auto;
    text-align: right;
    font-family: 'Nunito', Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 10pt;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-top: 1pt solid #000;
    margin-top: 2mm;
    padding-top: 2mm;
  }
  .hint {
    max-width: 180mm;
    margin: 0 auto 6mm;
    padding: 3mm 4mm;
    border: 1pt dashed #999;
    border-radius: 2mm;
    font-family: 'Nunito', Arial, Helvetica, sans-serif;
    font-size: 9pt;
    color: #555;
    text-align: center;
  }
  @media print {
    .hint {
      display: none;
    }
  }
`

const FIT_SCRIPT = `
  (function () {
    // .card-task normally stretches via flex-grow to fill its slot, so its
    // own scrollHeight/clientHeight are useless for measuring "does the text
    // actually need this much room" (scrollHeight is clamped to clientHeight
    // whenever content fits). Temporarily un-stretch it to measure the
    // text's true natural height, then compare that to the slot's size.
    // SAFETY leaves headroom because the real print/PDF layout pass can
    // measure slightly differently than this on-screen check.
    var SAFETY = 0.92;
    function fit(el) {
      var available = el.clientHeight;
      var min = 7, max = 12, step = 0.5, size = max;
      el.style.flexGrow = '0';
      el.style.flexBasis = 'auto';
      el.style.height = 'auto';
      el.style.fontSize = size + 'pt';
      while (el.scrollHeight > available * SAFETY && size > min) {
        size -= step;
        el.style.fontSize = size + 'pt';
      }
      el.style.flexGrow = '';
      el.style.flexBasis = '';
      el.style.height = '';
    }
    function run() {
      document.querySelectorAll('.card-task').forEach(fit);
      window.print();
    }
    // Wait for the web fonts to actually finish loading before measuring,
    // otherwise text gets measured/fit against fallback-font metrics and
    // then visibly reflows (and can overflow) once the real font swaps in.
    if (document.fonts && document.fonts.ready) {
      Promise.all([
        document.fonts.load('400 19pt "Titan One"'),
        document.fonts.load('400 12pt "Nunito"'),
        document.fonts.load('700 10pt "Nunito"'),
      ]).then(function () {
        return document.fonts.ready;
      }).then(run, run);
    } else {
      run();
    }
  })();
`

export function buildTaskCardsPrintHtml(cards) {
  const groups = []
  for (let i = 0; i < cards.length; i += 3) {
    groups.push(cards.slice(i, i + 3))
  }
  const pages = groups.map((group, i) => pageHtml(group, i === groups.length - 1)).join('')

  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="UTF-8" />
<title>Feladatkártyák nyomtatása</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
<style>${STYLES}</style>
</head>
<body>
<p class="hint">A nyomtatási ablaknak automatikusan meg kellene jelennie. Ha nem, nyomj Ctrl+P-t (Cmd+P Macen).</p>
${pages}
<script>${FIT_SCRIPT}</script>
</body>
</html>`
}

export function printTaskCards(cards) {
  const html = buildTaskCardsPrintHtml(cards)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}
