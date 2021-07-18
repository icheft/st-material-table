import { range } from "lodash"
import React, { useEffect, useState, Fragment } from "react"
import Loader from "react-loader-spinner"
import {
  makeStyles,
  withStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
} from "@material-ui/core"

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@material-ui/icons"

import {
  ArrowTable,
  ComponentProps,
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"

interface TableProps {
  data: ArrowTable
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 650,
  },
  tablePaginationSelectIcon: {
    color: "#f8f8f2",
  },
  tablePaginationSelect: {
    color: "#f8f8f2",
  },
  select: {
    "&$focus": {
      backgroundColor: "#44475a",
    },
    focus: {},
  },
})

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
)

const StyledIconButton = withStyles({
  root: {
    color: "#f8f8f2",
    // $disabled is a reference to the local disabled
    // rule within the same style sheet.
    // By using &, we increase the specificity.
    "&$disabled": {
      color: `${"#f8f8f2"}a3`,
    },
  },
  label: {
    textTransform: "capitalize",
  },
  disabled: {},
})(IconButton)

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <StyledIconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </StyledIconButton>
      <StyledIconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </StyledIconButton>
      <StyledIconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </StyledIconButton>
      <StyledIconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </StyledIconButton>
    </div>
  )
}

const StickyHeadTable = (props: ComponentProps) => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data }: TableProps = props.args

  const dataRows = data.dataRows

  useEffect(() => {
    Streamlit.setFrameHeight()
    setIsLoading(false)
  }, [])

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage)
  // }

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(+event.target.value)
  //   setPage(0)
  // }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <div>
      {isLoading && (
        <Loader type="ThreeDots" color="#bd93f9" height="100" width="100" />
      )}
      {
        <div>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRows
                    isHeader={true}
                    table={data}
                    pageStartRow={0}
                    pageEndRow={0}
                  />
                </TableHead>
                <TableBody style={{ backgroundColor: "#282a36" }}>
                  <TableRows
                    isHeader={false}
                    table={data}
                    pageStartRow={page * rowsPerPage}
                    pageEndRow={page * rowsPerPage + rowsPerPage}
                  />
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              style={{ background: "#282a36", color: "#f8f8f2" }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={dataRows}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: false,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              classes={{
                selectIcon: classes.tablePaginationSelectIcon,
                select: classes.tablePaginationSelect,
              }}
            />
          </Paper>
        </div>
      }
    </div>
  )
}

interface TableRowsProps {
  isHeader: boolean
  table: ArrowTable
  pageStartRow: number
  pageEndRow: number
}

const TableRows = (props: TableRowsProps) => {
  const { isHeader, table, pageStartRow, pageEndRow } = props
  const { headerRows, rows, columns } = table
  const startRow = isHeader ? 0 : headerRows + pageStartRow
  let endRow = isHeader ? headerRows : headerRows + pageEndRow
  endRow = endRow >= rows ? rows : endRow

  if (isHeader) {
    const tableRows = range(startRow, endRow).map((rowIndex) => {
      return range(0, columns).map((columnIndex) => {
        const { content } = table.getCell(rowIndex, columnIndex)

        return (
          <TableCell
            key={content.toString()}
            align="center"
            style={{
              minWidth: "100%",
              backgroundColor: "#1f2029",
              color: "#f8f8f2",
            }}
          >
            {content}
          </TableCell>
        )
      })
    })
    return <TableRow>{tableRows}</TableRow>
  } else {
    const tableRows = range(startRow, endRow).map((rowIndex) => {
      const cells = range(0, columns).map((columnIndex) => {
        const { content, type } = table.getCell(rowIndex, columnIndex)
        switch (type) {
          case "blank": {
            return (
              <TableCell
                key={columnIndex}
                align="center"
                style={{ color: "#f8f8f2" }}
              />
            )
          }
          case "index": {
            return (
              <TableCell
                key={columnIndex}
                align="center"
                style={{ color: "#f8f8f2" }}
              >
                {Number(content)}
              </TableCell>
            )
          }
          case "columns": {
            return (
              <TableCell
                key={columnIndex}
                align="center"
                style={{ color: "#f8f8f2" }}
              >
                {content.toString()}
              </TableCell>
            )
          }
          case "data": {
            return (
              <TableCell
                key={columnIndex}
                align="center"
                style={{ color: "#f8f8f2" }}
              >
                {content.toString()}
              </TableCell>
            )
          }
          default: {
            throw new Error(`Cannot parse type "${type}".`)
          }
        }
      })
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
          {cells}
        </TableRow>
      )
    })
    return <Fragment>{tableRows}</Fragment>
  }
}

export default withStreamlitConnection(StickyHeadTable)
