import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import classNames from "classnames"
import Image from "next/image"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const Carousel = (props) => {
  const { images, imageDefault, className } = props
  const [current, setCurrent] = useState(0)
  const carouselImages = images && images.length >= 1 ? images : [imageDefault]
  const length = carouselImages.length

  const { t } = useTranslation()

  const nextImage = () => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }

  const prevImage = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(interval)
  })

  if (!Array.isArray(carouselImages) || carouselImages.length === 0) {
    return null
  }

  return (
    <section className={classNames("relative", className)}>
      {carouselImages.length > 1 && (
        <div
          onClick={prevImage}
          className="w-12 h-12 absolute top-1/2 left-0.5 sm:right-4 z-10 text-my-dark-brown cursor-pointer"
        >
          <ChevronLeftIcon />
        </div>
      )}
      <div>
        {carouselImages &&
          carouselImages.map((image, index) => {
            return (
              <div
                className={index === current ? "block" : "hidden"}
                key={index}
              >
                {index === current && (
                  <Image
                    src={image}
                    alt={t("carousel.imageAlt")}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )
          })}
      </div>
      {carouselImages.length > 1 && (
        <div
          onClick={nextImage}
          className="w-12 h-12 absolute top-1/2 right-0.5 sm:right-4 z-10 text-my-dark-brown cursor-pointer"
        >
          <ChevronRightIcon />
        </div>
      )}
    </section>
  )
}

export default Carousel
