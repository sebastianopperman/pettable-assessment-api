FROM denoland/deno:2.0.4

WORKDIR /app

COPY deno.json deno.lock* ./

COPY . .

RUN deno cache functions/*.ts main.ts

EXPOSE 3000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"] 