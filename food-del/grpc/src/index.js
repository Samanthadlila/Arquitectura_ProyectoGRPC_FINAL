import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { handlers } from "./food.service.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  await connectDB();

  const PROTO_PATH = path.join(__dirname, "..", "proto", "food.proto");
  const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(packageDef).food;

  const server = new grpc.Server();
  server.addService(proto.FoodService.service, handlers);

  const port = process.env.GRPC_PORT || 5051;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) throw err;
      console.log(`gRPC server escuchando en 0.0.0.0:${boundPort}`);
      server.start();
    }
  );
}

main().catch(err => {
  console.error("Error iniciando gRPC:", err);
  process.exit(1);
});
