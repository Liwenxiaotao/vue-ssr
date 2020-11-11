const getData = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      {
        id: 1,
        item: 'hello'
      },
      {
        id: 2,
        item: 'hello2'
      },
    ])
  }, 2000)
})

export {
  getData
}