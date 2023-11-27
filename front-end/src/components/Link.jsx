import Image from "next/image"
import NextLink from "next/link"

const Link = (props) => {
  const { img, href, alt, width, height, spanClassName, text, onClick } = props

  return (
    <NextLink href={href} legacyBehavior>
      <div className="flex justify-start pb-4 cursor-pointer">
        <Image src={img} alt={alt} width={width} height={height}></Image>
        {onClick ? (
          <a onClick={onClick} className={spanClassName}>
            {text}
          </a>
        ) : (
          <span className={spanClassName}>{text}</span>
        )}
      </div>
    </NextLink>
  )
}

export default Link
