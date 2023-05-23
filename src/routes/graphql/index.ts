import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphqlBodySchema } from "./schema";
import { validate } from "graphql/validation";
import { ExecutionResult, parse } from "graphql";
import { graphql } from "graphql";
import * as depthLimit from "graphql-depth-limit";
import { schema } from "../../services/graphql/buildSchema.service";
import { root } from "../../services/graphql/resolvers";

const DEPTH = 3;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = JSON.parse(JSON.stringify(request.body.query));
      const variables = JSON.parse(JSON.stringify(request.body.variables));
      const errors = validate(schema, parse(source), [depthLimit(DEPTH)]);
      let result: ExecutionResult = {};
      result.errors = errors;
      if (errors.length) {
        return result;
      }
      const response = await graphql({
        schema: schema,
        source: source,
        rootValue: root,
        variableValues: variables,
        contextValue: {
          db: fastify.db,
          dataloaders: new WeakMap(),
        },
      });
      return response;
    }
  );
};

export default plugin;
