export const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const isNumber = (event, allowDecimal) => {
  let pattern = /\d/

  if (allowDecimal) {
    pattern = /[\d.]/
  }

  if (!pattern.test(event.key)) {
    return event.preventDefault()
  }
}
