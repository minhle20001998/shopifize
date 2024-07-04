import { MUI } from "@shopifize/ui";

export const ProductItemSkeleton = () => {
  return (
    <MUI.Stack
      sx={{
        backgroundColor: "common.white",
        borderRadius: "4px",
        opacity: "0.5",
      }}
    >
      <MUI.Skeleton
        sx={{ height: "180px" }}
        animation="wave"
        variant="rectangular"
      />
      <MUI.Box sx={{ padding: "10px" }}>
        <MUI.Skeleton
          animation="wave"
          height={10}
          style={{ marginBottom: 8 }}
        />
        <MUI.Skeleton
          animation="wave"
          height={10}
          width="80%"
          style={{ marginBottom: 8 }}
        />
        <MUI.Skeleton animation="wave" height={10} width="50%" />
      </MUI.Box>
    </MUI.Stack>
  );
};
