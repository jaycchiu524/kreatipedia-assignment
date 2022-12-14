import { useStore } from '@/store'
import React, { FormEvent, useEffect, useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import { Checkbox, IconButton, Button, Stack, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Pagination,
  Chip,
} from '@mui/material'
import { Container, paginate } from '@/components/commons'
import { Company } from '../api/interfaces/company'
import Header from '@/components/Header'

const JobPostHome = () => {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState<Company[]>([])

  const [selected, setSelected] = React.useState<string[]>([])

  const router = useRouter()
  const companies = useStore((state) => state.companies)
  const remove = useStore((state) => state.removeCompany)
  const bulkRemove = useStore((state) => state.bulkRemoveCompany)

  useEffect(() => {
    setCurrentPage(paginate(companies, rowsPerPage, page))
  }, [companies, page, rowsPerPage])

  const columnHelper = createColumnHelper<Company>()
  const columns = [
    columnHelper.display({
      id: 'select',
      cell: (info) => (
        <Checkbox
          {...{
            inputProps: {
              'aria-label': `Select Company ${info.row.original.name}`,
            },
          }}
          onChange={(e) => {
            if (e.target.checked) {
              setSelected((prev) => [...prev, info.row.original.id])
            } else {
              setSelected((prev) =>
                prev.filter((id) => id !== info.row.original.id),
              )
            }
          }}
          checked={selected.includes(info.row.original.id)}
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => info.getValue(),
      // footer: (info) => info.column.id,
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: () => 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('city', {
      header: () => 'City',
      cell: (job) => job.getValue(),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (info) => {
        return (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/company/edit/${info.row.original.id}`)
                }}
                color="info">
                <EditSharpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  const canRemove = confirm(
                    'Are you sure you want to remove this job post?',
                  )

                  if (canRemove) {
                    remove(info.row.original.id)
                  }
                }}
                color="error">
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )
      },
    }),
  ]
  const table = useReactTable({
    data: currentPage,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const pagination = (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <Pagination
        count={Math.ceil(companies.length / rowsPerPage)}
        page={page}
        shape="rounded"
        onChange={(_, page) => {
          setPage(page)
          window.scrollTo(0, 0)
        }}
      />
    </Stack>
  )

  return (
    <Container>
      <Header />

      <Stack
        sx={{ margin: 2 }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}>
        {selected.length > 0 && (
          <>
            <Button
              color="error"
              variant="contained"
              onClick={(e) => {
                e.preventDefault()
                const canRemove = confirm(
                  'Are you sure you want to remove all selected companies?\nThis action cannot be undone.',
                )

                if (canRemove) {
                  bulkRemove(selected)
                  setSelected([])
                }
              }}>
              Delete all selected
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={(e) => {
                e.preventDefault()
                setSelected([])
              }}>
              Unselect All
            </Button>
          </>
        )}
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault()
            router.push('/company/add')
          }}>
          Insert New Company
        </Button>
      </Stack>

      {pagination}
      <Table color="white" sx={{ marginY: 2 }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter> */}
      </Table>
      {pagination}
    </Container>
  )
}

export default JobPostHome
