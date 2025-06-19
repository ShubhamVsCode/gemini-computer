import { registerOTel } from "@vercel/otel";
import { AISDKExporter } from "langsmith/vercel";

export function register() {
    registerOTel({
        serviceName: "dynamic-ui-generator",
        traceExporter: new AISDKExporter(),
    });
} 