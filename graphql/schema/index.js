import fs from "fs";
import path from "path";
import { gql } from "apollo-server-express";

const types = gql(
  fs.readFileSync(path.join(__dirname, "types.graphql"), "utf8")
);
const schema = gql(
  fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")
);

export default [types, schema];