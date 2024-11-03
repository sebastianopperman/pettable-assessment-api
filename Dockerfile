FROM denoland/deno:2.0.4

EXPOSE 8000

WORKDIR /app

COPY deno.json .
RUN deno cache --lock=deno.lock functions.ts

COPY . .

CMD ["deno", "run", "--allow-net", "functions.ts"] 