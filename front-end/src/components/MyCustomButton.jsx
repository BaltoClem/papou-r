import classNames from "classnames"

const MyCustomButton = (props) => {
  const { name, onClick, classNameButton, ...otherProps } = props

  return (
    <button
      onClick={onClick}
      className={classNames(
        classNameButton,
        "bg-my-salmon text-my-dark-brown font-semibold px-3 py-2"
      )}
      {...otherProps}
    >
      {name}
    </button>
  )
}

export default MyCustomButton
