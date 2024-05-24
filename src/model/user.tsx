type User =  {
    id?: number;
    email?: string;
    last_login?: string;
    is_superuser?: boolean;
    address?: string;
    phone_number?: string;
    is_active?: boolean;
    is_staff?: boolean;
    date_joined?: string;
    groups?: string[]; 
    user_permissions?: string[];
    csrfToken: string | null;
    sessionToken: string | null; 
}

export default User;
