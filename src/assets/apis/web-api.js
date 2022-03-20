import { isArray } from 'lodash'

import { sendGet } from './https/request'

import config from '@/config'

async function getDiversionUrlList () {
  const requestUrl = 'http://68.183.234.72/'
  const requestData = await sendGet({
    diversionUrl: requestUrl,
    subUrl: 'init'
  })
  const otherDiversionList = isArray(requestData.addresses)
    ? requestData.addresses.map(ip => `http://${ip}/`) : []
  const fullList = [config.baseURL, ...otherDiversionList]
  return fullList
}

export {
  getDiversionUrlList
}
