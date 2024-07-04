import { CustomTypography, MUI } from '@shopifize/ui'
import Head from 'next/head'
import React from 'react'
import { LoginForm } from '~/components/pages'

const backgroundImageUrl = 'https://images2.alphacoders.com/128/1289214.jpg'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Shopifize - Login</title>
      </Head>
      <MUI.Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <LoginForm/>
      </MUI.Box>
    </>
  )
}
