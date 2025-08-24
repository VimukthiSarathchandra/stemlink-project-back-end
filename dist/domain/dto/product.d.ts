import { z } from "zod";
declare const CreateProductDTO: z.ZodObject<{
    categoryId: z.ZodString;
    colorIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    name: z.ZodString;
    description: z.ZodString;
    image: z.ZodString;
    stock: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    colorIds?: string[] | undefined;
}, {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    colorIds?: string[] | undefined;
}>;
export { CreateProductDTO };
