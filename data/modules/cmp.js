window.__G360_MODS['cmp'] = {
  id: 'cmp',
  name: 'Compras',
  eyebrow: 'Proveedores y órdenes',
  title: 'Proveedores y órdenes\nen un solo <em>panel</em>',
  subtitle: 'Espejo de Ventas hacia el proveedor. Emitís órdenes de compra, recepcionás mercadería y el stock se actualiza solo.',
  rubros: ['Comercios', 'Distribuidoras', 'Talleres', 'Mayoristas'],
  cycle: ['Compras', 'Stock', 'Finanzas'],
  features: [
    {
      icon: 'building',
      title: 'Registro de proveedores',
      desc: 'Razón social, CUIT, condición AFIP, contacto principal y notas. Base para vincular órdenes y controlar el historial.',
      chips: ['CUIT / AFIP', 'Contacto', 'Historial'],
    },
    {
      icon: 'clipboard-list',
      title: 'Órdenes de compra',
      desc: 'Líneas de productos, cantidades y precios. Estado: borrador → enviada → recibida → cancelada.',
      chips: ['Borrador', 'Enviada', 'Recepcionar'],
    },
    {
      icon: 'truck',
      title: 'Recepción de mercadería',
      desc: 'Al marcar recibida, los productos entran al módulo Stock automáticamente. Soporta recepción parcial.',
      chips: ['Recepción parcial', 'Entrada auto', 'Integración STK'],
    },
  ],
};
