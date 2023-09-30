import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import configApi from 'src/api/config.api'
import clsx from 'clsx'

SelectTeleHis.propTypes = {
  onChange: PropTypes.func
}

function SelectTeleHis({ onChange, value, isLoading, className, ...props }) {
  const [options, setOptions] = useState([])

  useEffect(() => {
    getAllTeleHis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getAllTeleHis = async () => {
    const result = window.top.Configs[1].ValueText
    const newResult = result
      ? result.split(',').map(item => ({
          value: item,
          label: item
        }))
      : []
    setOptions(newResult)
  }

  return (
    <Select
      {...props}
      isClearable
      classNamePrefix="select"
      className={clsx('select-control', className)}
      options={options}
      value={value}
      onChange={onChange}
      noOptionsMessage={({ inputValue }) => 'Không có dữ liệu'}
    />
  )
}

export default SelectTeleHis
