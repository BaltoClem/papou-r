import Image from "next/image"
import Link from "./../Link"
import NextLink from "next/link"
import { useState, useEffect } from "react"
import classNames from "classnames"
import { useTranslation } from "react-i18next"
import useAppContext from "@/hooks/useAppContext"
import icons from "@/asset/linkCommonAsset"

const DisconnectedBurgerMenu = (props) => {
  const { t } = props

  return (
    <div className="mt-20 px-5">
      <Link
        href="/login"
        img={icons.login}
        alt={t("header.login")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.login")}
      />
      <Link
        href="/register"
        img={icons.signUp}
        alt={t("header.register")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.register")}
      />
      <Link
        href=""
        img={icons.info}
        alt={t("header.informations")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.informations")}
      />
    </div>
  )
}

const ConnectedBurgerMenu = (props) => {
  const { logOut, t, userId } = props
  const {
    actions: { isAdmin },
  } = useAppContext()
  const [isAnAdmin, setIsAnAdmin] = useState(null)

  useEffect(() => {
    isAdmin().then((response) => {
      setIsAnAdmin(response)
    })
  }, [isAdmin, userId])

  return (
    <div className="mt-20 px-5">
      <Link
        href={`/user/${userId}`}
        img={icons.user}
        alt={t("header.account")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.account")}
      />
      <Link
        href={`/user/${userId}/orders`}
        img={icons.orders}
        alt={t("header.orders")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.orders")}
      />
      <Link
        href="/"
        img={icons.logout}
        alt={t("header.logout")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.logout")}
        onClick={logOut}
      />
      <Link
        href=""
        img={icons.info}
        alt={t("header.informations")}
        width={45}
        height={45}
        spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
        text={t("header.informations")}
      />
      {isAnAdmin ? (
        <Link
          href="/back-office/home"
          img={icons.info}
          alt={t("header.informations")}
          width={45}
          height={45}
          spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
          text="BackOffice"
        />
      ) : (
        <></>
      )}
    </div>
  )
}

const MyHeader = () => {
  const [isOpen, setOpen] = useState(false)
  const {
    state: { session },
    actions: { logOut },
  } = useAppContext()
  const { t } = useTranslation()
  const userId = session ? session.user.id : null

  const handleClickMenuBurger = () => {
    setOpen(!isOpen)
  }

  return (
    <>
      <header className="pb-0.5 flex justify-between">
        <NextLink href="/" className="p-2">
          <Image src={icons.logo} alt="Airneis" width={170} height={55}></Image>
        </NextLink>
        <div className="flex p-2 gap-2 sm:gap-7">
          <NextLink href="">
            <Image
              src={icons.search}
              alt={t("header.search")}
              width={45}
              height={45}
            ></Image>
          </NextLink>
          <NextLink href="/cart" className="pt-1">
            <Image
              src={icons.basket}
              alt={t("header.basket")}
              width={60}
              height={44}
            ></Image>
          </NextLink>
          <button onClick={handleClickMenuBurger}>
            <Image
              src={icons.menu}
              alt={t("header.menu")}
              width={50}
              height={50}
            ></Image>
          </button>
        </div>
        <div
          className={classNames(
            "py-5 w-full h-full sm:w-80 bg-my-brown z-30 absolute right-0",
            isOpen ? "block" : "hidden"
          )}
        >
          <button className="right-4 absolute" onClick={handleClickMenuBurger}>
            <Image
              src={icons.cancel}
              alt={t("header.cancel")}
              width={30}
              height={30}
            ></Image>
          </button>
          {userId ? (
            <ConnectedBurgerMenu logOut={logOut} t={t} userId={userId} />
          ) : (
            <DisconnectedBurgerMenu t={t} />
          )}

          <div className="absolute flex justify-around w-full bottom-0 pb-2">
            <div className="flex flex-col">
              <NextLink href="">
                <span className="text-my-dark-brown">
                  {t("header.termsOfService")}
                </span>
              </NextLink>
              <NextLink href="/contact">
                <span className="text-my-dark-brown">
                  {t("header.contact")}
                </span>
              </NextLink>
              <NextLink href="">
                <span className="text-my-dark-brown">
                  {t("header.legalInformation")}
                </span>
              </NextLink>
            </div>
            <div className="flex gap-4 pt-2">
              <Link
                href=""
                img={icons.facebook}
                alt="facebook"
                width={50}
                height={50}
              />
              <Link
                href=""
                img={icons.instagram}
                alt="instagram"
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="bg-my-dark-brown w-full h-3"></div>
    </>
  )
}

export default MyHeader
