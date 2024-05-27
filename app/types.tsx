import { Category } from "@mui/icons-material"

export type Group = {
    id: number,
    name: string,
    description: string,
    category: string,
    creator_id: string,
    members: string[],
    admins: string[]
}

export const dumpGroup = {
    id: 0,
    name: '',
    description: '',
    category: '',
    creator_id: "",
    members: [],
    admins: []
}

export type User = {
    id: string,
    name: string,
    surname: string,
    email: string
    password: string,
    phone: string,
    date_of_birth: Date,
    cbu: string,
}

export const dumpUser = {
    id: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: new Date(),
    cbu: '',
}

export type Invitation = {
    id: string,
    group_id: string,
    invited_by_id: string,
    invited_user_id: string,
    status: string,
}

export const dumpInvitation = {
    id: "",
    group_id: "",
    invited_by_id: "",
    invited_user_id: "",
    status: "",
}

export type Filters = {
    description: string | undefined,
    category: string | undefined,
    name: string | undefined,
}


export const defaultFilters: Filters = {
    description: '',
    category: '',
    name: '',
}

export type Amount = {
    amount: number,
    percentage: number,
}

export const defaultAmount: Amount = {
    amount: 0,
    percentage: 0
}

export type Expense = {
    id: string,
    group_id: string,
    name: string,
    amount: number,
    payers: { [key: string]: Amount },
    created_date: Date,
    balance: { [key: string]: { [key: string]: number}}
}

export type ExpenseFilters = {
    name: string   
}

export const defaultExpenseFilters = {
    name: ''
}