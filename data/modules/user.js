window.__G360_MODS['user'] = {
  id: 'user',
  name: 'Usuarios',
  eyebrow: 'Control de acceso',
  title: 'Roles y permisos\npara cada <em>empleado</em>',
  subtitle: 'Control de acceso por rol. Define quién puede ver, crear o editar dentro de cada módulo.',
  rubros: ['Todos los rubros con equipo', 'Negocios multi-empleado'],
  cycle: ['Usuarios', 'Todos los módulos'],
  features: [
    {
      icon: 'shield',
      title: 'Roles predefinidos',
      desc: 'Admin (acceso total), Vendedor (operaciones comerciales) y Viewer (solo lectura). Roles custom por módulo.',
      chips: ['Admin', 'Vendedor', 'Viewer'],
    },
    {
      icon: 'lock',
      title: 'Permisos granulares',
      desc: 'Leer, crear, editar y eliminar — configurado módulo por módulo. Un vendedor puede usar el CRM pero no Finanzas.',
      chips: ['Leer / Crear', 'Editar / Eliminar', 'Por módulo'],
    },
    {
      icon: 'eye',
      title: 'Auditoría automática',
      desc: 'OTs, cobros, leads — todo tiene "creado por" o "asignado a". Trazabilidad completa sin configuración extra.',
      chips: ['Creado por', 'Asignado a', 'Trazabilidad'],
    },
  ],
};
