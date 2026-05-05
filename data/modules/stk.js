window.__G360_MODS['stk'] = {
  id: 'stk',
  name: 'Stock',
  eyebrow: 'Gestión de inventario',
  title: 'Inventario en tiempo real,\n<em>sin planillas</em>',
  subtitle: 'Control de productos y movimientos. Se alimenta desde Compras y se descarga desde Ventas. Con alertas de stock mínimo.',
  rubros: ['Comercios', 'Distribuidoras', 'Talleres', 'Mayoristas', 'Ferreterías'],
  cycle: ['Compras', 'Stock', 'Ventas'],
  features: [
    {
      icon: 'list',
      title: 'Catálogo de productos',
      desc: 'SKU, código de barras, categoría libre, unidad de medida y precio de venta sugerido para el módulo Ventas.',
      chips: ['SKU', 'Código de barras', 'Precio sugerido'],
    },
    {
      icon: 'arrow-left-right',
      title: 'Movimientos con auditoría completa',
      desc: 'Cada entrada, salida, ajuste o devolución registrada con origen, usuario y stock resultante. Historial inalterable.',
      chips: ['Entradas', 'Salidas', 'Ajustes'],
    },
    {
      icon: 'bell',
      title: 'Alertas de stock mínimo',
      desc: 'Mínimo por producto configurable. El sistema alerta cuando cae por debajo para generar la orden de compra a tiempo.',
      chips: ['Stock mínimo', 'Alerta auto', 'OC desde alerta'],
    },
  ],
};
