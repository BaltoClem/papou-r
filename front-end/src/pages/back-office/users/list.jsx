import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { createApi } from "@/services/api"
import config from "@/config"
import { getUsersService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import ErrorParagraph from "@/components/Error"
import Pagination from "@/components/Pagination"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getUsers = getUsersService(args)
  const [errorUser, dataUsers] = await getUsers(config.api.limitPage, 1)

  if (errorUser) {
    return {
      props: {
        error: errorUser,
      },
    }
  }

  return {
    props: {
      users: dataUsers.data.result.users,
      totalPages: dataUsers.data.result.totalPages,
    },
  }
}

const List = (props) => {
  const { error, users, totalPages } = props

  const { t } = useTranslation()
  const {
    actions: { getUsers, deleteUser, checkIsAdmin },
  } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [thisUsersPage, setThisUsersPage] = useState(users)
  const [currentError, setCurrentError] = useState(error)
  const myPath = "/back-office/users"

  checkIsAdmin()

  const handlePageChange = useCallback(
    async (page) => {
      const [error, userData] = await getUsers(config.api.limitPage, page)

      if (error) {
        setCurrentError(error)
      }

      setThisUsersPage(userData.data.result.users)
      setCurrentPage(page)
    },
    [getUsers]
  )

  const usersHeaders = [
    "id",
    "display_name",
    "email",
    "phone_number",
    "deleted",
  ]

  return (
    <Page>
      {currentError ? (
        <ErrorParagraph messageError={t("category.noUsersFound")} />
      ) : (
        <div>
          <h1 className="flex place-content-center font-black text-xl">
            {t("back-office.users.title")}
          </h1>
          {thisUsersPage ? (
            <MyBackOfficeTable
              headers={usersHeaders}
              data={thisUsersPage}
              path={myPath}
              onDelete={deleteUser}
              canUpdate={false}
            />
          ) : (
            <></>
          )}
          <Pagination
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </Page>
  )
}

List.isPublic = false
export default List
