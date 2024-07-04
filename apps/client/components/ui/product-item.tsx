import { default as NextLink } from "next/link";
import React from "react";
import { formatCurrency } from "~/utils/format-money";
import {
  CustomChip,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";

export interface IProductItemProps {
  id: string;
  title?: string;
  img?: string;
  votes?: number;
  sold?: number;
  price?: number;
  category?: string;
}

const ProductItem = (props: IProductItemProps) => {
  const theme = useTheme();

  const {
    id,
    title = "Unknown product name",
    img = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
    votes = 0,
    sold = 0,
    price = 0,
    category,
  } = props;

  return (
    <NextLink href={`/product/${id}`} passHref legacyBehavior>
      <MUI.Link
        sx={{
          textDecoration: "none",
          "&:hover > div": {
            transition: "all 0.25s",
            boxShadow: "0 0 20px rgb(0 0 0 / 10%)",
          },
        }}
      >
        <MUI.Stack
          sx={{ backgroundColor: "common.white", borderRadius: "4px" }}
        >
          <MUI.Box>
            {/* eslint-disable-next-line @next/next/no-img-element  */}
            <img
              src={img}
              alt="product"
              style={{
                width: "100%",
                height: "180px",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            />
          </MUI.Box>
          <MUI.Stack sx={{ padding: "10px" }} gap={"4px"}>
            <CustomTypography
              sx={{
                fontSize: "0.9rem",
                color: "text.primary",
              }}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </CustomTypography>
            <MUI.Stack direction={"row"} gap={"8px"}>
              <MUI.Stack direction={"row"} gap={"4px"} alignItems={"center"}>
                <CustomTypography
                  sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                >
                  {votes}
                </CustomTypography>
                <MUIIcon.Star sx={{ fontSize: "0.9rem", color: "#fdd836" }} />
              </MUI.Stack>
              <CustomTypography
                sx={{ fontSize: "0.8rem", color: "text.secondary" }}
              >
                {sold} sold
              </CustomTypography>
            </MUI.Stack>
            <CustomTypography
              sx={{
                fontWeight: "bold",
                marginTop: "4px",
                color: theme.customPalette.main,
              }}
            >
              {formatCurrency(price)}
            </CustomTypography>
            {category ? (
              <CustomChip
                key={category}
                label={category?.toLowerCase()}
                sx={{
                  fontSize: "0.7rem",
                  height: "20px",
                  borderColor: theme.customPalette.main,
                  color: theme.customPalette.main,
                }}
                variant={"outlined"}
              />
            ) : (
              <></>
            )}
            {/* {categories.length > 0 ? (
              <MUI.Stack
                direction={"row"}
                gap={"8px"}
                marginTop={"4px"}
                flexWrap={"wrap"}
              >
                {categories.map((category) => {
                  return (
                    <CustomChip
                      key={category}
                      label={category.toLowerCase()}
                      sx={{
                        fontSize: "0.7rem",
                        height: "20px",
                        borderColor: theme.customPalette.main,
                        color: theme.customPalette.main,
                      }}
                      variant={"outlined"}
                    />
                  );
                })}
              </MUI.Stack>
            ) : (
              <></>
            )} */}
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Link>
    </NextLink>
  );
};

export default ProductItem;
