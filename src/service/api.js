import {get} from './request'

export const getHomeAdv = (type) => get(`/wxmp/getAdv/${type || 1}`)


