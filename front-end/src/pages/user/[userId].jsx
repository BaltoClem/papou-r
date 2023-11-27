import Image from "next/image"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import classNames from "classnames"
import { createApi } from "@/services/api"
import { getUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import icons from "@/asset/linkCommonAsset"
import Link from "@/components/Link"

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

const Profile = (props) => {
  const { name, email, phoneNumber, id } = props
  const { t } = useTranslation()

  return (
    <Container className="flex justify-center items-center">
      <div>
        <div className="flex justify-center gap-4">
          <h3 className="text-center font-bold text-2xl">
            {t("user.accountInfo")}
          </h3>
          <Link
            href={`/user/${id}/update`}
            img={icons.edit}
            alt={t("user.edit")}
            width={35}
            height={35}
            spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
          />
        </div>
        <div className="flex flex-col sm:flex-row mt-8 sm:mt-10">
          <Image
            src={icons.user}
            alt="My Image"
            width={300}
            height={300}
            className="bg-my-salmon border-8 border-my-dark-brown p-3"
          />
          <ul className="list-none flex flex-col gap-4 sm:gap-8 mt-5 sm:mt-0 items-center sm:justify-center sm:items-stretch sm:ml-16">
            <li>
              {t("user.fullName")}: {name}
            </li>
            <li>
              {t("user.email")}: {email}
            </li>
            <li>
              {t("user.phoneNumber")}: {phoneNumber}
            </li>
          </ul>
        </div>
      </div>
    </Container>
  )
}

const Address = (props) => {
  const { address } = props

  return (
    <div className="flex flex-col items-center gap-6 text-xl">
      <p>
        {`${address.street_name} - ${address.city} ${address.zipcode} - ${address.country} - `}
        {address.complement ? `${address.complement} - ` : null}{" "}
        {`${address.fullname}`}
      </p>
      <div className="bg-my-dark-brown w-[80vh] h-px" />
    </div>
  )
}

const Addresses = (props) => {
  const { addresses } = props
  const { t } = useTranslation()

  return (
    <Container>
      <h3 className="text-center font-bold text-2xl">
        {t("user.addressBook")}
      </h3>
      <div className="flex flex-col items-center gap-6 mt-4">
        {addresses &&
          addresses.length > 0 &&
          addresses.map((address, index) => (
            <Address key={index} address={address} />
          ))}
      </div>
    </Container>
  )
}

const UserPage = (props) => {
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

          <Addresses addresses={user.current_addresses} />
        </main>
      )}
    </Page>
  )
}

UserPage.isPublic = true
export default UserPage
