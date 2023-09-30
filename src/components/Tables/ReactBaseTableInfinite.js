import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Table, { AutoResizer } from 'react-base-table'
import Text from 'react-texty'
import 'react-texty/styles.css'
import { AssetsHelpers } from 'src/helpers/AssetsHelpers'
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap'
import Pagination from '@material-ui/lab/Pagination'

ReactBaseTableInfinite.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
}

ReactBaseTableInfinite.defaultProps = {
  PageCount: 0
}

const sizePerPageLists = [15, 25, 50, 100]

function ReactBaseTableInfinite({
  columns,
  data,
  onPagesChange,
  loading,
  pageCount,
  rowKey,
  rowRenderer,
  filters,
  ...props
}) {
  const [ScrollbarSize, setScrollbarSize] = useState(0)
  const tableRef = useRef(null)

  useEffect(() => {
    setScrollbarSize(tableRef?.current?._verticalScrollbarSize || 0)
  }, [data, tableRef])

  const TableCell = ({ className, cellData }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {cellData}
    </Text>
  )

  const TableHeaderCell = ({ className, column }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {column.title}
    </Text>
  )

  const onResize = () => {
    setScrollbarSize(tableRef?.current?._verticalScrollbarSize || 0)
  }

  return (
    <div className="d-flex h-100 flex-column">
      <div
        className="w-100 flex-grow-1"
        style={{
          '--width-scroll': ScrollbarSize ? `${ScrollbarSize}px` : 0
        }}
      >
        <AutoResizer onResize={onResize}>
          {({ width, height }) => (
            <Table
              ref={tableRef}
              {...props}
              fixed
              rowKey={rowKey}
              width={width}
              height={height}
              columns={columns}
              data={data}
              overlayRenderer={() => (
                <>
                  {loading && (
                    <div className="BaseTable-loading">
                      <div className="spinner spinner-primary"></div>
                    </div>
                  )}
                </>
              )}
              emptyRenderer={() =>
                !loading && (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <div>
                      <img
                        className="w-100 max-w-300px"
                        src={AssetsHelpers.toAbsoluteUrl(
                          '/_assets/images/data-empty.png'
                        )}
                        alt="Không có dữ liệu"
                      />
                      <div className="text-center font-size-base mt-15px fw-300">
                        Không có dữ liệu ...
                      </div>
                    </div>
                  </div>
                )
              }
              rowRenderer={rowRenderer}
              components={{ TableCell, TableHeaderCell }}
              ignoreFunctionInColumnCompare={false}
            />
          )}
        </AutoResizer>
      </div>
      {filters && (
        <div className="pagination d-flex justify-content-between align-items-center mt-15px">
          <Pagination
            count={pageCount}
            page={filters.Pi}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => {
              onPagesChange({
                Pi: value,
                Ps: filters.Ps
              })
            }}
          />
          <div className="d-flex align-items-center text-gray-500">
            Hiển thị
            <div className="px-8px">
              <DropdownButton
                as={ButtonGroup}
                key="secondary"
                id={`dropdown-variants-Secondary`}
                variant=" font-weight-boldest"
                title={filters.Ps}
              >
                {sizePerPageLists.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={index}
                    active={item === filters.Ps}
                    onClick={() => {
                      onPagesChange({
                        Pi: 1,
                        Ps: item
                      })
                    }}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            trên trang
          </div>
        </div>
      )}
    </div>
  )
}

export default ReactBaseTableInfinite
