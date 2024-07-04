import { CustomCard, CustomTypography, MUI, useTheme } from "@shopifize/ui";
import AvatarProfile from "./avatar";
import { stringAvatar } from "@shopifize/helpers";
import ProfileForm from "./profile-form";
import { useProfileQuery } from "queries";

export const ProfileContent = () => {
  const { profile } = useProfileQuery();
  const theme = useTheme();

  return (
    <CustomCard>
      <MUI.Stack direction={"column"} sx={{ height: "100%" }}>
        <CustomTypography
          sx={{
            fontSize: theme.customTypography.fontSizes.header5,
            fontWeight: theme.fontWeight.semiBold,
          }}
        >
          My Profile
        </CustomTypography>
        <CustomTypography
          sx={{ fontSize: theme.customTypography.fontSizes.body2 }}
        >
          Manage your account profile
        </CustomTypography>
        <MUI.Grid container sx={{ marginTop: "1rem", flex: 1 }}>
          <MUI.Grid item sm={3} width={"100%"}>
            <MUI.Stack alignItems={"center"} sx={{ marginTop: "1rem" }}>
              <AvatarProfile
                {...stringAvatar(profile?.fullName ?? "User")}
              ></AvatarProfile>
            </MUI.Stack>
          </MUI.Grid>
          <MUI.Grid item sm={9} sx={{ paddingX: "1rem" }}>
            <ProfileForm />
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Stack>
    </CustomCard>
  );
};
