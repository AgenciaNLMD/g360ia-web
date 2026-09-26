/* Documentación: pestañas por lenguaje y botón de copiar.
   Vive en `public/` porque la página lo pide como `/docs.js` (Regla 4). Sin
   este script la página se lee entera: los ejemplos quedan uno debajo del otro
   con su rótulo, y el código se copia a mano. */
(function () {
  document.querySelectorAll('.g-doc-codigo').forEach(function (caja) {
    var pre = caja.querySelector('pre');
    if (!pre || !navigator.clipboard) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'g-doc-copiar';
    b.textContent = 'Copiar';
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.innerText).then(function () {
        b.textContent = 'Copiado';
        setTimeout(function () { b.textContent = 'Copiar'; }, 1800);
      });
    });
    caja.appendChild(b);
  });

  /* El lenguaje elegido se recuerda entre bloques: quien lee en PHP quiere
     ver PHP en todos los ejemplos, no volver a elegirlo en cada uno. */
  var grupos = document.querySelectorAll('.g-doc-tabs');
  function elegir(lang) {
    grupos.forEach(function (g) {
      var paneles = g.querySelectorAll('.g-doc-panel');
      var hay = Array.prototype.some.call(paneles, function (p) { return p.dataset.lang === lang; });
      if (!hay) return;
      paneles.forEach(function (p) { p.hidden = p.dataset.lang !== lang; });
      g.querySelectorAll('.g-doc-tab').forEach(function (t) {
        t.setAttribute('aria-selected', String(t.dataset.lang === lang));
      });
    });
    try { localStorage.setItem('g-doc-lang', lang); } catch (e) {}
  }

  grupos.forEach(function (g) {
    var paneles = g.querySelectorAll('.g-doc-panel');
    var barra = document.createElement('div');
    barra.className = 'g-doc-tabs-botones';
    barra.setAttribute('role', 'tablist');
    paneles.forEach(function (p, i) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'g-doc-tab';
      t.setAttribute('role', 'tab');
      t.dataset.lang = p.dataset.lang;
      t.textContent = p.querySelector('.g-doc-codigo-rotulo').textContent;
      t.setAttribute('aria-selected', String(i === 0));
      t.addEventListener('click', function () { elegir(p.dataset.lang); });
      barra.appendChild(t);
      p.hidden = i !== 0;
    });
    g.insertBefore(barra, g.firstChild);
    g.classList.add('is-listo');
  });

  var guardado = null;
  try { guardado = localStorage.getItem('g-doc-lang'); } catch (e) {}
  if (guardado) elegir(guardado);
})();
