/* Los números del programa, en un solo lugar.
   ==========================================================================
   El reparto es fijo y no se negocia por producto (README.md, «Reparto y
   monetización»). Estas constantes son la copia de este repo; las otras viven
   en `g360ia-web` (la vidriera) y en la base del turnero. Si cambia el reparto,
   cambian las tres — y sube `CONDICIONES_VERSION`, porque lo que cada afiliado
   aceptó al registrarse queda guardado en su fila. */

export const PCT_DEVELOPER = 50;
export const PCT_AFILIADO = 20;
export const PCT_G360IA = 30;

/* Sube cada vez que cambian las condiciones que se aceptan al registrarse.
   Sin esto, el día que alguien discuta una liquidación no hay forma de saber
   qué texto estaba vigente cuando se dio de alta. */
export const CONDICIONES_VERSION = "2026-09-16";

export const PASOS = [
  {
    n: "01",
    titulo: "Elegís qué vender",
    texto:
      "El catálogo está acá adentro: cada producto con su ficha, sus capturas y su demo. " +
      "Te quedás con los que le sirvan a los negocios que ya tratás. Sin exclusividad y sin cupo.",
  },
  {
    n: "02",
    titulo: "Compartís tu código",
    texto:
      "Se lo mandás por WhatsApp al negocio, lo ponés en tu perfil o lo repartís impreso. " +
      "Quien se registre desde ahí queda anotado como tuyo, aunque se decida meses después: el código no vence.",
  },
  {
    n: "03",
    titulo: "Cobrás todos los meses",
    texto:
      `Cuando ese negocio se suscribe, empezás a cobrar el ${PCT_AFILIADO}% de cada cuota. ` +
      "No es un pago único: se repite mientras siga usando el sistema. Se liquida una vez por mes.",
  },
];

export const PROMESAS = [
  "Sin inversión inicial",
  "Sin exclusividad",
  "Sin saber programar",
];
