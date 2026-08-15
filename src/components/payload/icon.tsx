import React from 'react'
import logo from '@/assets/lorem-icon.png'
import Image from 'next/image'

export default function Icon() {
  return (
    <div>
      <Image className="w-40" src={logo} alt="" /> // Note that we don't have a dark mode version
      because the icon is red
    </div>
  )
}
