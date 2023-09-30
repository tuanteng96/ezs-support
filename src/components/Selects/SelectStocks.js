import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import PropTypes from 'prop-types'

SelectStocks.propTypes = {
  allStock: PropTypes.bool
}

SelectStocks.defaultProps = {
  allStock: true
}

function SelectStocks({ value, allStock, ...props }) {
  const [StocksList, setStocksList] = useState([])
  const { PermissionStocks, Stocks } = useSelector(({ auth }) => ({
    Stocks: auth?.Info?.Stocks || [],
    PermissionStocks: auth?.PermissionStocks
  }))

  useEffect(() => {
    let newStocks = [...Stocks]
    if (PermissionStocks === 'All Stocks') {
      if (allStock) {
        newStocks = [{ value: '', label: 'Tất cả cơ sở' }, ...Stocks]
      }
    } else {
      newStocks = newStocks.filter(
        o => PermissionStocks && PermissionStocks.some(x => o.ID === x.ID)
      )
    }
    setStocksList(() =>
      newStocks
        .filter(o => o.ID !== 778)
        .map(item => ({
          ...item,
          label: item.Title || item.label,
          value: item.ID || item.value
        }))
    )
  }, [Stocks, PermissionStocks, allStock])

  return (
    <Select
      placeholder="Chọn cơ cở"
      classNamePrefix="select"
      options={StocksList}
      className="select-control"
      value={StocksList.filter(item => Number(value) === Number(item.value))}
      {...props}
    />
  )
}

export default SelectStocks
