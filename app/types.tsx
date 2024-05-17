import { Category } from "@mui/icons-material"

export type Group = {
    id: number,
    name: string,
    description: string,
    category: string,
    creator_id: string,
    members: string[]
}

export const dumpGroup = {
    id: 0,
    name: 'dumpGroupName',
    description: 'dumpGroupDescription',
    category: 'dumpGroupCategory',
    creator_id: "0",
    members: ["0"]
}
