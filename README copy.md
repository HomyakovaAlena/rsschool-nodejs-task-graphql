**Task:** [https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/assignment.md](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/assignment.md)

**Deadline:** 2023-01-31 03:00
**Done:** 2023-01-30

**Scoring:**

## Basic Scope
- **+72** Task 1: restful endpoints. **DONE**
- **+72** Subtasks 2.1-2.7: get gql queries. **DONE**
- **+54** Subtasks 2.8-2.11: create gql queries. **DONE**
- **+54** Subtasks 2.12-2.17: update gql queries. **DONE**
- **+88** Task 3: solve `n+1` graphql problem. **DONE**
- **+20** Task 4: limit the complexity of the graphql queries. **DONE**

## Forfeits
- **-30% of max task score** Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.) **X**
- **-60% of max task score** Samples of POST body for gql requests were not provided for those subtasks that were declared to be completed. **X**
- **-100% of max task score** Tests have been modified. **X**
- **-20** No separate development branch **X**
- **-20** No Pull Request **X**
- **-10** Pull Request description is incorrect **X**
- **-20** Less than 3 commits in the development branch, not including commits that make changes only to `Readme.md` or similar files (`tsconfig.json`, `.gitignore`, `.prettierrc.json`, etc.) **X**


**SCORE:** **360 / 360**


**Samples of POST body for gql requests**

  * Get gql requests:  

2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  

***query {
  getAll {
    users {
      firstName
      id
    }
    profiles {
      id
      city
      country
    }
    posts {
      id
      title
    }
    memberTypes {
      id
    }
  }
}***

   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  

***query ($idUser: String!, $idProfile: String!, $idPost: String!, $idMemberType: String!) {
   user (id: $idUser) {
      firstName
      id
   },
   profile (id: $idProfile) {
      city
      id
   },
   post (id: $idPost) {
      title
      id
   },
   memberType (id: $idMemberType) {
      id
   }
}***
***
{ "idUser": "2204d005-9f99-40e4-b134-47d94bcca1eb", 
  "idPost": "1b7c8982-51bf-44b7-b401-f4c890565e0c", 
  "idProfile": "06b0fab3-a0d2-4472-8284-0b203a306f6f", 
  "idMemberType": "basic" 
}
***

2.3. Get users with their posts, profiles, memberTypes.  

***query {
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
}***

2.4. Get user by id with his posts, profile, memberType.  

***query ($id: String!) {
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
}***
***
{
  "id": "fsdfsd",
}
***

2.5. Get users with their `userSubscribedTo`, profile. 

***query {
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
}***

2.6. Get user by id with his `subscribedToUser`, posts.  

***query ($id: String!) {
  userByIdWithSubscribedToUserAndPosts(id: $id) {
    firstName
    id
    subscribedToUser {
      id
      firstName
    }
    posts {
      id
    }
  }
}***
***
{
  "id": "fsdfsd"
}
***

2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`). 

***query { usersWithSubscriptionsRecursive { 
  firstName 
  id 
  userSubscribedTo {
    firstName
    id
    subscribedToUser {
      id
    }
    userSubscribedTo {
      id
    }
  }
  subscribedToUser { 
  firstName 
    id 
    subscribedToUser { 
    firstName
      id 
  }
  userSubscribedTo {
    firstName
    id
  }
  }}}***

   * Create gql requests:   
   
2.8. Create user.

***mutation ($input: UserInput!) {
  createUser (input: $input) {
    id
    firstName
  }
}***
***
{
  "input": {
    "firstName": "ccc",
   "lastName": "ccc",
   "email": "aaa@mail.ru"
  }
}
***

2.9. Create profile.  

***mutation ($input: ProfileInput!) {
  createProfile (input: $input) {
    id
  }
}***
***
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
***

2.10. Create post.

***mutation ($input: PostInput!) {
  createPost (input: $input) {
    id
  }
}***
***
{
  "input": {
"title": "ccc",
"content": "ccc",
"userId": "1bb5127f-9337-47c6-9977-cb6419855bd9"
}
}
***

   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

***created inside schema: src/services/graphql/buildSchema.service.ts***

   * Update gql requests:  

2.12. Update user.  

***mutation ($input: UserUpdateInput!) {
  updateUser (input: $input) {
    id
    firstName
  }
}***
***
{
  "input": {
    "id": "sgergreg",
    "firstName": "vvv",
  }
}
***

2.13. Update profile. 

***mutation ($input: ProfileUpdateInput!) {
  updateProfile (input: $input) {
    id
  }
}***
***
{
  "input": {
"id": "ereheh",
"avatar": "aaa",
"city": "aaa",
"userId": "70eafce9-ea32-450f-b394-96716fead50b"
  }
}
***

   2.14. Update post.  

***mutation ($input: PostUpdateInput!) {
  updatePost (input: $input) {
    id
  }
}***
***
{
  "input": {
"id": "ereheh",
"title": "ccc",
"content": "ccc"
}
}
***

   2.15. Update memberType.  

***mutation ($input: MemberTypeUpdateInput!) {
  updateMemberType (input: $input) {
    id
  }
}***
***
{
  "input": {
"id": "basic",
"discount": 3
}
}
***

   2.16. Subscribe to; unsubscribe from.  

***mutation ($input: UserSubscriptionInput!) {
  updateSubscribeTo (input: $input) {
    firstName
    id
  }
}***
***
{
  "input": {
    "userId": "1e435932-e575-42bb-81a4-f1a4c003a79f",
   "id": "91af8ee1-96c5-414f-b6ff-779854ebcc30"
  }
}
***

***mutation ($input: UserSubscriptionInput!) {
  updateUnsubscribeFrom (input: $input) {
    firstName
    id
  }
}***
***
{
  "input": {
    "userId": "1e435932-e575-42bb-81a4-f1a4c003a79f",
   "id": "91af8ee1-96c5-414f-b6ff-779854ebcc30"
  }
}
***

2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

***created inside schema: src/services/graphql/buildSchema.service.ts***


**Dataloader links**

***creation*** 

src\routes\graphql\index.ts 38 line - creation of dataloaders WeakMap

src\services\memberTypes\memberTypeLoader.service.ts - creation of memberTypes dataloader

src\services\posts\postLoader.service.ts - creation of posts dataloader

src\services\profiles\profileLoader.service.ts - creation of profiles dataloader

src\services\users\userLoader.service.ts - creation of users dataloader


***call***

src\services\graphql\get.gql.service.ts and src\services\graphql\resolvers.ts - look every function which calls functions with "WithBatching" ending


**DepthLimit links**

   
10 line: const DEPTH = 3;

25 line: const errors = validate(schema, parse(source), [depthLimit(DEPTH)]);


POST body of gql query that ends with an error due to the operation of the rule:

***query {
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
    }}}}***
