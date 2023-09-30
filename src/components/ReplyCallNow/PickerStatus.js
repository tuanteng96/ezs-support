import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { createPortal } from 'react-dom'
import telesalesApi from 'src/api/telesales.api'
import { Formik, Form } from 'formik'
import configApi from 'src/api/config.api'
import { useSelector } from 'react-redux'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const initialValue = {
  TeleTags: '',
  TeleTagsKH: ''
}

function PickerStatus({ children, data, onChange }) {
  const [visible, setVisible] = useState()
  const [ListType, setListType] = useState([])
  const [loadingType, setLoadingType] = useState(false)
  const [initialValues, setInitialValues] = useState(initialValue)

  const { teleAdv } = useSelector(({ auth }) => ({
    teleAdv: auth?.Info?.rightsSum?.teleAdv || false
  }))

  useEffect(() => {
    let ListTypeTags = []
    let ListTypeTagsKH = []

    if (ListType && ListType.length > 0) {
      for (let type of ListType) {
        if (type.Title === 'Tag khách hàng') {
          if (type.Children) {
            for (let x of type.Children) {
              ListTypeTagsKH.push(x)
            }
          }
        } else {
          if (type.Children) {
            for (let x of type.Children) {
              ListTypeTags.push(x)
            }
          }
        }
      }
    }

    let TeleTagsArr = data?.TeleTags ? data?.TeleTags.split(',') : []
    let newTeleTags = ''
    let newTeleTagsKH = ''

    for (let x of TeleTagsArr) {
      if (ListTypeTags.some(s => x === s.Title)) {
        newTeleTags = x
      }
      if (ListTypeTagsKH.some(s => x === s.Title)) {
        newTeleTagsKH = x
      }
    }

    setInitialValues(prevState => ({
      ...prevState,
      TeleTags: newTeleTags,
      TeleTagsKH: newTeleTagsKH
    }))
  }, [data, ListType])

  useEffect(() => {
    if (visible) {
      getTypeConfig()
    }
  }, [visible])

  const getTypeConfig = async () => {
    setLoadingType(true)
    try {
      const { data } = await configApi.getConfigName('tagkh')
      if (data && data.data && data?.data.length > 0) {
        const result = JSON.parse(data.data[0].Value)
        setListType(result)
      }
      setLoadingType(false)
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = ({ TeleTags, TeleTagsKH, ...values }, { resetForm }) => {
    let valueWrap = [
      ...(TeleTags ? TeleTags.split(',') : []),
      ...(TeleTagsKH ? TeleTagsKH.split(',') : [])
    ]
    var valuePost = valueWrap ? [...new Set(valueWrap)] : ''

    onChange(valuePost ? valuePost.join(',') : '', setVisible(false))
  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })}
      {createPortal(
        <Modal
          size="lg"
          show={visible}
          onHide={() => setVisible(false)}
          //dialogClassName="max-w-400px"
          scrollable={true}
          enforceFocus={false}
          contentClassName="h-100"
        >
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {formikProps => {
              const { values, handleBlur, submitForm, setFieldValue } =
                formikProps

              return (
                <Form className="h-100 d-flex flex-column">
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <div>
                        <div className="fw-600 font-size-lg text-uppercase">
                          Trạng thái
                        </div>
                      </div>
                    </Modal.Title>
                  </Modal.Header>
                  <div
                    className="overflow-auto flex-grow-1 p-15px"
                    style={{ position: 'relative' }}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {!loadingType && (
                        <>
                          {ListType &&
                            ListType.filter(
                              x => x.Title !== 'Tag khách hàng'
                            ).map((type, index) => (
                              <div className="mb-15px form-group" key={index}>
                                <label className="font-label fw-700 font-size-15px">
                                  {index + 1}. {type.Title}
                                </label>
                                <div className="checkbox-list mt-8px">
                                  {type.Children &&
                                    type.Children.map((x, idx) => (
                                      <label
                                        className="checkbox d-flex cursor-pointer"
                                        key={idx}
                                      >
                                        <input
                                          type="checkbox"
                                          name="TeleTags"
                                          value={x.Title}
                                          onChange={evt => {
                                            let { checked, value } = evt.target
                                            setFieldValue(
                                              'TeleTags',
                                              checked ? value : ''
                                            )
                                          }}
                                          onBlur={handleBlur}
                                          checked={values.TeleTags === x.Title}
                                        />
                                        <span className="checkbox-icon"></span>
                                        <span className="fw-500 font-label font-size-15px">
                                          {x.Title}
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            ))}
                          {ListType &&
                            ListType.filter(
                              x => x.Title === 'Tag khách hàng'
                            ).map((type, index) => (
                              <div className="mb-15px form-group" key={index}>
                                <label className="font-label fw-700 font-size-15px">
                                  {type.Title}
                                </label>
                                <div className="checkbox-list mt-8px">
                                  {type.Children &&
                                    type.Children.map((x, idx) => (
                                      <label
                                        className="checkbox d-flex cursor-pointer"
                                        key={idx}
                                      >
                                        <input
                                          type="radio"
                                          name="TeleTagsKH"
                                          value={x.Title}
                                          onChange={evt => {
                                            let { checked, value } = evt.target
                                            setFieldValue(
                                              'TeleTagsKH',
                                              checked ? value : ''
                                            )
                                          }}
                                          onBlur={handleBlur}
                                          checked={
                                            values.TeleTagsKH === x.Title
                                          }
                                        />
                                        <span className="checkbox-icon"></span>
                                        <span className="fw-500 font-label font-size-15px">
                                          {x.Title}
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                  <Modal.Footer>
                    <button
                      className="btn btn-secondary py-10px py-10px"
                      type="button"
                      onClick={() => setVisible(false)}
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      className={'btn btn-success py-10px'}
                      onClick={submitForm}
                    >
                      Lưu trạng thái
                    </button>
                  </Modal.Footer>
                </Form>
              )
            }}
          </Formik>
        </Modal>,
        document.body
      )}
    </>
  )
}

export default PickerStatus
