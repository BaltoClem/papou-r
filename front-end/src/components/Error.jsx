import classNames from "classnames"

const ErrorParagraph = (props) => {
  const { messageError, className } = props
  const defaultClassName = className ? className : "pt-10"

  return (
    <p
      className={classNames(
        "text-center text-red-600 text-xl",
        defaultClassName
      )}
    >
      {messageError}
    </p>
  )
}

export default ErrorParagraph
