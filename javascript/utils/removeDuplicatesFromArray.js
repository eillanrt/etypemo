function removeDuplicatesFromArray(array) {
  const uniqueArray = array.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  return uniqueArray
}

export default removeDuplicatesFromArray
