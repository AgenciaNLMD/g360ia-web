/* Cerrar sesión.
   Es un formulario y no un fetch a propósito: un POST con navegación funciona
   sin JavaScript, y salir es lo último que uno quiere que dependa de que el
   bundle haya cargado. */
export default function Salir() {
  return (
    <form action="/api/auth/logout" method="post">
      <button className="panel__salir" type="submit">Salir</button>
    </form>
  );
}
