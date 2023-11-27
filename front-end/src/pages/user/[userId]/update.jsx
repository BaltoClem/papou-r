import icons from "@/asset/linkCommonAsset"
import ErrorParagraph from "@/components/Error"
import FormField from "@/components/FormField"
import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import { createApi } from "@/services/api"
import { getUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import classNames from "classnames"
import { Form, Formik } from "formik"
import { t } from "i18next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

export const getServerSideProps = async (context) => {
  const { userId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const getUser = getUserService({ api, errorHandler })
  const [error, data] = await getUser(userId)

  if (error) {
    return { props: { error: error } }
  }

  return {
    props: { user: data.result },
  }
}

const Container = (props) => {
  const { children, className } = props

  return <div className={classNames("p-8", className)}>{children}</div>
}

const UpdateUserForm = (props) => {
  const { initialValues, validationSchema, err, handleSubmit } = props
  const { t } = useTranslation()

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      error={err}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form className="flex flex-col items-center gap-4 px-4">
          <FormField
            name="fullname"
            label={t("user.fullName")}
            className="w-80"
            value={values.fullname}
          />
          <FormField
            name="email"
            label={t("user.email")}
            type="email"
            className="w-80"
            value={values.email}
          />
          <FormField
            name="phoneNumber"
            label={t("user.phoneNumber")}
            className="w-80"
            value={values.phoneNumber}
          />
          <button
            disabled={isSubmitting || !isValid}
            type="submit"
            className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 mt-4 rounded-full"
          >
            {t("user.update.submit")}
          </button>
          {err && <ErrorParagraph messageError={t(err)} />}
        </Form>
      )}
    </Formik>
  )
}

const Profile = (props) => {
  const { name, email, phoneNumber, id } = props
  const { t } = useTranslation()
  const [err, setErr] = useState(null)
  const {
    actions: { updateUser },
  } = useAppContext()
  const router = useRouter()

  const userInitialValues = {
    fullname: name,
    email: email,
    phoneNumber: phoneNumber ? phoneNumber : "",
  }

  const validationSchema = yup.object().shape({
    fullname: yup.string().label(t("user.fullName")),
    email: yup.string().email(t("E.emailInvalid")),
    phoneNumber: yup
      .string()
      .matches(/[+](?:[0-9]●?){6,14}[0-9]$/, t("E.phoneNumberInvalid")),
  })

  const handleSubmit = useCallback(
    async ({ fullname, email, phoneNumber }) => {
      setErr(err)

      const result = await updateUser({
        userId: id,
        displayName: fullname,
        email: email,
        phoneNumber: phoneNumber,
      })

      if (result[0]) {
        setErr(result[0])

        return
      }

      router.push(`/user/${id}`)
    },
    [err, id, router, updateUser]
  )

  const handleReturnToUserPage = useCallback(
    () => router.push(`/user/${id}`),
    [id, router]
  )

  return (
    <Container className="flex justify-center">
      <div>
        <h3 className="text-center font-bold text-2xl">
          {t("user.accountInfo")}
        </h3>
        <button
          onClick={handleReturnToUserPage}
          className="absolute top-28 right-10"
        >
          <Image src={icons.cancel} alt="cancel" width={40} height={40} />
        </button>
        <div className="flex flex-col sm:flex-row mt-8 sm:mt-10">
          <Image
            src={icons.user}
            alt="My Image"
            width={300}
            height={300}
            className="bg-my-salmon border-8 border-my-dark-brown p-3"
          />
          <UpdateUserForm
            err={err}
            initialValues={userInitialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </Container>
  )
}

const Address = (props) => {
  const { address, router } = props
  const [err, setErr] = useState(null)
  const {
    actions: { deleteAddress },
  } = useAppContext()

  const handleDeleteAddress = useCallback(async () => {
    setErr(null)

    const result = await deleteAddress(address.id)

    if (result[0]) {
      setErr(result[0])

      return
    }

    router.push(`/user/${address.user_id}/update`)
  }, [address.id, address.user_id, deleteAddress, router])

  return (
    <div className="flex flex-col items-center gap-6 text-xl">
      {err && <ErrorParagraph messageError={t(err)} />}
      <div className="flex gap-8 text-my-dark-brown">
        <p className="mt-1">
          {`${address.street_name} - ${address.city} ${address.zipcode} - ${address.country} - `}
          {address.complement ? `${address.complement} - ` : null}{" "}
          {`${address.fullname}`}
        </p>
        <button onClick={handleDeleteAddress}>
          <Image src={icons.delete} alt="delete" width={35} height={35} />
        </button>
      </div>
      <div className="bg-my-dark-brown w-[80vh] h-px" />
    </div>
  )
}

const Addresses = (props) => {
  const { addresses, userId } = props
  const { t } = useTranslation()
  const router = useRouter()

  const handleAddAddress = useCallback(
    () => router.push(`/user/${userId}/createAddress`),
    [router, userId]
  )

  return (
    <Container>
      <div className="flex justify-center gap-8">
        <h3 className="font-bold text-2xl">{t("user.addressBook")}</h3>
        <button onClick={handleAddAddress}>
          <Image src={icons.add} alt="add" width={40} height={40} />
        </button>
      </div>
      <div className="flex flex-col items-center gap-6 mt-4">
        {addresses &&
          addresses.length > 0 &&
          addresses.map((address, index) => (
            <Address key={index} address={address} router={router} />
          ))}
      </div>
    </Container>
  )
}

const UpdateUser = (props) => {
  const { error, user } = props

  const { t } = useTranslation()

  return (
    <Page title={t("user.accountInfo")}>
      {error || !user ? (
        <p className="flex justify-center items-center text-xl py-4">
          {t(error)}
        </p>
      ) : (
        <main className="flex flex-col gap-3">
          <Profile
            name={user.display_name}
            email={user.email}
            phoneNumber={user.phone_number}
            id={user.id}
          />
          <div className="bg-my-dark-brown w-full h-3"></div>

          <Addresses addresses={user.current_addresses} userId={user.id} />
        </main>
      )}
    </Page>
  )
}

UpdateUser.isPublic = true
export default UpdateUser
