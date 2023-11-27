const SpanLink = (props) => {
  const { text } = props

  return (
    <span className="text-my-dark-brown text-xs sm:text-base lg:text-lg">
      {text}
    </span>
  )
}

export default SpanLink
