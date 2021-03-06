import squel from './squel'

export default ({
  connection,
  executionId,
  schema,
  table,
}) =>
  minValidLsn =>
    connection
      .request()
      .query(
        squel
          .select()
          .field('Lsn')
          .field('SeqVal')
          .from('[Cdc].[ChangeState]')
          .where(`ExecutionId = '${executionId}'`)
          .where(`[schema] = '${schema}'`)
          .where(`TableName = '${table}'`)
          .toString(),
      )
      .then(
        ({
          recordset,
        }) => ({
          lsn: recordset.length
            && recordset[0].Lsn.toString('hex'),
          seqVal: recordset.length
            && recordset[0].SeqVal.toString('hex'),
        }),
      )
      .then(
        ({
          lsn,
          seqVal,
        }) =>
          ({
            minLsn: (lsn && lsn > minValidLsn) ? lsn : minValidLsn,
            seqVal,
          }),
      )
