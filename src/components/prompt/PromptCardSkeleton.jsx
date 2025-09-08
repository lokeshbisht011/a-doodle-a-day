export default function PromptCardSkeleton() {
  return (
    <div className="animate-pulse border-2 border-primary rounded-lg p-6 space-y-4">
      <div className="h-6 w-32 bg-muted rounded mx-auto" />
      <div className="h-4 w-48 bg-muted rounded mx-auto" />
      <div className="h-4 w-24 bg-muted rounded mx-auto" />

      <div className="h-8 w-3/4 bg-muted rounded mx-auto mt-6" />
      <div className="h-4 w-2/3 bg-muted rounded mx-auto mt-4" />
      <div className="h-10 w-40 bg-muted rounded mx-auto mt-6" />
    </div>
  );
}
