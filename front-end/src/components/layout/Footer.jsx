import NextLink from "next/link"
import Link from "../Link"
import { useTranslation } from "react-i18next"
import icons from "@/asset/linkCommonAsset"
import SpanLink from "../SpanLink"
import { useEffect, useState } from "react"

const MyFooter = () => {
  const { t } = useTranslation()
  const [imageSize, setImageSize] = useState(0)

  const updateImageSize = () => {
    if (window.innerWidth >= 1024) {
      setImageSize(50)

      return
    }

    if (window.innerWidth >= 640) {
      setImageSize(45)

      return
    }

    setImageSize(40)
  }

  useEffect(() => {
    updateImageSize()
    window.addEventListener("resize", updateImageSize)

    return () => {
      window.removeEventListener("resize", updateImageSize)
    }
  }, [imageSize])

  return (
    <footer className="fixed bottom-0 z-20 bg-my-brown h-14 sm:h-16 lg:h-20 px-5 w-full flex justify-between">
      <div className="flex justify-start items-center gap-2 sm:gap-4 text-xl">
        <NextLink href="/cgu">
          <SpanLink text={t("footer.TermsOfService")} />
        </NextLink>
        <SpanLink text="-" />
        <NextLink href="/contact">
          <SpanLink text={t("footer.contact")} />
        </NextLink>
        <SpanLink text="-" />
        <NextLink href="/legal">
          <SpanLink text={t("footer.legalInformation")} />
        </NextLink>
      </div>
      <div className="flex justify-end items-center pt-3 gap-4">
        <Link
          href=""
          img={icons.facebook}
          alt="facebook"
          width={imageSize}
          height={imageSize}
        />
        <Link
          href=""
          img={icons.instagram}
          alt="instagram"
          height={imageSize}
          width={imageSize}
        />
      </div>
    </footer>
  )
}

export default MyFooter
