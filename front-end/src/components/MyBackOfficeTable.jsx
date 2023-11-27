import { useCallback } from "react"
import MyCustomButton from "./MyCustomButton"
import { useRouter } from "next/router"

const Row = (props) => {
  const { data, path, onDelete, canUpdate, headers } = props
  const router = useRouter()

  const handleUpdate = useCallback(() => {
    router.push(`${path}/update/${data.id}`)
  }, [data.id, path, router])

  const handleDelete = useCallback(() => {
    onDelete(data.id)
    window.location.reload(false)
  }, [data.id, onDelete])

  return (
    <tr className="w-full">
      {headers.map((item) => (
        <td className="text-center" key={item}>
          {data[item].toString()}
        </td>
      ))}
      {canUpdate === false ? (
        <></>
      ) : (
        <td className="text-center">
          <MyCustomButton name="Update" onClick={handleUpdate} />
        </td>
      )}

      <td className="text-center">
        <MyCustomButton
          className="bg-red-500 px-3 py-2  text-my-dark-brown font-semibold"
          name="Delete"
          onClick={handleDelete}
        />
      </td>
    </tr>
  )
}

const MyBackOfficeTable = (props) => {
  const { headers, data, path, onDelete, canUpdate } = props

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border">
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
            {canUpdate === false ? <></> : <th>Update</th>}
            <th>Delete</th>
          </tr>
        </thead>
        {data != null ? (
          <tbody>
            {data.map((item) => (
              <Row
                key={item.id}
                className="w-full"
                data={item}
                path={path}
                onDelete={onDelete}
                canUpdate={canUpdate}
                headers={headers}
              ></Row>
            ))}
          </tbody>
        ) : (
          <></>
        )}
      </table>
    </div>
  )
}

export default MyBackOfficeTable
