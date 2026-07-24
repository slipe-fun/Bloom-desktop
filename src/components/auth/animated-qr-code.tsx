import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"
import { motion } from "framer-motion"

interface QRCodeProps {
  data?: string
}

function PureQRCode({
  data = "bloom://auth?t=AQJP12NqtpWvZsdfXf5GM8kompGwOkNjYxODam",
}: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)

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

    if (ref.current) {
      ref.current.innerHTML = ""
      qrCode.append(ref.current)
    }
  }, [data])

  return <div ref={ref} />
}

// 2. Главный компонент: Карточка с минималистичной Apple-анимацией
export function AnimatedQRCode({ data }: QRCodeProps) {
  return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.75,
        }}
        className="relative origin-center rounded-4xl border border-black/10 bg-white p-4 shadow-[0_5px_24px_0px_rgba(0,0,0,0.08)]"
      >
        <PureQRCode data={data} />
      </motion.div>
  )
}
