declare type Month = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December"

declare type AllKeys<T> = T extends unknown ? keyof T : never
