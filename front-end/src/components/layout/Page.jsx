import Head from "next/head"
import Footer from "./Footer"
import Header from "./Header"

const Page = (props) => {
  const { title = "Airneis", children } = props

  return (
    <main className="bg-my-beige min-w-screen w-full min-h-screen h-full">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="pb-24">
        <Header />
        <section>{children}</section>
      </div>
      <Footer />
    </main>
  )
}

export default Page
