import { NProducer } from 'sinek'

let x = 1
export default ({
  config,
  tables,
  topic,
}) => {
  const producer = new NProducer(
    {
      ...config,
    },
    tables.map(topic),
    1,
  )
  return producer
    .connect()
    .then(
      () =>
        toPublish =>
          Promise.all(
            toPublish
              .changes
              .filter(x => x)
              .map(
                ({
                  changes,
                  table,
                }) =>
                  Promise.all(
                    changes
                      .map(
                        change =>
                          producer.buffer(
                            topic(table),
                            Date.now(),
                            change,
                            0,
                          ).then(
                            console.log,
                          ),
                      ),
                  ),
              ),
          ),
    )
}
