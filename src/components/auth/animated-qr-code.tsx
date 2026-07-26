import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"
import { motion } from "framer-motion"
import { EASING } from "@/constants/animations-easing"
import Image from "@/assets/icons/image.svg?react"
import FaceID from "@/assets/icons/faceId.svg?react"
import Star from "@/assets/icons/star.svg?react"

interface QRCodeProps {
  data?: string
}

const MotionImage = motion.create(Image)
const MotionFaceID = motion.create(FaceID)
const MotionStar = motion.create(Star)

function PureQRCode({
  data = "bloom://auth?t=AQJP12NqtpWvZsdfXf5GM8kompGwOkNjYxODam",
}: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 235,
      height: 235,
      type: "svg",
      shape: "square",
      data: data,
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "M",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
      },
      dotsOptions: {
        type: "extra-rounded",
        color: "#000000",
        roundSize: true,
      },
      backgroundOptions: {
        round: 0,
        color: "transparent",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000",
      },
      cornersDotOptions: {
        type: "extra-rounded",
        color: "#000000",
      },
    })

    qrCodeRef.current = qrCode

    if (ref.current) {
      ref.current.innerHTML = ""
      qrCode.append(ref.current)
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = ""
      }
    }
  }, []) 

  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({ data })
    }
  }, [data])

  return <div ref={ref} />
}

export function AnimatedQRCode({ data }: QRCodeProps) {
  return (
    <div className="relative flex h-67.25 w-67.25">
      <MotionImage
        initial={{
          opacity: 0,
          scale: 0.5,
          filter: "blur(6px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(3px)",
        }}
        transition={EASING.springyTimed}
        className="absolute right-0 h-23 w-23 rotate-17 text-blue-500 -translate-x-7.5 -translate-y-12.5"
      />
      <MotionFaceID
        initial={{
          opacity: 0,
          scale: 0.5,
          filter: "blur(2px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(1px)",
        }}
        transition={{
          ...EASING.springyTimed,
          delay: 0.05,
        }}
        className="absolute bottom-0 h-21.75 w-21.75 -translate-x-11 translate-y-4.75 -rotate-19 text-yellow-500"
      />
      <MotionStar
        initial={{
          opacity: 0,
          scale: 0.5,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(2px)",
        }}
        transition={{
          ...EASING.springyTimed,
          delay: 0.1,
        }}
        className="absolute right-0 bottom-0 h-20.5 w-20.5 rotate-11 text-orange-500 translate-x-11.25 translate-y-2.25"
      />
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={EASING.springyTimed}
        className="relative h-67.25 w-67.25 origin-center rounded-4xl border border-black/10 bg-white p-4 shadow-[0_5px_24px_0px_rgba(0,0,0,0.08)]"
      >
        <PureQRCode data={data} />
      </motion.div>
    </div>
  )
}