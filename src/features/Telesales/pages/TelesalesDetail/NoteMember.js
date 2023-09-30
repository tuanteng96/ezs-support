import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import telesalesApi from 'src/api/telesales.api'
import { useParams } from 'react-router-dom'

NoteMember.propTypes = {
  initialValues: PropTypes.string,
  loading: PropTypes.bool
}

function NoteMember({ initialValues, loading }) {
  let { MemberID } = useParams()
  const [values, setValues] = useState('')
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  const onSubmit = e => {
    const value = e.target.value
    setValues(value)
    const newData = {
      items: [
        {
          MemberID: MemberID,
          Note: value
        }
      ]
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      telesalesApi
        .editNoteMember(newData)
        .then(response => {
          //
        })
        .catch(error => console.log(error))
    }, 300)
  }
  return (
    <div className="pl-15px pr-15px pb-15px pt-8px">
      <div className="overlay overlay-block">
        <textarea
          className="w-100 form-control form-control-solid p-12px fw-500"
          rows="6"
          placeholder="Nhập ghi chú"
          onChange={onSubmit}
          value={values}
        ></textarea>
        {loading && (
          <div className="overlay-layer bg-dark-o-10">
            <div className="spinner spinner-primary"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteMember
