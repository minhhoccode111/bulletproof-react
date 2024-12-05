import * as z from 'zod';

// function encapsulates the logic for reading, validating, and transforming
// environment variables
const createEnv = () => {
  const EnvSchema = z.object({
    // a required string
    API_URL: z.string(),
    // must be 'true' or 'false'. then transform 'true' to true (boolean)
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
    // optional, default to http://localhost:3000
    APP_URL: z.string().optional().default('http://localhost:3000'),
    // optional, default to 8080
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
  });

  // import.meta.env: contains all the environment variables
  // convert to this format [[key, value], [key, value], ...]
  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    // filter variables that start with VITE_APP_
    if (key.startsWith('VITE_APP_')) {
      // remove prefix VITE_APP_ from the keys
      // store result in envVars as key-value
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  // validate envVars against EnvSchema
  const parsedEnv = EnvSchema.safeParse(envVars);
  // if valid: {success: true, data: {...}}
  // if invalid: {success: false, error: {...}}

  // if environment variables are not valid, throw and display all errors
  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
      The following variables are missing or invalid:
      ${Object.entries(parsedEnv.error.flatten().fieldErrors)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}
      `,
    );
  }

  // else return the parsed environment variables data object
  return parsedEnv.data;
};

// export the result of createEnv
export const env = createEnv();
