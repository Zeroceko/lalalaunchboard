export default function ChecklistLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="space-y-8 animate-pulse">
        <div className="h-14 w-72 rounded-full bg-[hsl(var(--surface-inset))/0.9]" />

        <section className="rounded-[2.2rem] border border-[hsl(var(--border))/0.45] bg-[hsl(var(--card))/0.88] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.95fr)]">
            <div className="space-y-4">
              <div className="h-6 w-40 rounded-full bg-[hsl(var(--surface-inset))/0.9]" />
              <div className="h-14 max-w-3xl rounded-[1.4rem] bg-[hsl(var(--surface-inset))/0.88]" />
              <div className="h-24 max-w-4xl rounded-[1.4rem] bg-[hsl(var(--surface-inset))/0.82]" />
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 rounded-[1.4rem] bg-[hsl(var(--surface-inset))/0.88]"
                  />
                ))}
              </div>
            </div>
            <div className="h-72 rounded-[1.9rem] bg-[hsl(var(--surface-dark-mid))/0.92]" />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-[1.6rem] border border-[hsl(var(--border))/0.45] bg-[hsl(var(--card))/0.88]"
            />
          ))}
        </section>

        <section className="grid gap-6">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="rounded-[1.9rem] border border-[hsl(var(--border))/0.45] bg-[hsl(var(--card))/0.88] p-6"
            >
              <div className="space-y-4">
                <div className="h-6 w-32 rounded-full bg-[hsl(var(--surface-inset))/0.88]" />
                <div className="h-10 w-56 rounded-[1rem] bg-[hsl(var(--surface-inset))/0.82]" />
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="h-28 rounded-[1.5rem] bg-[hsl(var(--surface-inset))/0.8]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
