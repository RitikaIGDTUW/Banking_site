'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "@/lib/plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
}=process.env;

export const signIn=async({email, password}:signInProps)=>{
    try{
       const { account } = await createAdminClient();
       const session = await account.createEmailPasswordSession(email, password)
       // persist session secret in cookies so server-side calls can pick up the session
       try {
         const cookieStore = await cookies();
         cookieStore.set("appwrite-session", session.secret, {
           path: "/",
           httpOnly: true,
           sameSite: "strict",
           secure: true,
         });
       } catch (e) {
         // ignore cookie errors (e.g., during unit tests)
         console.warn('Could not set session cookie', e)
       }
       return parseStringify(session)
    }
    catch(error){
        console.log('Error', error)
    }
}
export const signUp=async({password, ...userData}:SignUpParams)=>{
    const {email,  firstName, lastName}=userData;

    let newUserAccount;
    
    try{
         const { account, database } = await createAdminClient();
         

        newUserAccount= await account.create(
          ID.unique(),
          email,
          password,
          `${firstName} ${lastName}`    
        );
        if(!newUserAccount)throw new Error('Error creating user')
        const dwollaCustomerUrl=await createDwollaCustomer({
           ...userData,
           type:'personal'
      })

      if(!dwollaCustomerUrl) throw new Error('Error creating dwolla customer')
        const dwollaCustomerId=extractCustomerIdFromUrl(dwollaCustomerUrl);
      const newUser=await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        {
          ...userData,
          userId:newUserAccount.$id,
          dwollaCustomerId,
          dwollaCustomerUrl
        }
      )


  const session = await account.createEmailPasswordSession({
    email,
    password
  });
const cookieStore = await cookies();
  cookieStore.set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return parseStringify(newUser)
    }
    catch(error){
        console.log('Error', error)
    }
}



export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user=  await account.get();

    return parseStringify(user)
  } catch (error) {
    return null;
  }
}


export const logoutAccount=async()=>{
    try{
        const {account}=await createSessionClient();
        const cookieStore =await cookies(); // ✅ call it
        cookieStore.delete('appwrite-session'); // ✅ delete
        await account.deleteSession('current')
    }catch(error){
        return null;
    }
}

export const createLinkToken=async(user:User)=>{
  try{
    if(!user){
      console.warn('createLinkToken called without user')
      return null;
    }
    // Validate required user fields for Plaid
    if(!user.$id || !user.firstName || !user.lastName){
      const missing = [];
      if(!user.$id) missing.push('$id');
      if(!user.firstName) missing.push('firstName');
      if(!user.lastName) missing.push('lastName');
      const msg = `createLinkToken: missing required user fields: ${missing.join(', ')}`;
      console.error(msg);
      throw new Error(msg);
    }

    const tokenParams: any = {
      user: { client_user_id: user.$id },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    // Log request payload for debugging (avoid logging PII in production)
    console.debug('createLinkToken: tokenParams=', JSON.stringify(tokenParams));

    try{
      const response = await plaidClient.linkTokenCreate(tokenParams);
      return parseStringify({ linkToken: response.data.link_token });
    }catch(err:any){
      // Plaid (axios) error - log response body for debugging
      if(err?.response?.data){
        console.error('Plaid linkTokenCreate error response:', JSON.stringify(err.response.data));
      }
      console.error('createLinkToken failed:', err?.message ?? err);
      throw err;
    }
  }catch(error){
    console.log(error)
    throw error;
  }
}

export const createBankAccount=async({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}:createBankAccountProps)=>{
  try{
    const {database}=await createAdminClient();
    const bankAccount=await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),{
          userId,
          bankId,
          accountId,
          accessToken,
          fundingSourceUrl,
          shareableId,
      }
    )
    return parseStringify(bankAccount)
  }catch(error){

  }
}

export const exchangePublicToken = async({
  publicToken,
  user,
}: exchangePublicTokenProps)=>{
  try{
    const response=await plaidClient.itemPublicTokenExchange({
      public_token:publicToken,
    })
    const accessToken=response.data.access_token;
    const itemId=response.data.item_id;
    //get account info from plaid using access token
    const accountsResponse=await plaidClient.accountsGet({
      access_token:accessToken,
    });
    const accountData=accountsResponse.data.accounts[0];

    //create a processor tokej for dwolla using the access token and account id
    const request: ProcessorTokenCreateRequest={
      access_token:accessToken,
      account_id:accountData.account_id,
      processor:"dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse=await plaidClient.processorTokenCreate(request);
    const processorToken=processorTokenResponse.data.processor_token;

    //create a funding source url for the account using the dwolla customer id,
    // processor token, and the bank name
    const fundingSourceUrl=await addFundingSource({
      dwollaCustomerId:user.dwollaCustomerId,
      processorToken,
      bankName:accountData.name,
    });

    //If the funding source url is not created throw an erro
    if(!fundingSourceUrl)throw Error;

    //create a bank account using the user id , item id, account id , access token, funding source url and sharable id

    await createBankAccount({
      userId:user.$id,
      bankId:itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });
    //revalidate the path to reflect the changes
    revalidatePath("/")
    return parseStringify({
      publicTokenExchange:"complete",
    })

  }catch(error){
    console.error("error", error)
  }
}