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


query ($id: String!) {
  user (id: $id) {
    id
    firstName
  }
}


mutation ($input: UserInput!) {
  createUser (input: $input) {
    id
    firstName
  }
}

{
  "input": {
    "firstName": "ccc",
   "lastName": "ccc",
   "email": "aaa@mail.ru"
  }
}


mutation ($input: ProfileInput!) {
  createProfile (input: $input) {
    id
  }
}

{
  "input": {
"avatar": "aaa",
"sex": "aaa",
"birthday": 25522,
"country": "aaa",
"street": "aaa",
"city": "aaa",
"userId": "70eafce9-ea32-450f-b394-96716fead50b",
"memberTypeId": "basic"
  }
}


"1ebf3091-4a09-407f-b5b4-78801d06734e"
"acbafae5-f082-4bde-aaca-ba2656bcecd1"


query {
   usersWithSubscriptionsRecursive {
      firstName
      id
    subscribedToUser {
      firstName
      id
      subscribedToUser {
        firstName
        id
        subscribedToUserIds     
    }
  }
}
}
 
   

{
  __type(name: "PostInput") {
    name
    description
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
 

{
  "data": {
    "users": [
      {
        "id": "9e0f758f-ba3f-4825-94d0-82f5a350b775",
        "firstName": "ccc"
      },
      {
        "id": "2581e527-51e0-44d9-b8a3-a00bccdd16a4",
        "firstName": "vvv"
      },
      {
        "id": "fdd09c77-5b52-47ce-aba3-e77c8b51d311",
        "firstName": "bbb"
      },
      {
        "id": "650f561e-670b-428f-981b-4cf48a1eabb9",
        "firstName": "aaa"
      }
    ]
  }
}


mutation ($input: UserSubscriptionInput!) {
  updateSubscribeTo (input: $input) {
    firstName
    id
  }
}


{
  "input": {
    "userId": "1e435932-e575-42bb-81a4-f1a4c003a79f",
   "id": "91af8ee1-96c5-414f-b6ff-779854ebcc30"
  }
}
