import ErrorParagraph from "@/components/Error"
import FormField from "@/components/FormField"
import Page from "@/components/layout/Page"
import MyCustomButton from "@/components/MyCustomButton"
import useAppContext from "@/hooks/useAppContext"
import { createApi } from "@/services/api"
import { getUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export const getServerSideProps = async (context) => {
  const { userId } = context.params
  const api = createApi({
    jwt: context.req.cookies.session,
  })

  const args = { api, errorHandler }
  const getUser = getUserService(args)
  const [error, data] = await getUser(userId)

  if (error) {
    return { props: { error: error } }
  }

  return { props: { addresses: data.result.current_addresses, userId: userId } }
}

const initialValues = {
  addressId: "",
}

const Addresses = (props) => {
  const { addresses, userId } = props
  const { t } = useTranslation()
  const router = useRouter()
  const {
    actions: { createOrder, resetCart },
  } = useAppContext()
  const [err, setErr] = useState(null)

  const handleSubmit = useCallback(
    async (values) => {
      setErr(null)

      const [error, data] = await createOrder(values.addressId)

      if (error) {
        setErr(error)

        return error
      }

      resetCart()

      router.push(data.result.payment_link)

      return data
    },
    [createOrder, resetCart, router]
  )

  const getLabelAddress = (address) =>
    `${address.fullname}\n${address.street_name}\n${address.city} ${
      address.zipcode
    }\n${address.country}${address.complement ? `\n${address.complement}` : ""}`

  const handleAddAddresses = useCallback(() => {
    router.push(`/user/${userId}/createAddress`)
  }, [router, userId])

  return (
    <Page title={t("addresses.title")}>
      <main className="pt-28">
        <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
          {t("addresses.title")}
        </h1>
        <div>
          <div className="flex justify-center mt-10">
            <MyCustomButton
              name={t("addresses.add")}
              onClick={handleAddAddresses}
              classNameButton="px-4 py-2 w-fit rounded-full shadow-lg shadow-slate-400 active:shadow-inner active:shadow-slate-400"
            ></MyCustomButton>
          </div>
          {addresses && addresses.length > 0 && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              error={err}
            >
              {({ isSubmitting, isValid }) => (
                <Form className="flex flex-col items-center gap-6 mt-10">
                  <div className="flex flex-col items-start gap-6">
                    {addresses.map((address, index) => (
                      <FormField
                        name="addressId"
                        label={getLabelAddress(address)}
                        value={address.id}
                        type="radio"
                        key={index}
                        replaceDefaultClassName="flex flex-row-reverse gap-2"
                      ></FormField>
                    ))}
                  </div>
                  <button
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 w-fit rounded-full"
                  >
                    {t("addresses.continue")}
                  </button>
                </Form>
              )}
            </Formik>
          )}
          <ErrorParagraph messageError={t(err)} />
        </div>
      </main>
    </Page>
  )
}

export default Addresses
