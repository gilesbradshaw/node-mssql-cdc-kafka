import squel from './squel'

export default ({
  batchSize,
  connection,
  schema,
  table,
  toLsn,
}) =>
  ({
    minLsn,
    seqVal,
  }) =>
    (minLsn || undefined)
      && connection
        .request()
        .query(
          squel
            .select()
            .from(
              `[cdc].[fn_cdc_get_all_changes_${schema}_${table}](
                CONVERT(BINARY(10),'${minLsn || '00000000000000000000'}', 2),
                CONVERT(BINARY(10),'${toLsn}', 2),
                'all')`,
            )
            .top(batchSize)
            .where(`__$seqval > CONVERT(BINARY(10),'${seqVal || '00000000000000000000'}', 2)`)
            .order('__$seqval')
            .toString(),
        )
        .then(
          changeBatch => changeBatch
            && changeBatch.recordset.length
            && ({
              changes: changeBatch.recordset,
              seqVal,
              table,
            }),
        )
