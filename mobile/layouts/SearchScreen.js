import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ClassificationTagList from '../components/ClassificationTagList'
import TagList from '../components/TagList'
import { useGetTagListQuery, useGetUserTagListQuery } from '../store/userApi/userApiSlicer'
import SearchUserList from '../components/SearchUserList'
import { useSearchUserMutation } from '../store/contactApi/contactApiSlicer'

export default function SearchScreen() {
  
  const [tagList,setTagList] = useState([])
  const [userTagList,setUserTagList] = useState([])
  const [searchText,setSearchText] = useState("")
  const [userList,setUserList] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const getTagList = useGetTagListQuery()
  const getUserTagList = useGetUserTagListQuery() 
  const [searchUser,resSearchUser] = useSearchUserMutation()

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      getTagList.refetch()
      getUserTagList.refetch()
      setRefreshing(false)
    }, []);

  async function UserSearch(){
    await searchUser({searchText:searchText}).unwrap()
    .then((e) => {
      console.log(e);
      setUserList(e.data)
    })
  }

  useEffect(() => {
    if(getTagList.isSuccess){
      setTagList(getTagList.data.data)
    }
  },[getTagList.isSuccess,getTagList.isFetching])

  useEffect(() => {
    if(getUserTagList.isSuccess){
      setUserTagList(getUserTagList.data.data)
    }
  },[getUserTagList.isSuccess,getUserTagList.isFetching])

  useEffect(() => {
    if(searchText != ""){
      console.log("AAA::DDD");
      
      UserSearch()
    }
  },[searchText])

  return (
    <View style={styles.container}>
      <TextInput value={searchText} onChangeText={(e) => setSearchText(e)} style={styles.searchInputStyle} placeholder='Ara' />
      
      <ScrollView style={styles.tagContainerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >

        {searchText == "" ? <View><View style={styles.classificationContainerStyle} >
          <ClassificationTagList tagList={tagList} />
        </View>

        <View>
          <TagList userTagList={userTagList} />
        </View></View> : <SearchUserList userList={userList} />}



      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:52,
    marginBottom:52
  },

  searchInputStyle:{
    backgroundColor:"white",
    marginHorizontal:16,
    paddingHorizontal:12,
    borderRadius:10,
    borderColor:"gray",
    borderWidth:2
  },
  tagContainerStyle:{
    marginTop:10,
    
  },
  classificationContainerStyle:{
    marginBottom:10
  }
})