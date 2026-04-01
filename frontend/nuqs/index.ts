import { parseAsString, parseAsInteger } from "nuqs";

export const searchParamsSchema = {
  q: parseAsString.withDefault(""),
  city: parseAsString.withDefault(""),
  limit: parseAsInteger.withDefault(20),
  page: parseAsInteger.withDefault(1),
};
