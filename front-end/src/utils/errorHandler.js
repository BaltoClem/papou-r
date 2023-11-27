const errorHandler = (err) => {
  const error = err.response?.data?.error || "Oops. Something went wrong"

  return [Array.isArray(error) ? error : [error]]
}

export default errorHandler
