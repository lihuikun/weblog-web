export interface FormState {
    email: string;
    nickname: string;
    password: string;
    remember: boolean;
}

export interface RegisterFormState {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreement: boolean;
}

export interface ResetFormState {
    email: string;
} 