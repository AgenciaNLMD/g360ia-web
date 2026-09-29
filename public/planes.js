/* Los números de los planes, leídos del panel.
 *
 * /afiliados y /developers no escriben ningún precio ni ningún límite: los
 * piden a app.g360ia.com.ar/api/planes, que los saca de la misma tabla y la
 * misma fórmula con las que el panel cobra. Un número copiado acá envejecería
 * solo hasta contradecir al panel (ver CLAUDE.md, Regla 6).
 *
 * Sin este script, o si la API no contesta, la página se lee igual: cada
 * `data-plan` trae un texto de reserva que no promete ningún número, las
 * etiquetas dicen «Próximamente» y la tabla de niveles queda oculta.
 *
 *   data-plan="clave"         → se reemplaza el texto por el valor
 *   data-plan-estado="clave"  → etiqueta «Disponible» / «Próximamente»
 *   data-plan-niveles         → <tbody> que se llena con los niveles; su
 *                                contenedor más cercano con [hidden] se muestra */
(function () {
  var API = 'https://app.g360ia.com.ar/api/planes';
  if (!document.querySelector('[data-plan], [data-plan-estado], [data-plan-niveles]')) return;

  function usd(n) {
    return n === 0 ? 'Gratis' : 'USD ' + Number(n).toLocaleString('es-AR');
  }

  function poner(clave, texto) {
    document.querySelectorAll('[data-plan="' + clave + '"]').forEach(function (el) {
      el.textContent = texto;
    });
  }

  function estado(clave, disponible) {
    document.querySelectorAll('[data-plan-estado="' + clave + '"]').forEach(function (el) {
      el.textContent = disponible ? 'Disponible' : 'Próximamente';
      el.classList.toggle('g-etiqueta--gris', !disponible);
    });
  }

  function niveles(dev) {
    var lista = dev.niveles || [];
    document.querySelectorAll('[data-plan-niveles]').forEach(function (tbody) {
      tbody.innerHTML = '';
      lista.forEach(function (n) {
        var tr = document.createElement('tr');
        [n.nombre, usd(n.precioUsd), n.cupoVendedores, n.softwaresActivos,
         n.numerosPorVendedor || '—'].forEach(function (v) {
          var td = document.createElement('td');
          td.textContent = v;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      var caja = tbody.closest('[hidden]');
      if (caja && lista.length) caja.hidden = false;
    });

    /* Desde el último nivel la fórmula es lineal: la diferencia entre los dos
       últimos es lo que suma cada nivel siguiente. */
    var a = lista[lista.length - 2], b = lista[lista.length - 1];
    if (a && b) {
      poner('dev-nivel-siguiente',
        'Y así sin techo: cada nivel más suma ' + usd(b.precioUsd - a.precioUsd) +
        ', ' + (b.cupoVendedores - a.cupoVendedores) + ' vendedores por producto y ' +
        (b.softwaresActivos - a.softwaresActivos) + ' softwares.');
    }
    var uno = lista[0];
    if (uno) {
      poner('dev-nivel1-cupo', String(uno.cupoVendedores));
      poner('dev-nivel1-softwares', String(uno.softwaresActivos));
    }
    var regalo = lista.find(function (n) { return n.numerosPorVendedor > 0; });
    if (regalo) poner('dev-regalo-por-vendedor', String(regalo.numerosPorVendedor));
  }

  fetch(API, { credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      var afi = d.afiliado || {}, dev = d.developer || {};
      var planes = afi.planes || [];
      var free = planes.find(function (p) { return p.codigo === 'free'; });
      var pro = planes.find(function (p) { return p.codigo === 'pro'; });

      if (free && free.softwaresPorSemana) poner('afi-free-semana', String(free.softwaresPorSemana));
      if (pro) {
        poner('afi-pro-precio', usd(pro.precioUsd) + ' por mes');
        estado('afi-pro', pro.disponible);
      }

      var paq = afi.paqueteContactos;
      if (paq) {
        poner('afi-paquete', usd(paq.monto) + ' cada ' + paq.cantidad + ' contactos');
        estado('afi-paquete', paq.disponible);
      }
      var lugar = afi.extensionLugar;
      if (lugar) {
        poner('afi-lugar', usd(lugar.monto) + ' por ' + lugar.dias + ' días más');
        estado('afi-lugar', lugar.disponible);
      }

      var reg = dev.regaloContactos;
      if (reg) {
        poner('dev-regalo', usd(reg.monto) + ' cada ' + reg.cantidad + ' contactos');
        estado('dev-regalo', reg.disponible);
      }
      if (dev.diasPorPago) poner('dev-dias', String(dev.diasPorPago));
      estado('dev-niveles', dev.disponible);
      niveles(dev);
    })
    .catch(function () { /* queda el texto de reserva */ });
})();
