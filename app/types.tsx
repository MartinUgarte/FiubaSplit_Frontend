import { Category } from "@mui/icons-material"

export type Group = {
    id: string,
    name: string,
    description: string,
    category: string,
    creator_id: string,
    members: string[],
    admins: string[]
}

export const dumpGroup = {
    id: '',
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
    creator_id: string
    id: string,
    group_id: string,
    name: string,
    amount: number,
    category: string,
    description: string,
    payers: { [key: string]: Amount },
    created_date: Date,
    balance: { [key: string]: { [key: string]: number}}
}

export const dumpExpense = {
    creator_id: '',
    name: '',
    id: '',
    group_id: '',
    amount: 0,
    category: '',
    description: '',
    payers: {},
    created_date: new Date(),
    balance: {},
}

export type ExpenseFilters = {
    name: string,
    description: string,
    category: string,
    group: string,
}

export const defaultExpenseFilters = {
    name: '',
    description: '',
    category: '',
    group: '',
}

export type DebtFilters = {
    group: string,
    order: string,
}

export const defaultDebtFilters = {
    group: '',
    order: '',
}

export type Debt = {
    group_id: string,
    user_to_pay: string,
    expense_id: string,
    amount: number,
}


export const expense_categories = [
    {
      value: "Regalo",
      label: "Regalo",
    },
    {
      value: "Compras",
      label: "Compras",
    },
    {
        value: "Pareja",
        label: "Pareja",
    },
    {
      value: "Salud y Bienestar",
      label: "Salud y Bienestar",
    },
    {
      value: "Vivienda",
      label: "Vivienda",
    },
    {
        value: "Supermercado",
        label: "Supermercado"
    }
];

export const debt_orders = [
    {
       value: 'asc',
       label: 'Ascendente',
        
    },
    {
        value: 'desc',
        label: 'Descendente',
         
     }
]
