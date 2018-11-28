import axios from 'axios'

export default {
  //得到所有的组织机构
  queryOrgs:async ()=>{
    let result=await axios.get('/api/orgs/')
    return result.data
  },
  //创建组织机构
  createOrg:async (org)=>{
    console.log("org"+org)
    let result=await axios.post('/api/orgs/',org)
    return result.data
  },
  //修改组织机构
  modifyOrg: async (org)=>{
    let result=axios.put('/api/orgs/1',org)
    return result
  },
  //删除组织机构
  removeOrg: async (id)=>{
    let result=axios.delete(`/api/orgs/${id}`)
    return result
  }


}
