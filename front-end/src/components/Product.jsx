import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback } from "react"

const Product = (props) => {
  const { name, price, img, productId } = props
  const router = useRouter()

  const handleClickProduct = useCallback(
    (event) => {
      const productId = Number.parseInt(
        event.currentTarget.getAttribute("data-product-id"),
        10
      )
      router.push(`/products/${productId}`)
    },
    [router]
  )

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      data-product-id={productId}
      onClick={handleClickProduct}
    >
      <div className="h-[200px] w-full sm:h-[250px] sm:w-[300px] sm:min-w-[200px] lg:h-[300px] lg:w-[350px] relative">
        <Image
          src={img}
          alt={name}
          fill
          className="bg-my-brown object-cover"
        ></Image>
      </div>
      <div className="w-full text-md sm:text-base flex justify-around">
        <p className="text-my-dark-brown">{name}</p>
        <p className="text-my-dark-brown">{price} £</p>
      </div>
    </div>
  )
}

export default Product
