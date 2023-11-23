import { MongoClient, ServerApiVersion } from 'mongodb';

export const handler = async (event) => {

    const payload = JSON.parse(event.body);

    try
        {
            require("dotenv").config();
            const uri = process.env.MONGO_DB_URI;

            // Create and connect to MongoClient (With MongoClientOptions object for stable API version)
            const client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });
            await client.connect()
            const database = client.db("PreserveBackendDB")
            const studentCollection = database.collection(("studentCollection"))

            // Payload for signing up:
            // Location
            // Full name
            // Password
            // studentCollectionIDNumber
            // University
            // Phone number
            // Email

            // Payload for logging in:
            // Email
            // Password
            

            // Sign up
            if (payload.university)
            {   
                // Create student record for this user
                await studentCollection.insertOne({...payload})

                // Redirect to main page
                return {statusCode:307}
            }
            
            // Log in
            else
            {   
                // Attempt to find the login details inside the studentCollection
                const studentRecord = await studentCollection.findOne({email: payload.email})

                // Cannot find the student record
                if(!studentRecord)
                {
                    // Redirect to sign up page
                    return {statusCode:404}
                }   
                else
                {   
                    // Unique ID for every student record (automatic)
                    const userID = studentRecord._id; 
                    return {statusCode:200, userID} // Redirect to main website + return user ID to show listings
                }
            }
        }
    
    catch(exception) 
        {
            return {status:500, error:exception.message}
        }
};
