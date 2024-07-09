import {
  CustomButton,
  CustomTextarea,
  CustomTypography,
  MUI,
} from "@shopifize/ui";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { useAuthContext } from "~/contexts/AuthContext";
import {
  useCreateCommentMutation,
  useInvalidateGetProduct,
} from "~/queries/products";

const LIMIT = 250;

const validationSchema = Yup.object().shape({
  comment: Yup.string()
    .required("Comment is required")
    .max(LIMIT, "Reached characters limit"),
  rating: Yup.number().required("Rating is required"),
});

export type CommentFormType = Yup.InferType<typeof validationSchema>;

export const ProductDetailCommentInput = ({
  id,
  productVariantId,
  refetch,
}: {
  id: string | undefined;
  productVariantId?: string;
  refetch: () => void;
}) => {
  const { mutate: createComment } = useCreateCommentMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthen, isCheckingAuthen } = useAuthContext();
  const router = useRouter();
  const { invalidateGetProduct } = useInvalidateGetProduct();

  const handleSubmit = (values: CommentFormType) => {
    if (productVariantId) {
      createComment(
        {
          comment: values.comment,
          productVariantId: productVariantId,
          rating: values.rating,
        },
        {
          onSuccess: async () => {
            formik.resetForm();
            enqueueSnackbar("Comment successfully", { variant: "success" });
            refetch();
            id && (await invalidateGetProduct(id));
          },
          onError: () => {
            enqueueSnackbar("Failed to comment", { variant: "error" });
          },
        }
      );
    }
  };

  const formik = useFormik<CommentFormType>({
    validationSchema,
    initialValues: {
      comment: "",
      rating: 5,
    },
    onSubmit: handleSubmit,
  });

  const commentLength = formik.values.comment.length;

  return (
    <form onSubmit={formik.handleSubmit}>
      <MUI.Stack gap={"0.5rem"}>
        <CustomTextarea
          disabled={!isAuthen || isCheckingAuthen}
          isError={false}
          name="comment"
          helperTextHidden
          sx={{
            "& textarea": {
              minHeight: "80px",
              backgroundColor: (theme) => theme.customPalette.backgroundPrimary,
            },
          }}
          placeholder="Comment here (250 characters limit)"
          formik={formik}
        />
        <MUI.Rating
          disabled={!isAuthen || isCheckingAuthen}
          value={formik.values.rating}
          onChange={async (e, value) => {
            if (value != null) {
              await formik.setFieldValue("rating", value);
            }
          }}
        />
        <MUI.Stack direction={"row"} justifyContent={"space-between"}>
          {isAuthen && !isCheckingAuthen ? (
            <CustomButton
              fullWidth={false}
              type="submit"
              disabled={commentLength > LIMIT || commentLength === 0}
            >
              Comment
            </CustomButton>
          ) : (
            <CustomButton
              href={`/login?redirect=${router.pathname}`}
              fullWidth={false}
            >
              Login to comment
            </CustomButton>
          )}
          <CustomTypography
            sx={{
              color: (theme) =>
                commentLength > LIMIT
                  ? theme.customPalette.severeWarningStatus
                  : theme.customPalette.primaryText,
            }}
          >
            {commentLength}/{LIMIT}
          </CustomTypography>
        </MUI.Stack>
      </MUI.Stack>
    </form>
  );
};
