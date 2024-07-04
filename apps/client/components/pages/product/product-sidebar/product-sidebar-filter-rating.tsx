import { CustomTypography, InvisibleButton, MUI } from "@shopifize/ui";
import Router, { useRouter } from "next/router";
import QueryString from "qs";

export const ProductSidebarFilterRating = () => {
  const ratings = [5, 4, 3, 2, 1];
  const route = useRouter();
  const queries = route.query;
  const ratingQuery = route.query.rating;
  const parseRatingQuery = isNaN(Number(ratingQuery))
    ? null
    : Number(ratingQuery);

  const handleClick = (rating: number) => async () => {
    const isChosen = parseRatingQuery !== null && parseRatingQuery === rating;
    if (isChosen) {
      const deletedRatingQuery = queries;
      delete deletedRatingQuery.rating;
      const query = QueryString.stringify({
        ...removeSlugFromQuery(deletedRatingQuery),
      });
      await Router.replace({
        pathname: location.pathname,
        search: query,
      });
    } else {
      const query = QueryString.stringify({
        ...removeSlugFromQuery(queries),
        rating,
      });
      await Router.replace({
        pathname: location.pathname,
        search: query,
      });
    }
  };

  return (
    <>
      {ratings.map((rating, index) => {
        const isChosen =
          parseRatingQuery !== null && parseRatingQuery === rating;
        if (index === 0) {
          return (
            <InvisibleButton
              key={rating}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition:
                    "transform 0.2s ease-in-out, filter 0.2s ease-in-out",
                },
                filter: !isChosen ? "grayscale(100%)" : "none",
              }}
              onClick={handleClick(rating)}
            >
              <MUI.Rating size="small" value={5} readOnly />
            </InvisibleButton>
          );
        }
        return (
          <>
            <InvisibleButton
              key={rating}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  transition:
                    "transform 0.2s ease-in-out, filter 0.2s ease-in-out",
                },
                filter: !isChosen ? "grayscale(100%)" : "none",
              }}
              onClick={handleClick(rating)}
            >
              <MUI.Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                <MUI.Rating size="small" value={rating} readOnly />
                <CustomTypography>& Up</CustomTypography>
              </MUI.Stack>
            </InvisibleButton>
          </>
        );
      })}
    </>
  );
};

export const removeSlugFromQuery = (
  query: {
    category?: string;
    "sub-category"?: string;
  } & Record<string, unknown>
) => {
  const result = query;
  delete result.category;
  delete result["sub-category"];
  return result;
};
