import axios from 'axios'

export default {
  //通过用户名模糊查询用户
  queryUsersByUserName:async (userName)=>{
    if(userName===null){
      userName=''
    }
    let result=await axios.get(`/api/users/actions/query/user/name/?username=${userName}`)
    return result.data
  },
  //通过组织机构id查找该组织下的所有用户
  pageIngByOrgId:async (query)=>{
    let result=await axios.get(`/api/users/actions/query/users/${query.orgId}/?page=${query.pageIndex}&size=${query.size}`)
    return result.data
  },
  //对用户进行分页查询
  pageIng:async (query)=>{
    let result=await axios.get(`/api/users/?page=${query.pageIndex}&size=${query.size}`)
    return result.data
  },
  //创建用户
  createUser:async (user)=>{
    let result=await axios.post('/api/users/',user).catch()
    return result.data
  },
  //删除用户
  removeUser:async (id)=>{
    let result=await axios.delete(`/api/users/${id}`)
    return result.data;
  },
  //修改用户
  modifyUser:async (user)=>{
    let result=await axios.put('/api/users/1',user)
    return result.data;
  },
  //用户登录
  async  actionLogin(userApi){
    return  await axios.post('api/users/actions/login',userApi).then((val)=>val.data)
  },
}
