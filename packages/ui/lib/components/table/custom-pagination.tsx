import { Pagination, SelectChangeEvent, Stack } from "@mui/material"
import { CustomSelect, CustomTypography } from ".."
import { ChangeEvent, ReactNode } from "react";
import useMobileScreen from "../../hooks/use-mobile-screen";

interface Props {
  rowsPerPage?: number;
  count: number;
  selectionCount: number;
  page: number;
  onPaginationChange: ((event: ChangeEvent<unknown>, page: number) => void)
  onRowsPerPageChange: ((event: SelectChangeEvent<unknown>, child: ReactNode) => void)
}

export const CustomPagination = ({ count, onPaginationChange, onRowsPerPageChange, page, rowsPerPage, selectionCount }: Props) => {
  const isMobileSize = useMobileScreen()

  return <Stack
    direction={'row'}
    justifyContent={'space-between'}
    alignItems={'center'}
    sx={{
      padding: '1rem',
      flexDirection: isMobileSize ? 'column' : 'row'
    }}>
    <CustomTypography>Selected items: {selectionCount} item(s)</CustomTypography>
    <Stack
      direction={'row'}
      alignItems={'center'}
      gap={'1rem'}
      flexBasis={'50%'}
      justifyContent={'flex-end'}
      sx={{
        flexDirection: isMobileSize ? 'column' : 'row'
      }}>
      <CustomTypography >Rows per page</CustomTypography>
      <CustomSelect
        sx={{ width: 'fit-content' }}
        helperTextHidden
        defaultValue={10}
        value={rowsPerPage}
        onChange={onRowsPerPageChange}
        options={[
          {
            id: 5, label: '5'
          },
          {
            id: 10, label: '10'
          },
          {
            id: 50, label: '50'
          },
          {
            id: 100, label: '100'
          },
        ]}
      />
      <Pagination count={count} page={page} onChange={onPaginationChange} color="primary" />
    </Stack>
  </Stack>
}