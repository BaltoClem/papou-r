import { Field } from "formik"

const DropDownField = (props) => {
  const { name, label, options, className, allowMultiple } = props

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <Field
        as="select"
        name={name}
        className={className}
        multiple={allowMultiple}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} label={opt.label} />
        ))}
      </Field>
    </label>
  )
}

export default DropDownField
