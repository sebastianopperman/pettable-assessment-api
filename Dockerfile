FROM denoland/deno:2.0.4

WORKDIR /app

COPY deno.json deno.lock* ./

COPY . .

RUN deno cache --lock=deno.lock functions.ts

CMD ["deno", "run", "--allow-net", "main.ts"] 