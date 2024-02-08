/* eslint-disable @next/next/no-img-element */
import { type ImgHTMLAttributes, forwardRef } from "react"

type Ref = HTMLImageElement
type Props = ImgHTMLAttributes<HTMLImageElement>

export const Img = forwardRef<Ref, Props>(({ src, alt, loading, ...props }, ref) => (
   <img
      ref={ref}
      src={src}
      alt={alt ?? src?.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))}
      loading={loading ?? "lazy"}
      {...props}
   />
))

Img.displayName = 'AutoImage'