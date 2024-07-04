import {
  CustomButton,
  CustomTextarea,
  CustomTypography,
  MUI,
} from "@shopifize/ui";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { useCreateCommentMutation } from "~/queries/products";

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
  refetch,
}: {
  id: string | undefined;
  refetch: () => void;
}) => {
  const { mutate: createComment } = useCreateCommentMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values: CommentFormType) => {
    if (id) {
      createComment(
        {
          comment: values.comment,
          productId: id,
          rating: values.rating,
        },
        {
          onSuccess: () => {
            formik.resetForm();
            enqueueSnackbar("Comment successfully", { variant: "success" });
            refetch();
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
          value={formik.values.rating}
          onChange={async (e, value) => {
            if (value != null) {
              await formik.setFieldValue("rating", value);
            }
          }}
        />
        <MUI.Stack direction={"row"} justifyContent={"space-between"}>
          <CustomButton
            fullWidth={false}
            type="submit"
            disabled={commentLength > LIMIT || commentLength === 0}
          >
            Comment
          </CustomButton>
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
