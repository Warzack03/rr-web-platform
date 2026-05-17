export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Rising Raimon</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
          Base tecnica preservada
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-300">
          Prisma, migraciones, auth, server y documentacion se mantienen. La capa visual se ha
          vaciado para reconstruirla desde cero.
        </p>
      </div>
    </main>
  );
}
