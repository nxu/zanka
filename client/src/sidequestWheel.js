function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const STYLES = `
  :root {
    --gold: #FFB800;
    --gold-light: #FFDE59;
    --dusk: #2B1B4E;
    --toon: #6C9BFF;
    --sun: #FFD23F;
    --island: #FFFDF7;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    height: 100vh;
    overflow: hidden;
    background: var(--gold);
    font-family: 'Nunito', Arial, Helvetica, sans-serif;
    color: var(--dusk);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sunburst-wrap {
    position: fixed;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }
  .sunburst {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200vmax;
    height: 200vmax;
    transform: translate(-50%, -50%);
    background: repeating-conic-gradient(from 0deg, var(--gold-light) 0deg 9deg, var(--gold) 9deg 18deg);
    animation: sunburst-spin 150s linear infinite;
  }
  @keyframes sunburst-spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  .toon-text {
    text-shadow: 0.07em 0.07em 0 var(--dusk);
    -webkit-text-stroke: 1px #000;
  }
  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    height: 100%;
    padding: 2vh 2vw;
  }
  h1 {
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    color: var(--toon);
    margin: 0;
    text-align: center;
  }
  .wheel-area {
    position: relative;
    width: min(80vh, 82vw);
    aspect-ratio: 1;
    flex: 0 0 auto;
  }
  #wheel {
    width: 100%;
    height: 100%;
    display: block;
    /* Purely decorative - without this, the square SVG box (its transparent
       corners outside the inscribed circle) stays hit-testable as it spins,
       and can sweep over the winner button sitting just below it. */
    pointer-events: none;
    transition: transform 4.5s cubic-bezier(0.15, 0.85, 0.2, 1);
  }
  .pointer {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 46px;
    height: 42px;
    z-index: 3;
    filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.3));
  }
  #spin-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24%;
    height: 24%;
    border-radius: 50%;
    border: 4px solid var(--dusk);
    background: var(--island);
    color: var(--dusk);
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: clamp(0.9rem, 2.4vw, 1.5rem);
    text-transform: uppercase;
    box-shadow: 5px 5px 0 0 var(--dusk);
    cursor: pointer;
    z-index: 2;
  }
  #spin-btn:active:not(:disabled) {
    transform: translate(calc(-50% + 3px), calc(-50% + 3px));
    box-shadow: none;
  }
  #spin-btn:disabled {
    cursor: default;
  }
  #winner-btn {
    display: none;
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: clamp(1.1rem, 2.8vw, 1.8rem);
    color: var(--toon);
    background: var(--island);
    border: 4px solid var(--dusk);
    border-radius: 999px;
    padding: 0.7rem 1.8rem;
    max-width: 90vw;
    box-shadow: 5px 5px 0 0 var(--dusk);
    cursor: pointer;
  }
  #winner-btn:active {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(43, 27, 78, 0.55);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  .modal-box {
    position: relative;
    width: 94vw;
    height: 94vh;
    background: var(--island);
    border: 4px solid var(--dusk);
    border-radius: 2rem;
    box-shadow: 8px 8px 0 0 var(--dusk);
    padding: clamp(1.5rem, 4vw, 3rem);
    display: flex;
    flex-direction: column;
  }
  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    border: 3px solid var(--dusk);
    background: var(--island);
    color: var(--dusk);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: 3px 3px 0 0 var(--dusk);
  }
  .modal-close:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  .modal-title {
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: clamp(1.4rem, 3.6vw, 2.4rem);
    color: var(--toon);
    margin: 0 2.5rem 1rem 0;
  }
  .modal-divider {
    border-top: 2px solid var(--dusk);
    opacity: 0.25;
    margin: 0 0 1rem;
  }
  .modal-text {
    flex: 1 1 auto;
    overflow-y: auto;
    white-space: pre-line;
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    line-height: 1.5;
    color: var(--dusk);
  }
  .modal-ok {
    align-self: center;
    margin-top: 1rem;
    font-family: 'Titan One', cursive, sans-serif;
    font-weight: 400;
    font-size: clamp(1rem, 2.6vw, 1.4rem);
    text-transform: uppercase;
    color: var(--dusk);
    background: var(--sun);
    border: 4px solid var(--dusk);
    border-radius: 999px;
    padding: 0.8rem 3rem;
    box-shadow: 5px 5px 0 0 var(--dusk);
    cursor: pointer;
  }
  .modal-ok:active:not(:disabled) {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
  .modal-ok:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

function wheelScript(quests) {
  return `
  (function () {
    var quests = ${JSON.stringify(quests)};
    var svg = document.getElementById('wheel');
    var btn = document.getElementById('spin-btn');
    var winnerBtn = document.getElementById('winner-btn');
    var modalOverlay = document.getElementById('modal-overlay');
    var modalTitle = document.getElementById('modal-title');
    var modalText = document.getElementById('modal-text');
    var modalOk = document.getElementById('modal-ok');
    var modalClose = document.getElementById('modal-close');
    var cx = 300, cy = 300, r = 290;
    var colors = ['#FFFDF7', '#6C9BFF', '#FFD23F'];
    var ns = 'http://www.w3.org/2000/svg';

    // Our own angle convention: 0deg = straight up (where the pointer sits),
    // increasing clockwise - matches how CSS transform: rotate() spins the
    // wheel, so a segment's own mid-angle is exactly how far clockwise it is
    // from the pointer at rest.
    function point(angleDeg, radius) {
      var rad = (angleDeg - 90) * Math.PI / 180
      return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
    }

    var step = 0
    var spinning = false
    var currentRotation = 0
    var pendingWinner = null

    // Rebuilds the wheel from the current quests array - called on load and
    // again after a quest is resolved and spliced out, so the next spin only
    // ever lands on what's left.
    function renderWheel() {
      while (svg.firstChild) svg.removeChild(svg.firstChild)
      winnerBtn.style.display = 'none'
      pendingWinner = null
      var n = quests.length

      if (!n) {
        svg.style.display = 'none'
        btn.disabled = true
        winnerBtn.textContent = 'Nincs elérhető sidequest ebben a kategóriában.'
        winnerBtn.style.display = 'inline-block'
        winnerBtn.disabled = true
        return
      }

      svg.style.display = 'block'
      btn.disabled = false
      winnerBtn.disabled = false
      step = 360 / n
      var fontSize = Math.max(12, Math.min(32, 420 / n))
      var labelRadius = r * 0.68

      if (n === 1) {
        var circle = document.createElementNS(ns, 'circle')
        circle.setAttribute('cx', cx)
        circle.setAttribute('cy', cy)
        circle.setAttribute('r', r)
        circle.setAttribute('fill', colors[0])
        circle.setAttribute('stroke', '#2B1B4E')
        circle.setAttribute('stroke-width', '4')
        svg.appendChild(circle)
      }

      for (var i = 0; i < n; i++) {
        var start = i * step, end = (i + 1) * step, mid = start + step / 2

        if (n > 1) {
          var p1 = point(start, r), p2 = point(end, r)
          var largeArc = step > 180 ? 1 : 0
          var path = document.createElementNS(ns, 'path')
          path.setAttribute(
            'd',
            'M ' + cx + ' ' + cy + ' L ' + p1.x + ' ' + p1.y + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' 1 ' + p2.x + ' ' + p2.y + ' Z'
          )
          path.setAttribute('fill', colors[i % colors.length])
          path.setAttribute('stroke', '#2B1B4E')
          path.setAttribute('stroke-width', '4')
          svg.appendChild(path)
        }

        var labelPos = point(mid, labelRadius)
        var text = document.createElementNS(ns, 'text')
        text.setAttribute('x', labelPos.x)
        text.setAttribute('y', labelPos.y)
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('transform', 'rotate(' + mid + ' ' + labelPos.x + ' ' + labelPos.y + ')')
        text.setAttribute('font-family', "'Nunito', sans-serif")
        text.setAttribute('font-weight', '800')
        text.setAttribute('font-size', fontSize)
        text.setAttribute('fill', '#2B1B4E')
        text.textContent = quests[i].id
        svg.appendChild(text)
      }
    }

    btn.addEventListener('click', function () {
      var n = quests.length
      if (spinning || !n) return
      spinning = true
      btn.disabled = true
      winnerBtn.style.display = 'none'

      var winner = Math.floor(Math.random() * n)
      pendingWinner = winner
      var winnerMid = winner * step + step / 2
      var extraSpins = 5 + Math.floor(Math.random() * 3)
      // Drop the current rotation's remainder so every spin adds a fresh set
      // of full turns on top of it, instead of the wheel visually snapping
      // back before it starts spinning again.
      var base = currentRotation - (currentRotation % 360)
      var target = base + extraSpins * 360 + (360 - winnerMid)
      currentRotation = target
      svg.style.transform = 'rotate(' + target + 'deg)'
    })

    svg.addEventListener('transitionend', function () {
      if (!spinning) return
      spinning = false
      btn.disabled = false
      winnerBtn.textContent = quests[pendingWinner].title
      winnerBtn.style.display = 'inline-block'
    })

    function openModal() {
      if (pendingWinner === null) return
      var quest = quests[pendingWinner]
      modalTitle.textContent = quest.title
      modalText.textContent = quest.text
      modalOverlay.style.display = 'flex'
    }

    function closeModal() {
      modalOverlay.style.display = 'none'
    }

    winnerBtn.addEventListener('click', openModal)
    modalClose.addEventListener('click', closeModal)

    // Only the close button and OK may dismiss the modal - the backdrop has
    // no click handler (so clicking it does nothing) and Escape is blocked.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.style.display !== 'none') {
        e.preventDefault()
      }
    })

    modalOk.addEventListener('click', function () {
      if (pendingWinner === null) return
      var quest = quests[pendingWinner]
      modalOk.disabled = true
      fetch('/api/admin/sidequests/' + quest.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quest.title, category: quest.category, text: quest.text, is_hidden: true }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('A sidequest frissítése nem sikerült.')
          quests.splice(pendingWinner, 1)
          closeModal()
          renderWheel()
        })
        .catch(function (err) {
          alert(err.message)
        })
        .finally(function () {
          modalOk.disabled = false
        })
    })

    renderWheel()
  })();
  `
}

export function buildSidequestWheelHtml(sidequests, category) {
  const matching = sidequests.filter((s) => !s.is_hidden && (category === 'Összes' || s.category === category))
  const quests = matching.map((s) => ({ id: s.id, title: s.title, text: s.text, category: s.category }))

  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${escapeHtml(category)} – Sidequest kerék</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@400;700;800&display=swap"
  rel="stylesheet"
/>
<style>${STYLES}</style>
</head>
<body>
<div class="sunburst-wrap"><div class="sunburst"></div></div>
<div class="content">
  <h1 class="toon-text">Sidequest kerék</h1>
  <div class="wheel-area">
    <svg class="pointer" viewBox="0 0 46 42">
      <polygon points="4,4 42,4 23,38" fill="#6C9BFF" stroke="#2B1B4E" stroke-width="5" stroke-linejoin="round" />
    </svg>
    <svg id="wheel" viewBox="0 0 600 600"></svg>
    <button id="spin-btn" type="button">Pörgess</button>
  </div>
  <button id="winner-btn" type="button" class="toon-text"></button>
</div>
<div id="modal-overlay" class="modal-overlay">
  <div class="modal-box">
    <button id="modal-close" type="button" class="modal-close" aria-label="Bezárás">&times;</button>
    <h2 id="modal-title" class="modal-title toon-text"></h2>
    <div class="modal-divider"></div>
    <div id="modal-text" class="modal-text"></div>
    <button id="modal-ok" type="button" class="modal-ok">OK</button>
  </div>
</div>
<script>${wheelScript(quests)}</script>
</body>
</html>`
}

export function openSidequestWheel(sidequests, category) {
  const html = buildSidequestWheelHtml(sidequests, category)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}
