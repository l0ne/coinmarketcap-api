'use strict'

const fetch = require('node-fetch')
const qs = require('qs')

const BASE_URL = 'https://api.coinmarketcap.com'
const GRAPHS2_URL = 'https://graphs2.coinmarketcap.com'

class CoinMarketCap {
  constructor ({ version = 'v1' } = {}) {
    this.headers = {
      Accept: 'application/json',
      'Accept-Charset': 'utf-8'
    }
    this.url = `${BASE_URL}/${version}`
    this.graph_url = `${GRAPHS2_URL}`
  }

  /**
   * Get ticker information
   *
   * @param {Object=} options Options for the request:
   * @param {Int=} options.start  Return results from rank start + 1 and above
   * @param {Int=} options.limit  Only returns limit number of results
   * @param {String=} options.convert  Return price, 24h volume, and market cap in terms of another currency
   * @param {String=} options.currency  Return only specific currency
   *
   * @example
   * const client = new CoinMarketCap()
   * client.getTicker({limit: 3}).then(console.log).catch(console.error)
   * client.getTicker({limit: 1, currency: 'bitcoin'}).then(console.log).catch(console.error)
   * client.getTicker({convert: 'EUR'}).then(console.log).catch(console.error)
   * client.getTicker({start: 0, limit: 5}).then(console.log).catch(console.error)
   */
  getTicker (args = {}) {
    const { start, limit, convert, currency } = args

    return createRequest({
      url: `${this.url}/ticker${currency ? `/${currency}/`.toLowerCase() : ''}`,
      headers: this.headers,
      query: { start, convert, limit }
    })
  }

  getCharts (args = {}) {
    const { currency, start, end } = args

    return createRequest({
      url: `${this.graph_url}/currencies${
        currency ? `/${currency}/`.toLowerCase() : ''
      }${start ? `${start}/` : ''}${end ? `${end}/` : ''}`,
      headers: this.headers,
      query: null
    })
  }

  /**
   * Get global information
   *
   * @param {Object|String=} options  Options for the request
   * @param {String=} options.convert  Return price, 24h volume, and market cap in terms of another currency
   *
   * @example
   * const client = new CoinMarketCap()
   * client.getGlobal('GBP').then(console.log).catch(console.error)
   * client.getGlobal({convert: 'GBP'}).then(console.log).catch(console.error)
   */
  getGlobal (convert) {
    if (typeof convert === 'string') {
      convert = { convert: convert.toUpperCase() }
    }

    return createRequest({
      url: `${this.url}/global`,
      headers: this.headers,
      query: convert
    })
  }
}

const createRequest = (args = {}) => {
  const { url, headers, query } = args
  const opts = {
    headers,
    method: 'GET'
  }

  return fetch(`${url}${query ? `?${qs.stringify(query)}` : ''}`).then(res =>
    res.json()
  )
}

module.exports = CoinMarketCap
