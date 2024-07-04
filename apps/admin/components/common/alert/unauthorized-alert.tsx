import { Alert, MUIIcon } from "@shopifize/ui"

export const UnAuthorizedAlert = (props: { actionText: string }) => {
  const { actionText } = props
  return <Alert icon={<MUIIcon.DoNotDisturb fontSize="inherit" />} severity="error">
    Your account does not have permisison to {actionText}
  </Alert>
}