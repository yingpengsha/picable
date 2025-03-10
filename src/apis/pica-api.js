import { sendGet, sendPost, sendPut } from './https/request'
import axios from 'axios'
import extraCategoriesList from '../configs/extraCategories'
import configs from '../configs'

/**
 * sorts
 * @type ua: 默认
 * @type dd: 新到旧
 * @type da: 旧到新
 * @type ld: 最多爱心
 * @type vd: 最多指名
 */

const backendApiUrl = '//localhost:3825/'

// 验证token
async function checkToken ({ diversionUrl, token }) {
  const subUrl = 'keywords'
  const respData = await sendGet({
    diversionUrl, subUrl, token, excludeStatus: [401]
  })
  return respData.message === 'success'
}

// 登录并返回token
async function authorize ({ diversionUrl, username, password }) {
  const subUrl = 'auth/sign-in'
  const body = { email: username, password }
  const respData = await sendPost({
    diversionUrl, subUrl, body, excludeStatus: [400]
  })
  if (respData.code === 400) {
    return false
  }
  return respData.data.token
}

// 返回分类页目录
async function categories ({ diversionUrl, token }) {
  const respData = await sendGet({
    diversionUrl, subUrl: 'categories', token
  })
  const officialCategoriesList = respData.data.categories
  return [...officialCategoriesList, ...extraCategoriesList]
}

// 根据分类（cate）和标签返回漫画列表
async function comics ({
  diversionUrl, token, page = 1, title = '嗶咔漢化', tag = 'jk', sort = 'ua'
}) {
  const titleEscaped = escape(title)
  const tagEscaped = escape(tag)
  const subUrl = `comics?page=${page}&c=${titleEscaped}&t=${tagEscaped}&s=${sort}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comics
}

// 返回某一本漫画详细信息
async function info ({ diversionUrl, token, comicId }) {
  const subUrl = `comics/${comicId}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comic
}

// 返回某一本漫画的分化话
async function episodes ({ diversionUrl, token, comicId, page = 1 }) {
  const subUrl = `comics/${comicId}/eps?page=${page}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.eps
}

// 返回漫画本体（某一话的某一分页面所有图片）
async function picture ({ diversionUrl, token, comicId, epsOrder, page = 1 }) {
  const subUrl = `comics/${comicId}/order/${epsOrder}/pages?page=${page}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data
}

// 返回「看了這本子的人也在看」数组
async function recommend ({ diversionUrl, token, comicId }) {
  const subUrl = `comics/${comicId}/recommendation`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data
}

// 返回「大家都在搜」关键词数组
async function keyword ({ diversionUrl, token }) {
  const subUrl = 'keywords'
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.keywords
}

// 分类搜索
async function searchCategories ({ diversionUrl, token, category, page = 1, sort = 'ua' }) {
  const subUrl = `comics?page=${page}&c=${encodeURI(category)}&s=${sort}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comics
}

// 标签搜索
async function searchTag ({ diversionUrl, token, tag, page = 1, sort = 'ua' }) {
  const subUrl = `comics?page=${page}&t=${encodeURI(tag)}&s=${sort}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comics
}

// 搜索
async function search ({ diversionUrl, token, keyword, page = 1, sort = 'ua' }) {
  const subUrl = `comics/advanced-search?page=${page}`
  const body = {
    categories: [],
    keyword: keyword,
    sort: sort
  }
  const respData = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return respData.data.comics
}

// toggle like or unlike 标记(不)喜欢此漫画
async function like ({ diversionUrl, token, comicId }) {
  const subUrl = `comics/${comicId}/like`
  const body = { comicId }
  const respData = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return respData.data.action
}

// 返回某一本漫画的评论
async function comments ({ diversionUrl, token, comicId, page = 1 }) {
  const subUrl = `comics/${comicId}/comments?page=${page}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data
}

// toggle favourite 标记(不)收藏此漫画
// type favouriteAction = 'favourite' | 'un_favourite'
async function favourite ({ diversionUrl, token, comicId }) {
  const subUrl = `comics/${comicId}/favourite`
  const body = { comicId }
  const respData = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return respData.data.action
}

// 返回 person Info 个人信息
async function personInfo ({ diversionUrl, token }) {
  const subUrl = 'users/profile'
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.user
}

// 返回 favourite 已收藏漫画
async function myFavourite ({ diversionUrl, token, page = 1 }) {
  const subUrl = `users/favourite?s=ua&page=${page}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comics
}

// 返回 我发表的评论
async function myComments ({ diversionUrl, token, page = 1 }) {
  const subUrl = `users/my-comments?page=${page}`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data
}

// 返回神魔推荐
async function shenMoCollections ({ diversionUrl, token }) {
  const subUrl = 'collections'
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.collections
}

// 签到
async function punch ({ diversionUrl, token }) {
  const subUrl = 'users/punch-in'
  const body = { token }
  const respData = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return respData.data.res
  // { status: 'ok', punchInLastDay: '2021-10-17' }
}

