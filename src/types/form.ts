export interface FormState {
    username: string;
    password: string;
    remember: boolean;
}

export interface RegisterFormState {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreement: boolean;
}

export interface ResetFormState {
    email: string;
} 