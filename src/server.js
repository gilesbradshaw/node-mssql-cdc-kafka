import mssql from 'mssql'
import _config from 'config'

import producer from './producer'
import cdc from './cdc'

const config = _config.get('cdc')
const producerConfig = _config.get('producer')

// this connection accesses cdc database
new mssql
  .ConnectionPool(config.connection)
  .connect()
  .then(
    cdcConnection =>
      Promise.all(
        Object.keys(config.executions)
          .map(
            executionId =>
              // acconnection per 'execution
              new mssql
                .ConnectionPool(config.executions[executionId].connection)
                .connect()
                .then(
                  connection =>
                    // a kafka producer per execution
                    producer({
                      config: producerConfig,
                      topic: table =>
                        `cdc-${executionId}-${table.toLowerCase()}`,
                      tables: config
                        .executions[executionId]
                        .tables,
                    })
                      .then(
                        publisher =>
                          // scan for cdc changes..
                          cdc({
                            cdcConnection,
                            connection,
                            executionId,
                            publisher,
                            scan: config.executions[executionId].scan,
                            schema: config.executions[executionId].schema,
                            tables: config.executions[executionId].tables,
                          }),
                      ),
                ),
          ),
      ),
  ).catch(
    ex => console.error(ex), // eslint-disable-line no-console
  )
