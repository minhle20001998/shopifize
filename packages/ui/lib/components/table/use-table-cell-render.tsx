import { Stack } from "@mui/material"
import { ActionVariant, ColumnType, CustomButton, CustomTypography, TableId } from ".."
import { MUIIcon } from "../../icon"

interface RenderProps<T> {
  data: T, _: TableId<T>, value: unknown, renderType?: ColumnType<T>
}

export const useTableCellRender = <T,>() => {

  const renderCell = (data: T, _: TableId<T>, value: unknown, renderType?: ColumnType<T>) => {
    const props = {
      data, _, value, renderType
    }
    if (!renderType) {
      return <CustomTypography sx={{ wordBreak: 'break-word' }}>{value as string}</CustomTypography>
    }
    else if (renderType.custom) {
      return renderType.custom(data)
    }
    else if (renderType.actions) {
      return renderActions(props)
    }
    return <CustomTypography sx={{ wordBreak: 'break-word' }}>{value as string}</CustomTypography>
  }

  const renderActions = (props: RenderProps<T>) => {
    const listActions = props.renderType?.actions

    return <Stack sx={{
      flexDirection: {
        xs: 'column', // theme.breakpoints.up('xs')
        sm: 'column', // theme.breakpoints.up('sm')
        md: 'column', // theme.breakpoints.up('md')
        lg: 'row', // theme.breakpoints.up('lg')
        xl: 'row', // theme.breakpoints.up('xl')
      }
    }} gap={'1rem'} justifyContent={'flex-end'}>
      {listActions?.map((action) => {
        const { href, style = 'text' } = action
        const hrefProps: { href?: string } = {}
        if (href) {
          if (typeof href === 'string') {
            hrefProps.href = href
          } else if (typeof href === 'function') {
            hrefProps.href = href(props.data)
          }
        }
        return <CustomButton
          {...hrefProps}
          key={action.name}
          sx={{ width: 'fit-content' }}
          variant={ style === 'text' ? 'outlined' : 'text'}
          color={action.variant === 'add' ? 'primary' : action.variant === 'edit' ? 'info' : 'error'}
          onClick={() => { action.callback?.(props.data) }}
        >
          {style === 'text' ? action.name : renderActionIcon(action.variant)}
        </CustomButton>
      })}
    </Stack>
  }

  return { renderCell }
}

const renderActionIcon = (variant: ActionVariant) => {
  switch (variant) {
    case 'add':
      return <MUIIcon.AddOutlined />
    case 'edit':
      return <MUIIcon.EditOutlined />
    case 'delete':
      return <MUIIcon.DeleteOutline />
  }
}