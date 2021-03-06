import insert from './insert'
import update from './update'

// log the latest seqval and lsn for thetable
export default ({
  connection,
  executionId,
  schema,
}) =>
  ({
    changes,
    table,
    seqVal,
  } = {}) =>
    changes
      && (
        (seqVal ? update : insert)({
          connection,
          executionId,
          lsn: changes[changes.length - 1] // eslint-disable-line no-underscore-dangle
            .__$start_lsn,
          schema,
          seqVal: changes[changes.length - 1] // eslint-disable-line no-underscore-dangle
            .__$seqval,
          table,
        })
      )
