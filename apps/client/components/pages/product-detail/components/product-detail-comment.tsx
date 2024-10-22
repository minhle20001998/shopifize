import {
  CustomAvatar,
  CustomButton,
  CustomPagination,
  CustomTypography,
  MUI,
  usePaginationQuery,
} from "@shopifize/ui";
import { ContentWrapper } from "~/components/ui";
import { ProductDetailCommentInput } from "./product-detail-comment-input";
import { useGetCommentsQuery } from "~/queries/products";
import dayjs from "dayjs";
import { useRef } from "react";

export const ProductDetailComment = ({
  id,
  productVariantId,
}: {
  id?: string;
  productVariantId?: string;
}) => {
  const { limit, skip } = usePaginationQuery();
  const { data, refetch } = useGetCommentsQuery(
    {
      productVariantId: productVariantId!,
      limit: limit,
      skip: skip,
    },
    {
      enabled: !!productVariantId,
    }
  );
  const commentRef = useRef<HTMLDivElement | null>(null);

  const comments = data?.data.data;

  return (
    <ContentWrapper sx={{ marginBottom: "1rem" }}>
      <ContentWrapper>
        <CustomTypography
          variant="h2"
          sx={{
            fontSize: (theme) => theme.customTypography.fontSizes.body1,
          }}
        >
          Product Ratings
        </CustomTypography>
      </ContentWrapper>
      <ContentWrapper
        sx={{
          backgroundColor: (theme) => theme.customPalette.main10,
          marginBottom: "1rem",
        }}
      >
        <MUI.Stack
          direction={"row"}
          gap={"1rem"}
          flexWrap={"wrap"}
          ref={commentRef}
        >
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            All
          </CustomButton>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            5 Star
          </CustomButton>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            4 Star
          </CustomButton>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            3 Star
          </CustomButton>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            2 Star
          </CustomButton>
          <CustomButton
            fullWidth={false}
            variant="outlined"
            sx={{
              backgroundColor: (theme) => theme.customPalette.background,
            }}
          >
            1 Star
          </CustomButton>
        </MUI.Stack>
      </ContentWrapper>
      <ProductDetailCommentInput
        refetch={refetch}
        id={id}
        productVariantId={productVariantId}
      />
      <ContentWrapper>
        <MUI.Stack gap={"1rem"} marginTop={"1rem"}>
          {comments?.map((comment) => {
            return (
              <>
                <MUI.Stack direction={"row"} gap={"0.75rem"} key={comment.id}>
                  <CustomAvatar>b</CustomAvatar>
                  <MUI.Stack gap={"0.2rem"}>
                    <CustomTypography
                      sx={{
                        fontSize: (theme) =>
                          theme.customTypography.fontSizes.label1,
                      }}
                    >
                      {comment.user.profile.username}
                    </CustomTypography>
                    <MUI.Rating size="small" value={comment.rating} readOnly />
                    <CustomTypography
                      sx={{
                        color: (theme) => theme.customPalette.grey70,
                        fontSize: (theme) =>
                          theme.customTypography.fontSizes.label1,
                      }}
                    >
                      {dayjs(comment.created_at).format("DD/MM/YYYY HH:MM")}
                    </CustomTypography>
                    <CustomTypography sx={{ marginTop: "0.5rem" }}>
                      {comment.comment}
                    </CustomTypography>
                  </MUI.Stack>
                </MUI.Stack>
                <MUI.Divider />
              </>
            );
          })}
        </MUI.Stack>
        <MUI.Stack
          direction={"row"}
          justifyContent={"center"}
          sx={{ paddingTop: "2rem" }}
        >
          {data?.data ? (
            <CustomPagination
              onPaginationChanging={() => {
                commentRef.current?.scrollIntoView();
              }}
              pagination={{
                limit: limit,
                skip: skip,
                total: data?.data.total || 0,
              }}
            />
          ) : (
            <></>
          )}
        </MUI.Stack>
      </ContentWrapper>
    </ContentWrapper>
  );
};
