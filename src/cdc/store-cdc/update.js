import squel from '../squel'

export default ({
  connection,
  executionId,
  table,
  lsn,
  seqVal,
}) =>
  connection
    .request()
    .query(
      squel
        .update()
        .table('[Cdc].[ChangeState]')
        .set(
          'lsn',
          squel.str(
            `CONVERT(BINARY(10),'${
              lsn
                .toString('hex')
                .toUpperCase()
            }', 2)`,
          ),
        )
        .set(
          'seqVal',
          squel.str(
            `CONVERT(BINARY(10),'${
              seqVal
                .toString('hex')
                .toUpperCase()
            }', 2)`,
          ),
        )
        .set(
          'lastUpdate',
          new Date(),
        )
        .where(
          `executionId = '${executionId}'`,
        )
        .where(
          `tableName = '${table}'`,
        )
        .toString(),
    )
