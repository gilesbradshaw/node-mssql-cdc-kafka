import resultHex from './result-hex'

export default ({
  connection,
  table,
}) =>
  connection
    .request()
    .query(`
      DECLARE @from_lsn binary (10)
      SET @from_lsn = sys.fn_cdc_get_min_lsn('${table}')
      IF @from_lsn = 0x00000000000000000000
        SET @from_lsn = (SELECT TOP 1 __$start_lsn FROM [cdc].[dbo_${table}_CT] ORDER BY __$start_lsn)
      SELECT @from_lsn
    `)
    .then(resultHex)
