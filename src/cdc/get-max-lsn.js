import resultHex from './result-hex'

export default ({
  connection,
}) =>
  connection
    .request()
    .query('SELECT sys.fn_cdc_get_max_lsn()')
    .then(resultHex)
    