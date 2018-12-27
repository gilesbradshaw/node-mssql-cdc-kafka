import delay from './delay'
import getMaxLsn from './get-max-lsn'
import getMinValidLsn from './get-min-valid-lsn'
import getLastCdcOffset from './get-last-cdc-offset'
import getChangeBatch from './get-change-batch'
import storeCdc from './store-cdc'
import publish from './publish'

const cdc = ({
  cdcConnection,
  connection,
  executionId,
  publisher,
  lastScan = Date.now(),
  maxLsn: lastMaxLsn,
  scan,
  schema,
  tables,
}) => {
  const thisScan = Date.now()
  const pause = scan - (thisScan - lastScan)
  return delay(pause)
    .then(
      () =>
        getMaxLsn({
          connection,
        })
          .then(
            // the maximum logged lsn
            maxLsn => (
              maxLsn !== lastMaxLsn
                ? Promise.all( // scan all the tables
                  tables
                    .map(
                      table =>
                        getMinValidLsn({
                          connection,
                          schema,
                          table,
                        })
                          .then(
                            getLastCdcOffset({
                              executionId,
                              schema,
                              table,
                              connection: cdcConnection,
                            }),
                          )
                          .then(
                            getChangeBatch({
                              batchSize: 100,
                              connection,
                              schema,
                              table,
                              toLsn: maxLsn,
                            }),
                          ),
                    ),
                )
                  // publish all the change
                  // the way they are published could publish them in order across tables..
                  .then(
                    publish({
                      publisher,
                      maxLsn,
                    }),
                  )
                  // store all the changes
                  .then(
                    changes =>
                      Promise.all(
                        changes
                          .filter(
                            xx => xx,
                          )
                          .map(
                            storeCdc({
                              connection: cdcConnection,
                              schema,
                              executionId,
                            }),
                          ),
                      ),
                  )
                : Promise.resolve() // no scan needed
            )
              .then(
                () =>
                  cdc({
                    cdcConnection,
                    connection,
                    executionId,
                    maxLsn,
                    lastScan: thisScan + pause,
                    publisher,
                    scan,
                    tables,
                  }),
              ),
          ),
    )
}

export default cdc