// 获取随机本子
async function randomComic ({ diversionUrl, token }) {
  const subUrl = 'comics/random'
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.comics
}

// 下载
async function download ({ diversionUrl, token, comicId, episodesOrder }) {
  const subUrl = `download?diversionUrl=${diversionUrl}&token=${token}&comicId=${comicId}&episodesOrder=${episodesOrder}`
  const downloadRes = (await axios.get(backendApiUrl + subUrl)).data
  return downloadRes
}

// 下载列表
async function downloadInfo () {
  const downloadInfo = (await axios.get(`${backendApiUrl}downloadInfo`)).data
  return downloadInfo
}

// 打包下载
const downloadZipUrl = async function (comicId, episodesOrder) {
  const downloadZipUrl = `${backendApiUrl}downloadZip?comicId=${comicId}&episodesOrder=${episodesOrder}`
  return downloadZipUrl
}

// 获取小程序列表
async function appList ({ diversionUrl, token }) {
  const subUrl = 'pica-apps'
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data
}

// 获取game列表
async function gameList ({ diversionUrl, token, page = 1 }) {
  const subUrl = `games?page=${page}`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.games
}

// 获取某个game详情
async function gameInfo ({
  diversionUrl, token, gameId
}) {
  const subUrl = `games/${gameId}`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.game
}

// 获取某个game评论
async function gameComments ({
  diversionUrl, token, gameId, page = 1
}) {
  const subUrl = `games/${gameId}/comments?page=${page}`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data
}

// 爱心某个game
async function gameLike ({
  diversionUrl, token, gameId
}) {
  const subUrl = `games/${gameId}/like`
  const body = { gameId }
  const json = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return json.data.action
}

// 聊天频道
async function chatRoomList ({ diversionUrl, token }) {
  const subUrl = 'chat'
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data
}

// 发送评论
async function sendComments ({ diversionUrl, token, comicId, content }) {
  const subUrl = `comics/${comicId}/comments`
  const body = { content }
  const json = await sendPost({
    diversionUrl, subUrl, body, token
  })
  return json.message
  // json { code: 200, message:'success' | string, error? }
}

// 排行榜
// tt: 'H24' | 'D7' | 'D30'
async function rank ({ diversionUrl, token, tt }) {
  const subUrl = `comics/leaderboard?tt=${tt}&ct=VC`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.comics
}

// 骑士榜
async function knightRank ({ diversionUrl, token }) {
  const subUrl = 'comics/knight-leaderboard'
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.users
}

// 设置头衔
async function setTitle ({ diversionUrl, token, userId, title }) {
  const subUrl = `users/${userId}/title`
  const body = { title }
  const json = await sendPut({
    diversionUrl, subUrl, body, token
  })
  return json
}

// 注册
async function register ({ diversionUrl, data }) {
  // data = {
  //    "email": email,
  //    "password": password,
  //    "name": name,
  //    "birthday": birthday,
  //    "gender": gender,  // m, f, bot
  //    "answer1": answer1,
  //    "answer2": answer2,
  //    "answer3": answer3,
  //    "question1": question1,
  //    "question2": question2,
  //    "question3": question3
  // }
  const subUrl = 'auth/register'
  const body = { ...data }
  const json = await sendPost({
    diversionUrl, subUrl, body
  })
  return json
}

// 评论点赞
async function commentLike ({ diversionUrl, token, commentId }) {
  const subUrl = `comments/${commentId}/like`
  const json = await sendPost({
    diversionUrl, subUrl, token
  })
  return json.data.action
}

// 获得子评论
async function childrenComments ({ diversionUrl, token, commentId, page = 1 }) {
  const subUrl = `comments/${commentId}/childrens?page=${page}`
  const json = await sendGet({
    diversionUrl, subUrl, token
  })
  return json.data.comments
}

// 锅贴
async function postInfo ({ token, page = 1 }) {
  const subUrl = `posts?offset=${page * 10 - 10}`
  const json = await sendGet({
    diversionUrl: configs.postBaseURL, subUrl, token
  })
  return json.data
}

// 锅贴评论
async function postWebComments ({ token, postId, page = 1 }) {
  const subUrl = `posts/${postId}/comments?offset=${page * 20 - 20}`
  const json = await sendGet({
    diversionUrl: configs.postBaseURL, subUrl, token
  })
  return json.data
}

export {
  checkToken, authorize, categories, comics, info, episodes, picture,
  recommend, keyword, searchCategories, searchTag, search, like, comments, favourite,
  personInfo, myFavourite, myComments, shenMoCollections, punch, randomComic, appList,
  gameList, gameInfo, gameComments, gameLike, chatRoomList, sendComments, rank, knightRank,
  setTitle, register, commentLike, childrenComments, download, downloadInfo, downloadZipUrl,
  postInfo, postWebComments
}
