/**
 * Retorna data de Hoje como ISOString
 * @param {Boolean} retornaDatetime se for true retorna datetime
 * @returns {String} Data de hoje, no formato date ou datetime
 */
export function hoje(retornaDatetime = false) {
    const offset = new Date().getTimezoneOffset() * 60000; // offset em milisegundos
    const localDateTime = new Date(Date.now() - offset).toISOString();
   
    if (retornaDatetime === true) {
      return localDateTime.slice(0, 19); // retira milisegundos
    } else {
      return localDateTime.slice(0, 10); // retira tempo, THH:MM:SS
    }
  }