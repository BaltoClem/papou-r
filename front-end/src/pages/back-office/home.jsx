import useAppContext from "@/hooks/useAppContext"
import { useCallback } from "react"
import { useRouter } from "next/router"

import Page from "@/components/layout/Page"
import MyCustomButton from "@/components/MyCustomButton"

const BackOffice = () => {
  const {
    actions: { checkIsAdmin },
  } = useAppContext()
  const router = useRouter()

  checkIsAdmin()

  const handleClickProduct = useCallback(() => {
    router.push("/back-office/products/list")
  }, [router])

  const handleClickMaterial = useCallback(() => {
    router.push("/back-office/materials/list")
  }, [router])

  const handleClickDimensions = useCallback(() => {
    router.push("/back-office/dimensions/list")
  }, [router])

  const handleClickCategories = useCallback(() => {
    router.push("/back-office/categories/list")
  }, [router])

  const handleClickUsers = useCallback(() => {
    router.push("/back-office/users/list")
  }, [router])

  const handleClickImages = useCallback(() => {
    router.push("/back-office/images/list")
  }, [router])

  const buttonStyle = "mx-2 my-3"

  return (
    <Page title="BackOffice">
      <h1 className="flex place-content-center font-black text-xl">
        Back-Office
      </h1>
      <ul>
        <MyCustomButton
          name={"Products"}
          onClick={handleClickProduct}
          classNameButton={buttonStyle}
        ></MyCustomButton>
        <MyCustomButton
          name={"Materials"}
          onClick={handleClickMaterial}
          classNameButton={buttonStyle}
        ></MyCustomButton>
        <MyCustomButton
          name={"Dimensions"}
          onClick={handleClickDimensions}
          classNameButton={buttonStyle}
        ></MyCustomButton>
        <MyCustomButton
          name={"Categories"}
          onClick={handleClickCategories}
          classNameButton={buttonStyle}
        ></MyCustomButton>
        <MyCustomButton
          name={"Users"}
          onClick={handleClickUsers}
          classNameButton={buttonStyle}
        ></MyCustomButton>
        <MyCustomButton
          name={"Images"}
          onClick={handleClickImages}
          classNameButton={buttonStyle}
        ></MyCustomButton>
      </ul>
    </Page>
  )
}

export default BackOffice
