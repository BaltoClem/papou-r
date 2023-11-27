const ImageField = (props) => {
  const { name, label, accepts, className, handleChange, allowMultiple } = props

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        type="file"
        accept={accepts}
        className={className}
        onChange={handleChange}
        multiple={allowMultiple}
      />
    </label>
  )
}

export default ImageField
