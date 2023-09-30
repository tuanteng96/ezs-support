import React, { useEffect, useRef, useState } from 'react'
import moreApi from 'src/api/more.api'

function FileUpload({ value, onChange, ...props }) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null);

  const handleFileChange = event => {
    setLoading(true)
    const files = event.target.files
    var bodyFormData = new FormData()
    bodyFormData.append('file', files[0])

    moreApi
      .uploadFile(bodyFormData)
      .then(({ data }) => {
        onChange(data?.data)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }

  return (
    <div className="position-relative">
      {loading && (
        <div className="position-absolute top-7px right-7px">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        {...props}
        value={value}
        className="form-control"
        type="file"
        id="formFile"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default FileUpload
