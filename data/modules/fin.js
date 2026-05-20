window.__G360_MODS['fin'] = {
  id: 'fin',
  name: 'Finanzas',
  eyebrow: 'Cuenta corriente y caja',
  title: 'Cuenta corriente y caja,\n<em>sin errores</em>',
  subtitle: 'Cierre del ciclo comercial. Cobros, pagos parciales, notas de crédito y caja diaria. Saldo calculado dinámicamente.',
  rubros: ['Todos los rubros con crédito', 'Comercios', 'Distribuidoras'],
  cycle: ['Ventas', 'Finanzas', 'Cobros'],
  features: [
    {
      icon: 'trending-up',
      title: 'Cuenta corriente dinámica',
      desc: 'El saldo es siempre la suma de movimientos en tiempo real. Sin campo estático que pueda desincronizarse.',
      chips: ['Cálculo dinámico', 'ARS / USD', 'Sin errores'],
    },
    {
      icon: 'credit-card',
      title: 'Cobros manuales o MercadoPago',
      desc: 'Efectivo, transferencia o tarjeta. Con MercadoPago conectado los pagos online se registran automáticamente.',
      chips: ['Manual', 'MercadoPago auto', 'Comprobante'],
    },
    {
      icon: 'file-minus',
      title: 'Notas de crédito y ajustes',
      desc: 'Notas de crédito para anular parcialmente una venta o ajustes manuales, con usuario y fecha.',
      chips: ['Nota de crédito', 'Nota de débito', 'Ajuste manual'],
    },
    {
      icon: 'calendar',
      title: 'Caja diaria',
      desc: 'Apertura con saldo inicial, ingresos, egresos y cierre con resumen. Cada movimiento firmado por el operador.',
      chips: ['Apertura / cierre', 'Ingresos y egresos', 'Resumen diario'],
    },
  ],
};
