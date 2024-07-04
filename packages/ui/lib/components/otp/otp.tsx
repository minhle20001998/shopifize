import { isNil } from '@shopifize/helpers';
import { MuiOtpInput, MuiOtpInputProps } from 'mui-one-time-password-input'
import React from 'react'

export const CustomOTP = (props: MuiOtpInputProps) => {
  const {value, onChange, ...otpProps} = props;
  const [otp, setOtp] = React.useState(value)

  const otpValue = isNil(value) ? otp : value

  const handleChange = (newValue: string) => {
    setOtp(newValue)
    onChange?.(newValue)
  }

  return <>
    <MuiOtpInput {...otpProps}
      value={otpValue}
      onChange={handleChange}
      sx={{
        '& input': {
          maxWidth: '40px',
          width: '100%'
        }
      }}
    />
  </>
}