export default function format(date) {
    const fecha = new Date(date);

    // Obtener día, mes y año
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Meses son indexados desde 0
    const anio = fecha.getFullYear();

    // Formatear la fecha al formato dd/mm/aaaa
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return fechaFormateada
}





