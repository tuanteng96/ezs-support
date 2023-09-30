import http from './configs/http'

const configApi = {
  getConfigName: name => {
    return http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`)
  }
}
export default configApi
