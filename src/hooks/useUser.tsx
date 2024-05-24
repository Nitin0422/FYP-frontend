import { GET_USER } from '@/constants/API';
import User from './../model/user';
import client from "@/axios-config";



export async function useCurrentUser(): Promise<User | null> {
    try {
        const response = await client.get(GET_USER, {
            withCredentials : true
        });
        console.log(response.data.user);
        return response.data.user;
    } catch (err) {
        console.error(err);
        return null;
    }
}



export const useUser = async (): Promise<User | null> => {
    try {
        const response = await client.get(GET_USER);

        if (response.status === 200) {
            console.log(response.data.user);
            return response.data.user 
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
