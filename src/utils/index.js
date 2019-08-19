export const setValue = (field, value, source = null) => {
  field.value = value;
  field.reviewedOn = new Date().toISOString();
  if (source) {
    if (Array.isArray(field.sources)) {
      field.sources.push(source)
    } else {
      field.sources = [source]
    }
  }
  return field
}

export const getValue = (field) => {
  return field.value
}