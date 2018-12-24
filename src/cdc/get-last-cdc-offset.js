import squel from './squel'

export default ({
  connection,
  executionId,
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
            minLsn: lsn || minValidLsn,
            seqVal,
          }),
      )
