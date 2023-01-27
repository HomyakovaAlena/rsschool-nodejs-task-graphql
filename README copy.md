user

{
"firstName": "aaa",
"lastName": "aaa",
"email": "aaa@mail.ru"
}

profile

{
"avatar": "aaa",
"sex": "aaa",
"birthday": 25522,
"country": "aaa",
"street": "aaa",
"city": "aaa",
"userId": "17b51044-9f52-494b-b44b-c97f3c42c5c9",
"memberTypeId": "basic"
}

post

{
"title": "aaa",
"content": "aaa",
"userId": "17b51044-9f52-494b-b44b-c97f3c42c5c9",
}

memberType

{

}

graphql request

{

   user (id: "17b51044-9f52-494b-b44b-c97f3c42c5c9") {
      firstName
   },
   profile (id: "64aa4e1d-182e-4bc6-9d04-eb9421e023a5") {
      city
   },
   post (id: "d0c4507a-c3bb-4e4c-b210-caeab63666df") {
      title
   },
   memberType (id: "basic") {
      id
   }

}


query($id: String = "561ee7b5-11a1-44d1-bec8-a452b5f9c231") {
  user(id: $id) {
    id
    firstName
    lastName
    email
  }
}


query($idUser: String = "233t43g", $idProfile: String = "34233", $idPost: String = "321412", $idMemberType: String= "basic" ) {

    	user (id: $idUser) {
			id
    }
  	profile (id: $idProfile)
    {
			id
    }
    post (id: $idPost)
    {
			id
    }
    memberType (id: $idMemberType)
    {
			id
    }
  }


{
  "idUser": "233t43g",
  "idProfile": "34233",
  "idPost": "321412",
  "idMemberType": "basic"
}


query {
  usersWithRelations {
    
			id
  		profile 
      {
        id
      }
    	posts 
      {
        id
      }
      memberType
      {
        id
      }   
  }

}   	
   


query ($id: String = "bec4d4ce-3519-41b8-a39e-058debfb3fc1") {
  userWithRelations (id: $id) {
			id
  		profile 
      {
        id
      }
    	posts 
      {
        id
      }
      memberType
      {
        id
      }   
  }
}  	
   



query {
  usersWithHisSubscriptionsAndProfile {
			id
  		profile 
      {
        id
      }
    	userSubscribedTo {
        id
      }  
    profile {
      id
    }
  }
}  	



query {
   usersWithSubscriptionsRecursive  {
			id
    	userSubscribedTo {
        id
      }  
    subscribedToUser {
        id
      }  
  }	
} 
