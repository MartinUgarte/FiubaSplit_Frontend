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
    name: 'dumpGroupName',
    description: 'dumpGroupDescription',
    category: 'dumpGroupCategory',
    creator_id: "0",
    members: ["0"],
    admins: ["0"]
}

export type User = {
    id: string,
    name: string,
    surname: string,
    email: string
    password: string,
    phone: string,
    date_of_birth: Date
    cbu: string
}

export const dumpUser = {
    id: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: new Date(),
    cbu: ''
}