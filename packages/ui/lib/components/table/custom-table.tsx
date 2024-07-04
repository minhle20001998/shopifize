import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CustomCheckbox, CustomIconButton, CustomTypography } from "..";
import { Menu, Stack, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Theme } from "@mui/material";
import { useTheme } from "../../contexts";
import { useTableCellRender } from "./use-table-cell-render";
import { useTableSorting } from "./use-table-sorting";
import { useTableCellSelection } from "./use-table-cell-selection";
import { PaginationResponseType } from "@shopifize/helpers";
import { useTablePagination } from "./use-table-pagination";
import { ArrowDownward, ArrowUpward, FilterAlt } from "@mui/icons-material";
import { useTableFilter } from "./use-table-filter";
import { CustomTableFilterForm } from "./custom-table-filter-form";
import { CustomPagination } from "./custom-pagination";
import { useDeepCompareMemo, useDeepCompareEffect } from 'use-deep-compare'

export type ActionVariant = 'add' | 'edit' | 'delete'
export type ActionStyle =  'text' | 'icon'
export interface ActionVariants<T> {
  name: string
  variant: ActionVariant
  style?: ActionStyle
  href?: string | ((data: T) => string)
  callback?: (data: T) => void
}

export type TableId<T> = keyof T | 'actions'

export interface ColumnType<T> {
  actions?: ActionVariants<T>[]
  custom?: (data?: T) => React.ReactNode
}

export interface Column<T> {
  id: TableId<T>
  name: string
  sort?: boolean
  type?: ColumnType<T>
  style?: SxProps<Theme>
}

export interface CustomTableProps<T> {
  data: T[]
  columns: Column<T>[]
  enableRowSelection?: boolean
  pagination?: PaginationResponseType
  onRowSelection?: (data: T[]) => void
}

export const CustomTable = <T,>(props: CustomTableProps<T>) => {
  const { data, columns, enableRowSelection = false, pagination, onRowSelection } = props;
  const theme = useTheme()
  const { sorting, setSorting } = useTableSorting()
  const { renderCell } = useTableCellRender<T>()
  const { dataSet, selectionCount, setDataSet, handleAllRowSelection, handleRowSelection } = useTableCellSelection<T>({
    callback: onRowSelection,
    data: data
  })
  const { anchorEl, id, title, handleClick: handleFilterClick, handleClose, getIsFiltering, open } = useTableFilter()


  const mappingColumns = useDeepCompareMemo(() => {
    let originalColumns = columns.map<ColumnDef<T>>((column) => {
      return {
        enableSorting: column.sort || false,
        enableColumnFilter: column.sort || false,
        header: column.name,
        accessorKey: column.id,
        cell: (info) => {
          const rowValue = info.row.original as T
          const value = info.getValue()
          return renderCell(rowValue, column.id, value, column.type)
        }
      }
    })

    if (enableRowSelection) {
      originalColumns = [
        {
          id: 'select',
          header: ({ table }) => {
            return <CustomCheckbox
              hideLabel
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={handleAllRowSelection(table)}
            />
          },
          cell: ({ row }) => {
            return <CustomCheckbox
              hideLabel
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={handleRowSelection(row)}
            />
          }
        },
        ...originalColumns
      ]
    }

    return originalColumns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, dataSet])

  const table = useReactTable({
    data,
    columns: mappingColumns,
    state: {
      sorting,
    },
    enableRowSelection: enableRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useDeepCompareEffect(() => {
    table.resetRowSelection()
    setDataSet(new Set())
  }, [data])


  const { count, page, onRowsPerPageChange, onPaginationChange } = useTablePagination(pagination, table)

  return <>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <CustomTableFilterForm id={id} title={title} />
    </Menu>
    <Table sx={{ border: `1px solid ${theme.customPalette.grey30}` }}>
      <TableHead>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableCell
                  key={header.id} colSpan={header.colSpan}
                  sx={{
                    verticalAlign: 'top',
                    padding: '8px',
                    userSelect: 'none',
                    backgroundColor: theme.customPalette.grey10,
                    '&:hover': {
                      backgroundColor: header.column.getCanSort() ? theme.customPalette.grey20 : theme.customPalette.grey10
                    },
                    cursor: header.column.getCanSort() ? 'pointer' : undefined,
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <CustomTypography sx={{
                      position: 'relative',
                      fontWeight: theme.fontWeight.semiBold
                    }}>
                      {header.isPlaceholder
                        ? null
                        : <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ArrowUpward sx={{
                              position: 'absolute',
                              marginLeft: '0.5rem',
                              fontSize: '1rem',
                            }} />,
                            desc: <ArrowDownward sx={{
                              position: 'absolute',
                              marginLeft: '0.5rem',
                              fontSize: '1rem',
                              top: '4px',
                            }} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </>
                      }
                    </CustomTypography>
                    {header.column.getCanFilter()
                      ? <CustomIconButton
                        onClick={(e) => {
                          handleFilterClick(e, header.column.id, flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )?.toString() ?? '')
                        }}
                        sx={{
                          color: getIsFiltering(header.column.id) ? (theme) => theme.customPalette.main80 : (theme) => theme.customPalette.grey70
                        }}
                      >
                        <FilterAlt />
                      </CustomIconButton>
                      : <></>}
                  </Stack>
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map(row => {
          return (
            <TableRow hover key={row.id} sx={{
              backgroundColor: row.getIsSelected() ? theme.customPalette.grey20 : undefined,
            }}>
              {row.getVisibleCells().map((cell) => {
                const isActionCell = cell.column.id === 'actions' || cell.column.id === 'select'
                const column = columns.find((column) => column.id === cell.column.id)
                const style = column?.style ? column.style : {}
                return (
                  <TableCell key={cell.id}
                    sx={{
                      verticalAlign: 'top',
                      padding: '8px',
                      paddingTop: '18px',
                      border: `1px solid ${theme.customPalette.grey30}`,
                      width: isActionCell ? '1%' : undefined,
                      maxWidth: '400px',
                      whiteSpace: isActionCell ? 'nowrap' : undefined,
                      ...style
                    }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
      <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )
                }
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </Table>
    {pagination ? <CustomPagination
      count={count}
      page={page}
      rowsPerPage={pagination?.limit}
      selectionCount={selectionCount}
      onRowsPerPageChange={onRowsPerPageChange}
      onPaginationChange={onPaginationChange}
    /> : <></>}
  </>
}