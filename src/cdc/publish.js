export default ({
  publisher,
  maxLsn,
}) =>
  changes =>
    publisher({
      changes,
      maxLsn,
    })
      .then(
        () => changes,
      )
