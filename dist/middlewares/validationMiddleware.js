"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = void 0;
exports.validateData = validateData;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}
const validateQuery = (schema) => {
    return (req, res, next) => {
        const parseResult = schema.safeParse(req.query);
        if (!parseResult.success) {
            res.status(400).json({ errors: parseResult.error.flatten() });
            return;
        }
        // Extend Request type to include validatedQuery
        req.validatedQuery = parseResult.data;
        next();
    };
};
exports.validateQuery = validateQuery;
