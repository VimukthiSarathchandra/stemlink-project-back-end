"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDTO = void 0;
const zod_1 = require("zod");
const CreateProductDTO = zod_1.z.object({
    categoryId: zod_1.z.string().min(1),
    colorIds: zod_1.z.array(zod_1.z.string()).optional(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    image: zod_1.z.string().min(1),
    stock: zod_1.z.number(),
    price: zod_1.z.number().nonnegative(),
});
exports.CreateProductDTO = CreateProductDTO;
//# sourceMappingURL=product.js.map