export interface UserData {
    email: string;
    name: string;
    cep?: string;
    state?: string;
    city?: string;
}

export interface User {
    id: string
    name: string
    email: string
    cep?: string
    state?: string
    city?: string
    role: string
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string
    name?: string
    type: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
}