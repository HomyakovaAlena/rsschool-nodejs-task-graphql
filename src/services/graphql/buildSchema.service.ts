import { buildSchema } from "graphql";

export const schema = buildSchema(
  `
  schema {
    query: Query,
    mutation: Mutation
  }

  type Query {
    users: [User],
    posts: [Post],
    profiles: [Profile],
    memberTypes: [MemberType],
    getAll: All,

    user(id: String!): User,
    post(id: String!): Post,
    profile(id: String!): Profile,
    memberType(id: String!): MemberType,

    userWithRelations(id: String!): UserWithRelations,
    usersWithRelations: [UserWithRelations],

    usersWithHisSubscriptionsAndProfile: [UserWithHisSubscriptionsAndProfile],
    userByIdWithSubscribedToUserAndPosts(id: String!): UserByIdWithSubscribedToUserAndPosts,
    usersWithSubscriptionsRecursive: [UsersWithSubscriptionsRecursive]
  },

  type Mutation {
    createUser(input: UserInput): User,
    createProfile(input: ProfileInput): Profile,
    createPost(input: PostInput): Post,
    updateUser(input: UserUpdateInput): User,
    updateProfile(input: ProfileUpdateInput): Profile,
    updatePost(input: PostUpdateInput): Post,
    updateMemberType(input: MemberTypeUpdateInput): MemberType,
    updateSubscribeTo(input: UserSubscriptionInput): User,
    updateUnsubscribeFrom(input: UserSubscriptionInput): User,
  }

  type Post {
    title: String,
    content: String,
    userId: String,
    id: String!
  },

  input PostInput {
    title: String,
    content: String,
    userId: String
  },

  input PostUpdateInput {
    title: String,
    content: String,
    userId: String,
    id: String!
  },

  type Profile {
    avatar: String,
    sex: String,
    birthday: Int,
    country: String,
    street: String,
    city: String
    userId: String,
    memberTypeId: String,
    id: String!
  },  

  input ProfileInput {
    avatar: String,
    sex: String,
    birthday: Int,
    country: String,
    street: String,
    city: String
    userId: String,
    memberTypeId: String
  },  

  input ProfileUpdateInput {
    avatar: String,
    sex: String,
    birthday: Int,
    country: String,
    street: String,
    city: String
    userId: String,
    memberTypeId: String,
    id: String!
  },  

  type MemberType {
    discount: Int,
    monthPostsLimit: Int,
    id: String!
  },  

  input MemberTypeUpdateInput {
    discount: Int,
    monthPostsLimit: Int,
    id: String!
  }, 

  type User {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    subscribedToUserIds: [String],
  },  

  input UserInput {
    firstName: String,
    lastName: String,
    email: String,
  },  

  input UserUpdateInput {
    firstName: String,
    lastName: String,
    email: String,
    subscribedToUserIds: [String],
    id: String!
  }, 

  type All {
    users: [User],
    profiles: [Profile],
    posts: [Post],
    memberTypes: [MemberType]
  },  

  type UserWithRelations {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    posts: [Post],
    profile: Profile,
    memberType: MemberType
  }, 

  type UserWithHisSubscriptionsAndProfile {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [User],
    profile: Profile
  },

  type UserByIdWithSubscribedToUserAndPosts {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    subscribedToUser: [User],
    posts: [Post]   
  }

  type UsersWithSubscriptionsRecursive {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [UsersWithSubscriptions],
    subscribedToUser: [UsersWithSubscriptions]
  }, 

  type UsersWithSubscriptions {
    firstName: String,
    lastName: String,
    email: String,
    id: String!,
    userSubscribedTo: [User],
    subscribedToUser: [User]
  }, 

  input UserSubscriptionInput {
    userId: String,
    id: String,
  }
`
);
