import React from 'react'
import logo from '@/assets/lorem-logo.png' // Make sure you have your correct images referenced here
import logoDark from '@/assets/lorem-logo-dark.png' // Make sure you have your correct images referenced here
import Image from 'next/image'

export default function Logo() {
  return (
    <div>
      <Image className="h-20 object-contain dark:hidden" src={logo} alt="" /> // This determines
      which logo would show based on user settings
      <Image className="h-20 object-contain hidden dark:block" src={logoDark} alt="" />
    </div>
  )
}
