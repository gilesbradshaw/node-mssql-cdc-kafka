import squel from '../squel'

export default ({
  connection,
  executionId,
  schema,
  table,
  lsn,
  seqVal,
}) =>
  connection
    .request()
    .query(
      squel
        .insert()
        .into('[Cdc].[ChangeState]')
        .setFields({
          executionId,
          '[schema]': schema,
          tableName: table,
          lsn: squel.str(
            `CONVERT(BINARY(10),'${
              lsn
                .toString('hex')
                .toUpperCase()
            }', 2)`,
          ),
          seqVal: squel.str(
            `CONVERT(BINARY(10),'${
              seqVal
                .toString('hex')
                .toUpperCase()
            }', 2)`,
          ),
          lastUpdate: new Date(),
        })
        .toString(),
    )
