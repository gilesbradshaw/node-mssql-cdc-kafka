//  promise to delay

export default delay => new Promise(
  resolve =>
    setTimeout(
      resolve,
      delay,
    ),
)
