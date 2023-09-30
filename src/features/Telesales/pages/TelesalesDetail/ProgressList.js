import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import SelectProgress from 'src/components/Selects/SelectProgress'
import { useNavigate, useParams } from 'react-router-dom'
import telesalesApi from 'src/api/telesales.api'
import { TelesalesContext } from '../..'
import { useTeleDetail } from './TelesalesDetailLayout'

ProgressList.propTypes = {
  initialValues: PropTypes.string,
  MemberLoading: PropTypes.bool
}

function ProgressList({ initialValues, MemberLoading, ...props }) {
  let { MemberID } = useParams()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState(null)
  const { onOpenProfile } = useContext(TelesalesContext)
  const navigate = useNavigate()

  const { setTagsSelected } = useTeleDetail()

  useEffect(() => {
    if (initialValues) {
      setValues(() =>
        initialValues.split(',').map(item => ({
          label: item,
          value: item
        }))
      )
      setTagsSelected(
        initialValues.split(',').map(item => ({
          label: item,
          value: item
        }))
      )
    }
  }, [initialValues, setTagsSelected])

  const onSubmit = otp => {
    setLoading(true)
    let newData = {
      items: [
        {
          MemberID: MemberID,
          TeleTags: otp ? otp.map(item => item.value).join(',') : ''
        }
      ]
    }
    telesalesApi
      .editTagsMember(newData)
      .then(response => {
        setValues(otp)
        setLoading(false)
        setTagsSelected(otp)
      })
      .catch(error => console.log(error))
  }
  return (
    <div className="telesales-detail-head border-bottom px-18px d-flex align-items-center justify-content-center">
      <div
        className="w-40px h-40px border rounded-circle cursor-pointer position-relative mr-10px d-xl-none"
        onClick={() => navigate('/danh-sach')}
      >
        <i className="fa-regular fa-arrow-left position-absolute left-12px top-12px"></i>
      </div>
      <SelectProgress
        isLoading={loading || MemberLoading}
        //isDisabled={loading}
        isMulti
        className="w-100 flex-1"
        placeholder="Chọn Tags khách hàng"
        onChange={onSubmit}
        value={values}
      />
      <div
        className="w-40px h-40px border rounded-circle cursor-pointer position-relative ml-10px d-xl-none bg-primary shadow"
        onClick={onOpenProfile}
      >
        <i className="fa-solid fa-user text-white position-absolute left-13px top-12px"></i>
      </div>
    </div>
  )
}

export default ProgressList
